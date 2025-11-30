import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/', // URL Backend của bạn
    headers: {
        'Content-Type': 'application/json',
    },
});
// --- INTERCEPTOR 1: Tự động gắn Token trước khi gửi Request ---
axiosClient.interceptors.request.use(
    (config) => {
        // Lấy token từ LocalStorage (nơi bạn lưu khi login)
        const token = localStorage.getItem('accessToken');
        
        if (token) {
            // Gắn vào Header theo chuẩn JWT: "Bearer <token>"
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- INTERCEPTOR 2: Xử lý lỗi trả về từ Backend ---
axiosClient.interceptors.response.use(
    (response) => {
        // Nếu thành công thì trả về data
        return response.data;
    },
    (error) => {
        // Nếu lỗi 401 (Unauthorized) -> Token hết hạn hoặc sai
        if (error.response && error.response.status === 401) {
            // Xóa token cũ
            localStorage.removeItem('accessToken');
            // Chuyển hướng về trang login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;

export const authApi = {
    login: (email: string, password: string) => axiosClient.post('/auth/login', { email, password }),
    register: (payload: { name: string; displayName?: string; email: string; password: string }) => axiosClient.post('/auth/register', payload),
};

export const userApi = {
    me: () => axiosClient.get('api/user/me'),
};