import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://spring-notification-engine.onrender.com';

const api = axios.create({
    baseURL: BASE_URL,
});

export default api;
