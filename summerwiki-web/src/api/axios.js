import axios from 'axios';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

const api = axios.create({
    baseURL: '/api', 
    withCredentials: true //HttpOnly 설정
});

//요청 인터셉터: 요청마다 AccessToken append
api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => { 
    return Promise.reject(error)
});

//응답 인터셉터: 401 Unauthorized 시 토큰 제거 및 로그인 페이지로 리다이렉트
api.interceptors.response.use(response => response,
    async(error) => {
        console.log("Full Error Object:", error);
        console.log("Response Object:", error.response);

        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true; // 무한 루프 방지
            isRefreshing = true;
            try {
                // 토큰 재발급 시도
                const res = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
                
                if(res.status === 200) {
                    const newAccessToken = res.data.data.accessToken;
                    localStorage.setItem('accessToken', newAccessToken);
                    processQueue(null, newAccessToken);
                    //originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest); // 원래 요청 재시도
                }
            } catch (refreshError) {
                console.error("Session expired. Redirecting to login.", refreshError);
                processQueue(refreshError, null);
                localStorage.removeItem('accessToken');
                if (window.location.pathname !== '/') {
                    window.location.href = '/';
                }
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    });

export const getCategories = () => api.get('/categories');
export const createCategory = (name, parentId = null) => api.post('/categories', { name, parentId });
export const updateCategory = (id, name) => api.patch(`/categories/${id}/name`, { name });
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

export const getNote = (id) => api.get(`/notes/${id}`);
export const getNotes = () => api.get('/notes');
export const createNote = (title, categoryId) => api.post('/notes', { title, categoryId, content:""});
export const updateNote = (id, title, content, categoryId) => api.put(`/notes/${id}`, { title, content, categoryId });
export const deleteNote = (id) => api.delete(`/notes/${id}`);
export const searchNotes = (query) => api.get(`/notes/search?q=${encodeURIComponent(query)}`);
export const updateNoteViewCount = (id) => api.patch(`/notes/${id}/view`);

export const getHistories = (id) => api.get(`/histories/${id}`);

export const getUserInfo = () => api.get('/users/me');

export default api;