import { createContext, useContext } from 'react';

// 1. Context만 생성하여 export
export const AuthContext = createContext(null);

// 2. Hook만 따로 export
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};