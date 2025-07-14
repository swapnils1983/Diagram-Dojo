import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useParams, useLocation, useNavigate } from 'react-router';
import LabelingGame from './LabelingGame';
import MemoryChallenge from './MemoryChallenge';
import DiagramBuilder from './DiagramBuilder';
import ResultsDisplay from './ResultsDisplay';
import AIExplanation from './AIExplanation';
import GameCards from './GameCards';
import axiosInstance from '../utils/axiosInstance';

function Games() {
    const { id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const [activeGame, setActiveGame] = useState(null);
    const [gameData, setGameData] = useState(() => {
        if (state) {
            return {
                hiddenImageUrl: state.hidden_image_url,
                imageUrl: state.image_url,
                edgeImageUrl: state.edge_image_url,
                results: state.ocr_data
            };
        }
        return null;
    });

    React.useEffect(() => {
        if (!gameData && id) {
            const fetchGameData = async () => {
                try {
                    const res = await axiosInstance.get(`/extracted-image/${id}`);
                    setGameData({
                        hiddenImageUrl: res.data.hidden_image_url,
                        imageUrl: res.data.image_url,
                        edgeImageUrl: res.data.edge_image_url,
                        results: res.data.ocr_data
                    });
                } catch (error) {
                    console.error("Failed to fetch game data:", error);
                    navigate('/');
                }
            };
            fetchGameData();
        }
    }, [id, gameData, navigate]);

    if (!gameData) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="text-xl font-semibold text-gray-400">Loading game data...</div>
            </div>
        );
    }

    const { hiddenImageUrl, imageUrl, results, edgeImageUrl } = gameData;

    const renderActiveGame = () => {
        switch (activeGame) {
            case 'Labeling Game':
                return (
                    <div className="relative">
                        <button
                            onClick={() => setActiveGame(null)}
                            className="absolute top-4 right-4 z-10 bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-600 text-gray-300"
                        >
                            <FiX className="text-gray-300" />
                        </button>
                        <LabelingGame
                            hiddenImageUrl={hiddenImageUrl}
                            results={results}
                            onClose={() => setActiveGame(null)}
                        />
                    </div>
                );
            case 'Memory Challenge':
                return (
                    <div className="relative">
                        <MemoryChallenge
                            imageUrl={imageUrl}
                            detectedLabels={results?.map(item => ({ text: item.text }))}
                            onClose={() => setActiveGame(null)}
                        />
                    </div>
                );
            case 'Diagram Builder':
                return (
                    <div className="relative">
                        <button
                            onClick={() => setActiveGame(null)}
                            className="absolute top-4 right-4 z-10 bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-600 text-gray-300"
                        >
                            <FiX className="text-gray-300" />
                        </button>
                        <DiagramBuilder initialImage={edgeImageUrl} />
                    </div>
                );
            default:
                return (
                    <div className="p-8 bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl mx-auto border-2 border-indigo-900">
                        <div className="space-y-6">
                            <ResultsDisplay
                                imageUrl={imageUrl}
                                results={results}
                                setActiveGame={setActiveGame}
                            />
                            <AIExplanation />
                            <GameCards
                                setActiveGame={setActiveGame}
                                includeDiagramBuilder={true}
                            />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 py-8 px-4">
            {renderActiveGame()}
        </div>
    );
}

export default Games;