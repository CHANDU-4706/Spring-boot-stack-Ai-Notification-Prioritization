import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082';

const api = axios.create({
    baseURL: BASE_URL,
});

export default api;
