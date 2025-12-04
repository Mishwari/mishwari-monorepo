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
      // Try different persist keys - check all possible keys
      const keys = ['persist:driver-web', 'persist:passenger-web', 'persist:nextjs'];
      let persistRoot = null;
      
      for (const key of keys) {
        persistRoot = localStorage.getItem(key);
        if (persistRoot) break;
      }
      
      if (persistRoot) {
        const parsed = JSON.parse(persistRoot);
        const auth = JSON.parse(parsed.auth || '{}');
        if (auth.token && auth.token !== 'undefined' && auth.token !== 'null') {
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

// Helper to create client with direct token (bypasses localStorage)
export const createAuthenticatedClient = (token: string) => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  return client;
};

export default apiClient;
