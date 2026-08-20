import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});

export default apiClient;