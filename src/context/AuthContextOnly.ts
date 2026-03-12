import React from 'react';

export interface AuthContextType {
    isAuthenticated: boolean;
    data: {
        user_id: number;
        username: string;
        email: string;
    };
    login: (username: string, password: string) => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);
