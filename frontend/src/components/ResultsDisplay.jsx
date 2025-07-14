import React from 'react'

function ResultsDisplay({ imageUrl, results, setActiveGame }) {
    return (
        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
                <h3 className="text-xl font-bold mb-3 text-gray-200">Uploaded Image</h3>
                <div className="bg-gray-700 p-3 rounded-lg border border-gray-600 hover:border-indigo-500 transition-colors">
                    <img
                        src={imageUrl}
                        alt="Uploaded content"
                        className="w-full h-auto rounded-md cursor-pointer hover:shadow-lg transition hover:opacity-90"
                        onClick={() => setActiveGame('Labeling Game')}
                    />
                </div>
            </div>
            <div className="flex-1">
                <h3 className="text-xl font-bold mb-3 text-gray-200">Detected Labels</h3>
                <div className="bg-gray-700 rounded-lg p-3 max-h-64 overflow-y-auto border border-gray-600">
                    <div className="grid grid-cols-2 gap-2">
                        {results?.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-gray-800 p-2 rounded border border-gray-700 text-center text-gray-200 hover:bg-gray-700 transition-colors"
                            >
                                {item.text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResultsDisplay