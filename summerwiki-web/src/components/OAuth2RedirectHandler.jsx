import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (token) {
            login(token);
            navigate('/', { replace: true });
        } else {
            navigate('/', { replace: true });
        }
    }, [location, navigate, login]);

    return <div>로그인 처리 중입니다. 잠시만 기다려 주세요...</div>;
};

export default OAuth2RedirectHandler;