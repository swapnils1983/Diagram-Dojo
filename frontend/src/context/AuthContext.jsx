import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance.get('/user')
            .then(res => {
                if (res.data?.email) {
                    setUser(res.data);
                }
            })
            .catch(err => {
                console.error("Auth check failed", err);
            })
            .finally(() => setLoading(false));
    }, []);

    const login = async (email, password) => {
        try {
            await axiosInstance.post('/login', { email, password });

            // ✅ FIX: use axiosInstance again here (not axios)
            const { data } = await axiosInstance.get('/user');
            setUser(data);
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post('/logout');
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
