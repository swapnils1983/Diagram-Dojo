import { useState, useEffect } from 'react';
import { FiClock, FiCheck, FiX } from 'react-icons/fi';

export default function MemoryChallenge({ imageUrl, detectedLabels, onClose }) {
    const [recallMode, setRecallMode] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15);
    const [userInputs, setUserInputs] = useState(Array(12).fill(''));
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setRecallMode(true);
        }
    }, [timeLeft]);

    const handleInputChange = (index, value) => {
        const newInputs = [...userInputs];
        newInputs[index] = value;
        setUserInputs(newInputs);
    };

    const handleSubmit = () => {
        const correctLabels = detectedLabels.map(item => item.text.toLowerCase());
        let correctCount = 0;

        userInputs.forEach(input => {
            if (input && correctLabels.includes(input.toLowerCase())) {
                correctCount++;
            }
        });

        setScore(correctCount);
        setSubmitted(true);
    };

    const resetGame = () => {
        setRecallMode(false);
        setTimeLeft(15);
        setUserInputs(Array(12).fill(''));
        setSubmitted(false);
        setScore(0);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-xl shadow-md relative border border-gray-700">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-600 text-gray-300 transition-colors"
            >
                <FiX className="text-gray-300" />
            </button>

            <h1 className="text-2xl font-bold text-center mb-6 text-gray-100">Memory Challenge</h1>

            {!recallMode ? (
                <div className="text-center">
                    <div className="flex flex-col items-center gap-2 mb-4">
                        <div className="flex items-center gap-2 text-lg text-gray-300">
                            <FiClock className="text-indigo-400" />
                            <span>Study Time: {timeLeft} seconds</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div
                                className="bg-indigo-500 h-2.5 rounded-full transition-all duration-1000"
                                style={{ width: `${(timeLeft / 15) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="border-2 border-gray-600 rounded-lg p-4 mb-6 bg-gray-900">
                        <img
                            src={imageUrl}
                            alt="Diagram to memorize"
                            className="w-full h-auto max-h-96 object-contain mx-auto"
                        />
                    </div>
                    <p className="text-gray-400">Memorize the labels in the diagram before they disappear!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-xl font-bold mb-2 text-gray-100">Recall the Labels</h2>
                        <p className="text-gray-400 mb-4">
                            Type as many labels as you can remember. There are {detectedLabels.length} labels in total.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userInputs.map((input, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <span className="text-gray-400 w-8">{index + 1}.</span>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    disabled={submitted}
                                />
                                {submitted && (
                                    <span className={`p-1 rounded-full ${detectedLabels.some(item =>
                                        item.text.toLowerCase() === input.toLowerCase()
                                    ) ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                        {detectedLabels.some(item =>
                                            item.text.toLowerCase() === input.toLowerCase()
                                        ) ? <FiCheck /> : <FiX />}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {submitted ? (
                        <div className="text-center">
                            <div className={`text-xl font-bold mb-4 ${score === detectedLabels.length ? 'text-green-400' :
                                score >= detectedLabels.length / 2 ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                Score: {score}/{detectedLabels.length}
                            </div>
                            <button
                                onClick={resetGame}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-6 rounded-lg transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <button
                                onClick={handleSubmit}
                                className="bg-green-600 hover:bg-green-500 text-white py-2 px-6 rounded-lg transition-colors"
                            >
                                Submit Answers
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}