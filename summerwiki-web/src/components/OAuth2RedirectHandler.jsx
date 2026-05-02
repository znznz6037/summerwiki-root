import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
    
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (token) {
            localStorage.setItem('accessToken', token);
            //navigate('/');
            window.location.href = '/';
        } else {
            navigate('/login');
        }
    }, [location, navigate]);

    return <div>로그인 처리 중입니다. 잠시만 기다려 주세요...</div>;
};

export default OAuth2RedirectHandler;