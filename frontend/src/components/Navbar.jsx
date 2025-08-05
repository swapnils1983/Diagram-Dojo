import { FiHome, FiUpload, FiLogOut, FiBook, FiAward, FiX, FiLogIn, FiImage } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ activeTab }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const isLoggedIn = !!user;

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };
    return (
        <nav className="bg-gray-800 shadow-sm border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            DD
                        </div>
                        <span className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Diagram Dojo
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${activeTab === "home"
                                ? "bg-indigo-900 text-indigo-100"
                                : "text-gray-300 hover:text-indigo-400"
                                }`}
                        >
                            <FiHome /> Home
                        </button>
                        {isLoggedIn && (
                            <button
                                onClick={() => navigate('/extracted-images')}
                                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${activeTab === "extracted-images"
                                    ? "bg-indigo-900 text-indigo-100"
                                    : "text-gray-300 hover:text-indigo-400"
                                    }`}
                            >
                                <FiImage /> Extracted images
                            </button>
                        )}
                        {isLoggedIn && (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1 px-3 py-2 rounded-lg text-gray-300 hover:text-indigo-400 transition-colors"
                            >
                                <FiLogOut /> Logout
                            </button>
                        )}
                        {!isLoggedIn && (
                            <button
                                onClick={() => navigate('auth')}
                                className="flex items-center gap-1 px-3 py-2 rounded-lg text-gray-300 hover:text-indigo-400 transition-colors"
                            >
                                <FiLogIn /> SignIn
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}