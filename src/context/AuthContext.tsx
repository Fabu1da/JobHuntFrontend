import React, { useState, type ReactNode } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContextOnly';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [data, setData] = useState<{ user_id: number; username: string; email: string }>({
        user_id: 0,
        username: '',
        email: ''
    });

    const login = async (username: string, password: string) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
                username,
                password
            });
            const responseData = res.data;

            if (responseData.success) {
                setIsAuthenticated(true);
                setData({
                    user_id: responseData.user_id,
                    username: responseData.username || username,
                    email: responseData.email || ''
                });
            } else {
                throw new Error(responseData.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setIsAuthenticated(false);
            setData({
                user_id: 0,
                username: '',
                email: ''
            });
            throw error;
        }
    };

    const authValue = {
        isAuthenticated,
        data,
        login
    };

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
};
