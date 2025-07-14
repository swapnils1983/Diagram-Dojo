import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useState, useEffect } from "react";

export default function UploadOCR() {
    const { user } = useAuth();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) setIsLoggedIn(true);
    }, [user]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
            <Navbar
                isLoggedIn={isLoggedIn}
                navigate={navigate}
            />

            <main className="flex-1 py-8 px-4">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}