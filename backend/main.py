from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Response, Cookie, Path
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from PIL import Image, ImageDraw
import easyocr
import numpy as np
import io
import uuid
from datetime import datetime
from bson import ObjectId
import cv2

from config import MONGODB_URL
from utils.auth import hash_password, verify_password, create_token, decode_token
from utils.cloudinary_upload import upload_to_cloudinary

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AsyncIOMotorClient(MONGODB_URL)
db = client["ocr_app"]
users_collection = db["users"]
ocr_collection = db["ocr_results"]

reader = easyocr.Reader(['en'], gpu=False)


class RegisterModel(BaseModel):
    email: EmailStr
    name: str
    password: str

class LoginModel(BaseModel):
    email: EmailStr
    password: str

async def get_current_user(token: str = Cookie(default=None)):
    if not token:
        return None
    try:
        payload = decode_token(token)
        user = await users_collection.find_one({"email": payload["sub"]})
        return user
    except:
        return None

async def require_user(token: str = Cookie(default=None)):
    if not token:
        raise HTTPException(status_code=401, detail="Authentication required")
    try:
        payload = decode_token(token)
        user = await users_collection.find_one({"email": payload["sub"]})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")

@app.post("/register")
async def register(data: RegisterModel):
    existing_user = await users_collection.find_one({"email": data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pw = hash_password(data.password)
    await users_collection.insert_one({
        "email": data.email,
        "name": data.name,
        "password": hashed_pw,
    })
    return {"message": "User registered successfully"}

@app.post("/login")
async def login(data: LoginModel, response: Response):
    user = await users_collection.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"sub": user["email"]})
    response.set_cookie("token", token, httponly=True, max_age=86400)
    return {"message": "Logged in"}

@app.post("/logout")
async def logout(response: Response):
    response.delete_cookie("token")
    return {"message": "Logged out"}

@app.post("/extract-text/")
async def extract_text(
    file: UploadFile = File(...),
    user=Depends(require_user)
):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        image_np = np.array(image)

        results = reader.readtext(image_np)
        output = []
        for bbox, text, confidence in results:
            formatted_bbox = [{"x": float(x), "y": float(y)} for (x, y) in bbox]
            output.append({
                "text": text,
                "confidence": round(confidence, 2),
                "boundingBox": formatted_bbox
            })

        filename = f"{uuid.uuid4()}.jpg"
        cloud_url = upload_to_cloudinary(contents, filename)

        draw = ImageDraw.Draw(image)
        for item in output:
            bbox = item["boundingBox"]
            xs = [p["x"] for p in bbox]
            ys = [p["y"] for p in bbox]
            min_x, max_x = min(xs), max(xs)
            min_y, max_y = min(ys), max(ys)
            draw.rectangle([min_x, min_y, max_x, max_y], fill="white")

        hidden_byte_arr = io.BytesIO()
        image.save(hidden_byte_arr, format='JPEG')
        hidden_byte_arr = hidden_byte_arr.getvalue()
        hidden_filename = f"{uuid.uuid4()}_hidden.jpg"
        hidden_cloud_url = upload_to_cloudinary(hidden_byte_arr, hidden_filename)

        gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
        edges = cv2.Canny(gray, threshold1=50, threshold2=150)

        edges_pil = Image.fromarray(edges)
        edge_byte_arr = io.BytesIO()
        edges_pil.save(edge_byte_arr, format="JPEG")
        edge_bytes = edge_byte_arr.getvalue()
        edge_filename = f"{uuid.uuid4()}_edges.jpg"
        edge_cloud_url = upload_to_cloudinary(edge_bytes, edge_filename)

        insert_result = await ocr_collection.insert_one({
            "user_email": user["email"],
            "image_url": cloud_url,
            "hidden_image_url": hidden_cloud_url,
            "edge_image_url": edge_cloud_url,
            "ocr_data": output,
            "uploaded_at": datetime.utcnow()
        })

        inserted_id = str(insert_result.inserted_id)

        return JSONResponse(content={
            "_id": inserted_id,
            "results": output,
            "image": cloud_url,
            "hidden_image": hidden_cloud_url,
            "edge_image": edge_cloud_url
        })

    except Exception as e:
        import logging
        logging.error(e)
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/user")
async def get_user(user=Depends(get_current_user)):
    if user:
        return {"email": user["email"], "name": user["name"]}
    raise HTTPException(status_code=401, detail="Not authenticated")

@app.get("/extracted-images/")
async def get_extracted_images(user=Depends(require_user)):
    try:
        images_cursor = ocr_collection.find({"user_email": user["email"]}).sort("uploaded_at", -1)
        images = []
        async for img in images_cursor:
            images.append({
                "_id": str(img["_id"]),
                "image_url": img["image_url"],
                "hidden_image_url": img.get("hidden_image_url"),
                "edge_image_url": img.get("edge_image_url"),
                "ocr_data": img["ocr_data"],
                "uploaded_at": img["uploaded_at"].isoformat()
            })
        return {"images": images}
    except Exception as e:
        import logging
        logging.error(e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/extracted-image/{image_id}")
async def get_extracted_image_by_id(
    image_id: str = Path(..., description="MongoDB ObjectId of the image"),
    user=Depends(require_user)
):
    try:
        if not ObjectId.is_valid(image_id):
            raise HTTPException(status_code=400, detail="Invalid image ID format")

        img = await ocr_collection.find_one({
            "_id": ObjectId(image_id),
            "user_email": user["email"]
        })

        if not img:
            raise HTTPException(status_code=404, detail="Image not found")

        print(img.get("hidden_image_url"))
        return {
            "_id": str(img["_id"]),
            "image_url": img["image_url"],
            "hidden_image_url": img.get("hidden_image_url"),
            "edge_image_url": img.get("edge_image_url"),
            "ocr_data": img["ocr_data"],
            "uploaded_at": img["uploaded_at"].isoformat()
        }

    except Exception as e:
        import logging
        logging.error(e)
        raise HTTPException(status_code=500, detail=str(e))
