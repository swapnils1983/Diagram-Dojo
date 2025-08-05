import {
    FiHome,
    FiUpload,
    FiLogOut,
    FiBook,
    FiAward,
    FiX,
    FiLogIn,
    FiImage,
    FiMenu
} from "react-icons/fi";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar({ activeTab }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const isLoggedIn = !!user;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const handleNav = (path) => {
        navigate(path);
        setIsMenuOpen(false); // close menu on mobile after navigation
    };

    return (
        <nav className="bg-gray-800 shadow-sm border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            DD
                        </div>
                        <span className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Diagram Dojo
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => handleNav("/")}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${activeTab === "home"
                                ? "bg-indigo-900 text-indigo-100"
                                : "text-gray-300 hover:text-indigo-400"
                                }`}
                        >
                            <FiHome /> Home
                        </button>

                        {isLoggedIn && (
                            <button
                                onClick={() => handleNav("/extracted-images")}
                                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${activeTab === "extracted-images"
                                    ? "bg-indigo-900 text-indigo-100"
                                    : "text-gray-300 hover:text-indigo-400"
                                    }`}
                            >
                                <FiImage /> Extracted Images
                            </button>
                        )}

                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1 px-3 py-2 rounded-lg text-gray-300 hover:text-indigo-400 transition-colors"
                            >
                                <FiLogOut /> Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => handleNav("/auth")}
                                className="flex items-center gap-1 px-3 py-2 rounded-lg text-gray-300 hover:text-indigo-400 transition-colors"
                            >
                                <FiLogIn /> SignIn
                            </button>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-300 hover:text-indigo-400 focus:outline-none"
                        >
                            {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Nav Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-2 space-y-1 pb-4 border-t border-gray-700 pt-2">
                        <button
                            onClick={() => handleNav("/")}
                            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === "home"
                                ? "bg-indigo-900 text-indigo-100"
                                : "text-gray-300 hover:text-indigo-400"
                                }`}
                        >
                            <FiHome /> Home
                        </button>

                        {isLoggedIn && (
                            <button
                                onClick={() => handleNav("/extracted-images")}
                                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === "extracted-images"
                                    ? "bg-indigo-900 text-indigo-100"
                                    : "text-gray-300 hover:text-indigo-400"
                                    }`}
                            >
                                <FiImage /> Extracted Images
                            </button>
                        )}

                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:text-indigo-400 transition-colors"
                            >
                                <FiLogOut /> Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => handleNav("/auth")}
                                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:text-indigo-400 transition-colors"
                            >
                                <FiLogIn /> SignIn
                            </button>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
