import { FiUpload } from "react-icons/fi";

export default function FileUploadSection({ file, isProcessing, setFile }) {
    return (
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-indigo-400 transition duration-300 mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUpload className="text-indigo-600 text-2xl" />
            </div>
            <label className="cursor-pointer">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    disabled={isProcessing}
                />
                <span className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full inline-block mb-2 transition duration-300">
                    {isProcessing ? "Processing..." : "Choose Image"}
                </span>
                <p className="text-gray-500 text-sm">
                    {file ? file.name : "No image chosen yet"}
                </p>
            </label>
        </div>
    );
}