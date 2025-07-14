import { useState, useEffect } from 'react';

export default function LabelingGame({ hiddenImageUrl, results = [] }) {
    const [placedLabels, setPlacedLabels] = useState([]);
    const [currentLabel, setCurrentLabel] = useState('');
    const [activePosition, setActivePosition] = useState(null);
    const [score, setScore] = useState(0);
    const [showHints, setShowHints] = useState(false);
    const [shuffledLabels, setShuffledLabels] = useState([]);
    const [targetLabel, setTargetLabel] = useState(null);
    const [hiddenLabels, setHiddenLabels] = useState([]);
    const [clickPosition, setClickPosition] = useState(null);

    useEffect(() => {
        setShuffledLabels([...results]?.sort(() => Math.random() - 0.5));
    }, [results]);

    const handleImageClick = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * e.target.naturalWidth;
        const y = ((e.clientY - rect.top) / rect.height) * e.target.naturalHeight;

        setClickPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });

        for (let label of results) {
            const xs = label.boundingBox.map(p => p.x);
            const ys = label.boundingBox.map(p => p.y);
            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);

            if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
                const percentX = (minX / e.target.naturalWidth) * 100;
                const percentY = (minY / e.target.naturalHeight) * 100;
                const width = ((maxX - minX) / e.target.naturalWidth) * 100;
                const height = ((maxY - minY) / e.target.naturalHeight) * 100;

                setActivePosition({ x: percentX, y: percentY, width, height });
                setTargetLabel(label);
                setHiddenLabels(prev => [...prev, label.text]);
                return;
            }
        }

        setActivePosition(null);
        setTargetLabel(null);
    };

    const handleLabelSubmit = () => {
        if (!currentLabel || !activePosition || !targetLabel) return;

        const isCorrect = currentLabel.trim().toLowerCase() === targetLabel.text.trim().toLowerCase();

        const newLabel = {
            text: targetLabel.text,
            displayText: currentLabel,
            x: activePosition.x,
            y: activePosition.y,
            width: activePosition.width,
            height: activePosition.height,
            isCorrect
        };

        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        setPlacedLabels(prev => [...prev, newLabel]);
        setCurrentLabel('');
        setActivePosition(null);
        setTargetLabel(null);
        setClickPosition(null);
        setHiddenLabels(prev => prev.filter(t => t !== targetLabel.text));
    };

    const resetGame = () => {
        setPlacedLabels([]);
        setScore(0);
        setShuffledLabels([...results].sort(() => Math.random() - 0.5));
        setHiddenLabels([]);
        setClickPosition(null);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-100">Labeling Challenge</h1>
            <p className="text-center mb-6 text-gray-300">Click on a part to guess its name. Hidden parts will appear white until you guess them.</p>

            <div className="flex flex-col md:flex-row gap-6">

                <div className="flex-1 relative">
                    <div className="border-2 border-gray-600 rounded-lg overflow-hidden relative bg-gray-900">
                        <img
                            src={hiddenImageUrl}
                            alt="Diagram to label"
                            className="w-full h-auto cursor-crosshair"
                            onClick={handleImageClick}
                        />

                        {results?.map((label, index) => {
                            if (!hiddenLabels.includes(label.text)) return null;

                            const xs = label.boundingBox.map(p => p.x);
                            const ys = label.boundingBox.map(p => p.y);
                            const minX = Math.min(...xs);
                            const maxX = Math.max(...xs);
                            const minY = Math.min(...ys);
                            const maxY = Math.max(...ys);

                            const percentX = (minX / 1000) * 100;
                            const percentY = (minY / 1000) * 100;
                            const width = ((maxX - minX) / 1000) * 100;
                            const height = ((maxY - minY) / 1000) * 100;

                            return (
                                <div
                                    key={index}
                                    className="absolute bg-gray-300 opacity-80 border border-gray-500"
                                    style={{
                                        left: `${percentX}%`,
                                        top: `${percentY}%`,
                                        width: `${width}%`,
                                        height: `${height}%`
                                    }}
                                />
                            );
                        })}

                        {placedLabels.map((label, index) => (
                            <div
                                key={index}
                                className={`absolute flex items-center justify-center text-xs font-medium text-center ${label.isCorrect ? 'bg-green-900/70 text-green-100' : 'bg-red-900/70 text-red-100'}`}
                                style={{
                                    left: `${label.x}%`,
                                    top: `${label.y}%`,
                                    width: `${label.width}%`,
                                    height: `${label.height}%`
                                }}
                            >
                                {label.text}
                            </div>
                        ))}

                        {activePosition && (
                            <div
                                className="absolute border-2 border-blue-400"
                                style={{
                                    left: `${activePosition.x}%`,
                                    top: `${activePosition.y}%`,
                                    width: `${activePosition.width}%`,
                                    height: `${activePosition.height}%`
                                }}
                            />
                        )}

                        {clickPosition && activePosition && (
                            <div
                                className="absolute flex gap-2 bg-gray-700 p-2 rounded shadow-lg border border-gray-600"
                                style={{
                                    left: `${clickPosition.x}px`,
                                    top: `${clickPosition.y}px`,
                                    transform: 'translateY(10px)'
                                }}
                            >
                                <input
                                    type="text"
                                    value={currentLabel}
                                    onChange={(e) => setCurrentLabel(e.target.value)}
                                    placeholder="Enter label"
                                    className="flex-1 px-2 py-1 border border-gray-600 rounded text-sm bg-gray-800 text-gray-100"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleLabelSubmit()}
                                />
                                <button
                                    onClick={handleLabelSubmit}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded text-sm transition-colors"
                                >
                                    ✓
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="md:w-64 space-y-6">
                    <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                        <h3 className="font-bold mb-2 text-gray-100">Score: {score}/{results?.length}</h3>
                        <button
                            onClick={resetGame}
                            className="w-full bg-gray-600 hover:bg-gray-500 text-gray-100 py-2 px-4 rounded-lg transition-colors"
                        >
                            Reset Game
                        </button>
                    </div>

                    <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-800">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-gray-100">Available Labels</h3>
                            <button
                                onClick={() => setShowHints(!showHints)}
                                className="text-indigo-300 hover:text-indigo-100 text-sm transition-colors"
                            >
                                {showHints ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {showHints && (
                            <div className="grid grid-cols-2 gap-2">
                                {shuffledLabels.map((label, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-800 px-2 py-1 rounded text-sm border border-gray-700 text-gray-200"
                                    >
                                        {label.text}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}