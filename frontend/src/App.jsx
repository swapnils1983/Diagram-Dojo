import { Routes, Route, useNavigate } from "react-router";
import AuthForm from "./components/AuthForm";
import UploadOCR from "./components/UploadOCR";
import { useAuth } from "./context/AuthContext";
import ExtractedImages from "./components/ExtractedImages";
import HomePage from "./components/HomePage";
import UploadPage from "./components/UploadPage";
import { useState, useEffect } from "react";
import Games from "./components/Games";

function App() {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) setIsAuthModalOpen(false);
  }, [user]);

  return (
    <>
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <AuthForm onAuth={() => setIsAuthModalOpen(false)} />
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="mt-4 text-sm text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<UploadOCR />}>
          <Route index element={<HomePage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="games/:id" element={<Games />} />
          <Route path="extracted-images" element={<ExtractedImages />} />
        </Route>
        <Route path="/auth" element={<AuthForm onAuth={() => navigate("/")} />} />
      </Routes>
    </>
  );
}

export default App;
