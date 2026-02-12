import axios from 'axios';

const api = axios.create({
    // La URL de tu backend de Laravel
    baseURL: 'http://localhost:8000/api', 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Interceptor: Ideal para manejar errores globales (como el 401 de sesión expirada)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Lógica para redirigir al login si el token expira
            console.error("Sesión expirada");
        }
        return Promise.reject(error);
    }
);

export default api;