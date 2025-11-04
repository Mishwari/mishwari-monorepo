import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const persistRoot = localStorage.getItem('persist:root');
      if (persistRoot) {
        const parsed = JSON.parse(persistRoot);
        const auth = JSON.parse(parsed.auth || '{}');
        if (auth.token) {
          // Decrypt token (base64 decode)
          const decrypted = decodeURIComponent(escape(atob(auth.token)));
          config.headers.Authorization = `Bearer ${decrypted}`;
        }
      }
    } catch (e) {
      console.error('Error reading token:', e);
    }
  }
  return config;
});

export default apiClient;