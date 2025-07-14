export default function AIExplanation() {
    return (
        <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800">
            <h3 className="text-lg font-bold mb-2 text-blue-300">AI Explanation</h3>
            <p className="text-gray-300 mb-3">Need help understanding this diagram?</p>
            <button className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded transition-colors shadow hover:shadow-blue-500/30">
                Explain Diagram
            </button>
        </div>
    );
}