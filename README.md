# Diagram DOJO

Diagram DOJO is a full-stack OCR learning app where users can upload diagram images, extract text labels, and practice through interactive games.

## What it does

- User authentication (register, login, logout) with HTTP-only cookie sessions
- OCR extraction from uploaded diagram images using EasyOCR
- Auto-generated image variants:
  - original uploaded image
  - hidden-label image (text areas blanked out)
  - edge-detected image
- History of extracted images per user
- Interactive learning modules:
  - Labeling Game
  - Memory Challenge
  - Diagram Builder

## Tech stack

### Backend

- FastAPI
- MongoDB (Motor / PyMongo)
- EasyOCR + OpenCV + Pillow + NumPy
- Cloudinary (image hosting)
- JWT auth (`python-jose`) + password hashing (`passlib[bcrypt]`)

### Frontend

- React + Vite
- React Router
- Axios
- Tailwind CSS

## Project structure

```text
backend/
  config.py
  main.py
  requirements.txt
  utils/
    auth.py
    cloudinary_upload.py

frontend/
  package.json
  src/
    App.jsx
    components/
    context/
    utils/
```

## Prerequisites

- Python 3.10+
- Node.js 18+ (or newer LTS)
- MongoDB (local or hosted)
- Cloudinary account

## Environment variables

### Backend (`backend/.env`)

Create a `.env` file inside `backend/`:

```env
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>/<db>?retryWrites=true&w=majority
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SECRET_KEY=your_long_random_secret
```

### Frontend (`frontend/.env`)

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

> CORS in the backend currently allows `http://localhost:5173` and `http://localhost:5174`.

## Setup and run

### 1) Backend

```bash
cd backend
python -m venv .venv
```

Activate virtual environment:

- Windows (cmd):

```bat
.venv\Scripts\activate
```

Install dependencies and run server:

```bash
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 2) Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will print a local URL (typically `http://localhost:5173`).

## API overview

Base URL: `http://127.0.0.1:8000`

- `POST /register` – create account
- `POST /login` – authenticate and set cookie
- `POST /logout` – clear auth cookie
- `GET /user` – get current authenticated user
- `POST /extract-text/` – upload image and run OCR
- `GET /extracted-images/` – list user extraction history
- `GET /extracted-image/{image_id}` – get a specific extraction record

## Typical user flow

1. Register or log in.
2. Upload a diagram image.
3. OCR runs and stores extracted results.
4. View saved extracted images.
5. Open a result and play learning games.

## Notes

- First OCR call may be slower while EasyOCR initializes.
- Uploaded/processed images are stored in Cloudinary.
- Session auth uses an HTTP-only cookie named `token`.

## Troubleshooting

- **CORS errors**: confirm frontend URL matches allowed origins in backend CORS config.
- **401 Unauthorized**: ensure login succeeded and browser is sending cookies.
- **Cloudinary upload failure**: verify Cloudinary environment variables.
- **MongoDB connection errors**: verify `MONGODB_URL` and network access/IP whitelist.

## Development scripts

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Backend

```bash
uvicorn main:app --reload
```
