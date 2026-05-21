import axios from "axios";

export const backendURL =
    import.meta.env.VITE_BACKEND_URL
    || (import.meta.env.VITE_ENV === 'local'
        ? 'http://localhost:3001/api'
        : '/api');

/** Socket.IO server URL (no /api suffix). */
export const socketURL = (() => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    if (apiUrl) {
        return apiUrl.replace(/\/api\/?$/, '');
    }
    if (import.meta.env.VITE_ENV === 'local') {
        return 'http://localhost:3001';
    }
    if (typeof window !== 'undefined') {
        return `${window.location.protocol}//${window.location.hostname}:3001`;
    }
    return 'http://localhost:3001';
})();

export const axiosInstance = axios.create({
    baseURL: backendURL,
    withCredentials: true,
});