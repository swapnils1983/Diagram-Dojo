import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { FiImage, FiTag } from 'react-icons/fi';
import { useNavigate } from 'react-router';

export default function ExtractedImages() {
    const [imageData, setImageData] = useState([]);
    const navigate = useNavigate();

    const fetchImageData = async () => {
        try {
            const res = await axiosInstance.get('/extracted-images/');
            setImageData(res.data.images);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchImageData();
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-indigo-400">Extracted Images</h1>
            {imageData.length === 0 ? (
                <p className="text-center text-gray-400">No extracted images found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {imageData.map((image, idx) => (
                        <div
                            key={image._id}
                            className="bg-gray-800 rounded-2xl shadow-md border border-gray-700 hover:shadow-lg transition hover:border-indigo-500"
                        >
                            <div className="p-4 border-b border-gray-700 flex items-center gap-2">
                                <FiImage className="text-indigo-400" />
                                <span className="font-medium text-gray-200">Uploaded Image</span>
                            </div>
                            <img
                                src={image.image_url}
                                alt={`Extracted ${idx}`}
                                className="w-full h-48 object-cover rounded-t-2xl cursor-pointer hover:opacity-90 transition"
                                onClick={() => navigate(`/games/${image._id}`)}
                            />
                            <div className="p-4">
                                <p className="text-sm text-gray-400 mb-2">
                                    <span className="font-semibold">Uploaded At:</span> {new Date(image.uploaded_at).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-300 mb-2 flex items-center gap-1">
                                    <FiTag className="text-gray-400" />
                                    <span className="font-semibold">Labels:</span>
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {image.ocr_data.slice(0, 8).map((label, idx) => (
                                        <span
                                            key={idx}
                                            className="bg-indigo-900 text-indigo-200 text-xs px-2 py-1 rounded-full"
                                        >
                                            {label.text}
                                        </span>
                                    ))}
                                    {image.ocr_data.length > 8 && (
                                        <span className="text-xs text-gray-500">+{image.ocr_data.length - 8} more</span>
                                    )}
                                </div>

                                <button
                                    onClick={() => navigate(`/games/${image._id}`)}
                                    className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 rounded-lg transition hover:shadow-indigo-500/20 hover:shadow-md"
                                >
                                    View & Play Games →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}