export default function Footer() {
    return (
        <footer className="bg-gray-800 border-t border-gray-700">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            DD
                        </div>
                        <span className="ml-2 text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Diagram Dojo
                        </span>
                    </div>

                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} Diagram Dojo. All rights reserved.
                    </p>

                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent my-1"></div>

                    <p className="text-gray-500 text-xs text-center max-w-md">
                        Transforming educational images into interactive learning experiences.
                    </p>
                </div>
            </div>
        </footer>
    );
}
