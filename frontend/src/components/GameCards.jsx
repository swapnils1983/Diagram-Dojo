export default function GameCards({ setActiveGame }) {
    const games = [
        { name: 'Labeling Game', icon: '🏷️', desc: 'Place labels on the diagram' },
        { name: 'Memory Challenge', icon: '🧠', desc: 'Test your recall ability' },
        { name: 'Diagram Builder', icon: '🧩', desc: 'Reconstruct the diagram' },
        // { name: 'Quiz Mode', icon: '❓', desc: 'Answer questions about the diagram' }
    ];

    return (
        <div>
            <h3 className="text-xl font-bold mb-3 text-gray-100">Learning Games</h3>
            <div className="grid md:grid-cols-2 gap-3">
                {games.map((game, idx) => (
                    <div
                        key={idx}
                        className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-indigo-500 hover:shadow-lg transition cursor-pointer flex items-start gap-3 group"
                        onClick={() => setActiveGame(game.name)}
                    >
                        <span className="text-2xl group-hover:text-indigo-400 transition-colors">{game.icon}</span>
                        <div>
                            <div className="font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors">{game.name}</div>
                            <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{game.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}