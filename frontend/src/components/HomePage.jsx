import { FiBook, FiAward, FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router";

export default function HomePage({ setActiveTab }) {
    const navigate = useNavigate();

    return (
        <div className="text-center py-12 px-4 max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-3xl mb-12 shadow-xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Diagram Dojo!</h1>
                <p className="text-xl md:text-2xl text-indigo-100 mb-8">
                    Transform your educational images into interactive learning adventures
                </p>
                <button
                    onClick={() => navigate('/upload')}
                    className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-8 rounded-full text-lg transition duration-300 shadow-lg hover:shadow-xl"
                >
                    Start Your Quest 🚀
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
                {[
                    {
                        icon: <FiBook className="text-blue-400 text-2xl" />,
                        title: "Knowledge Extraction",
                        desc: "Automatically identify and extract diagrams and labels",
                        bg: "bg-gray-800",
                        border: "border-gray-700"
                    },
                    {
                        icon: <FiAward className="text-purple-400 text-2xl" />,
                        title: "Interactive Games",
                        desc: "Master concepts through fun learning challenges",
                        bg: "bg-gray-800",
                        border: "border-gray-700"
                    },
                    {
                        icon: <FiUpload className="text-green-400 text-2xl" />,
                        title: "Easy Upload",
                        desc: "Simply upload your image and let our AI do the rest",
                        bg: "bg-gray-800",
                        border: "border-gray-700"
                    }
                ].map((card, idx) => (
                    <div key={idx} className={`${card.bg} p-6 rounded-2xl border-2 ${card.border} hover:scale-105 transition duration-300`}>
                        <div className={`${card.border.replace('border', 'bg')} w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto`}>
                            {card.icon}
                        </div>
                        <h3 className="text-2xl font-semibold mb-4 text-gray-100">{card.title}</h3>
                        <p className="text-gray-300">{card.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

