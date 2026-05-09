import { useState } from 'react';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('accessToken'));

    const login = (newToken) => {
        localStorage.setItem('accessToken', newToken);
        localStorage.removeItem('viewedNotes');
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('viewedNotes');
        setToken(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}