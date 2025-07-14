import { useState } from "react";
import axios from "axios";

export default function AuthForm({ onAuth }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggle = () => setIsLogin(!isLogin);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const url = `${import.meta.env.VITE_API_URL}/${isLogin ? "login" : "register"}`;
        const data = isLogin ? { email, password } : { email, password, name };
        try {
            await axios.post(url, data, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                }
            });
            alert(isLogin ? "Logged in successfully! 🎉" : "Registered successfully! 🎉");
            onAuth(true);
        } catch (err) {
            alert(`Auth failed: ${err.response?.data?.message || "Please try again"}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-4">
            <div className="w-full max-w-md">
                <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border-2 border-gray-700">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
                        <h2 className="text-2xl font-bold text-center">
                            {isLogin ? "Welcome Back!" : "Join the Adventure!"}
                        </h2>
                        <p className="text-center text-indigo-200 mt-1">
                            {isLogin ? "Continue your learning journey" : "Start your educational quest"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {!isLogin && (
                            <div className="space-y-1">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                    Name
                                </label>
                                <div className="relative">
                                    <input
                                        id="name"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-gray-100"
                                        required
                                    />
                                    <div className="absolute right-3 top-3 text-gray-400">
                                        🧙‍♂️
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="john@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-gray-100"
                                    required
                                />
                                <div className="absolute right-3 top-3 text-gray-400">
                                    ✉️
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-gray-100"
                                    required
                                />
                                <div className="absolute right-3 top-3 text-gray-400">
                                    🔒
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${isSubmitting
                                ? 'bg-purple-800 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 shadow-md hover:shadow-lg'}`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {isLogin ? "Entering the Academy..." : "Creating your account..."}
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    {isLogin ? "Sign In 🏰" : "Sign Up 🚀"}
                                </span>
                            )}
                        </button>

                        <div className="text-center pt-2">
                            <button
                                type="button"
                                onClick={toggle}
                                className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
                            >
                                {isLogin ? "Need an account? Join the adventure!" : "Already enrolled? Enter the academy!"}
                            </button>
                        </div>
                    </form>

                    <div className="px-6 pb-6">
                        <div className="border-t border-gray-700 pt-4">
                            <p className="text-xs text-gray-400 text-center">
                                By continuing, you agree to our <a href="#" className="text-indigo-400 hover:underline"> Terms</a> and <a href="#" className="text-indigo-400 hover:underline">Conditions</a>.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        Made with ♥ for curious minds and lifelong learners
                    </p>
                </div>
            </div>
        </div>
    );
}