import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import FileUploadSection from "./FileUploadSection";
import UploadHeader from "./UploadHeader";
import { useNavigate } from "react-router";

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const handleUpload = async () => {
        if (!file) return alert("Please choose an image file.");
        setIsProcessing(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axiosInstance.post("/extract-text/", formData);

            navigate(`/extracted-images`, {
                state: {
                    imageUrl: res.data.image,
                    results: res.data.results
                }
            });
        } catch (err) {
            console.error("Upload error:", err);
            alert("Upload failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="p-8 bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl mx-auto border-2 border-indigo-900">
            <UploadHeader />
            <FileUploadSection
                file={file}
                isProcessing={isProcessing}
                setFile={setFile}
            />
            <button
                onClick={handleUpload}
                disabled={!file || isProcessing}
                className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all ${!file || isProcessing
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                    }`}
            >
                {isProcessing ? "Extracting..." : "Extract Knowledge 🧠"}
            </button>
        </div>
    );
}