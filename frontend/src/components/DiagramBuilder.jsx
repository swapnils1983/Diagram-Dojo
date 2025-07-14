import React, { useRef, useEffect, useState } from "react";

export default function DiagramBuilder({ initialImage }) {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const canvasSize = 512;

    const startDraw = () => setDrawing(true);
    const stopDraw = () => setDrawing(false);

    const draw = (e) => {
        if (!drawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(
            (e.clientX - rect.left) * scaleX,
            (e.clientY - rect.top) * scaleY,
            4,
            0,
            2 * Math.PI
        );
        ctx.fill();
    };

    const clearCanvas = () => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasSize, canvasSize);
        drawBackgroundImage();
    };

    const drawBackgroundImage = () => {
        const ctx = canvasRef.current.getContext("2d");
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            ctx.globalAlpha = 0.2;
            ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
            ctx.globalAlpha = 1.0;
        };
        img.src = initialImage;
    };

    useEffect(() => {
        drawBackgroundImage();
    }, [initialImage]);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-100">Trace the Shape</h1>
            <p className="text-center mb-6 text-gray-300">Trace over the faint image to practice your drawing skills.</p>

            <div className="flex flex-col items-center">
                <div className="border-2 border-gray-600 rounded-lg overflow-hidden mb-4">
                    <canvas
                        ref={canvasRef}
                        width={canvasSize}
                        height={canvasSize}
                        className="bg-white cursor-crosshair w-full max-w-md h-auto"
                        style={{ width: '512px', height: '512px' }}
                        onMouseDown={startDraw}
                        onMouseUp={stopDraw}
                        onMouseOut={stopDraw}
                        onMouseMove={draw}
                    />
                </div>

                <div className="flex gap-4 mb-4">
                    <button
                        onClick={clearCanvas}
                        className="bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 px-4 rounded-lg transition-colors"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
}