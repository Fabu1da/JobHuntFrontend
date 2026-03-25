import React from 'react';

export interface AuthContextType {
    isAuthenticated: boolean;
    data: {
        user_id: number;
        username: string;
        email: string;
    };
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    token: string | null;
    isLoading: boolean;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);
