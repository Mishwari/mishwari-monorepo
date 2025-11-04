import { useEffect, useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authApi } from '@mishwari/api';

interface UseAuthOptions {
  token: string | null;
  refreshToken: string | null;
  onAuthChange: (auth: { token: string | null; refreshToken: string | null; isAuthenticated: boolean }) => void;
  isProtected?: boolean;
}

export const useAuth = ({ token, refreshToken, onAuthChange, isProtected = false }: UseAuthOptions) => {
  const [isTokenValid, setIsTokenValid] = useState<boolean>(true);

  const isTokenExpired = useCallback((token: string) => {
    if (!token) return true;
    try {
      const { exp } = jwtDecode(token) as { exp?: number };
      if (typeof exp === 'undefined') return true;
      return Date.now() >= exp * 1000;
    } catch (e) {
      return true;
    }
  }, []);

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) {
      onAuthChange({ token: null, refreshToken: null, isAuthenticated: false });
      return;
    }

    try {
      const response = await authApi.refreshToken(refreshToken);
      const newAccessToken = response.data.access;
      if (newAccessToken) {
        onAuthChange({ token: newAccessToken, refreshToken, isAuthenticated: true });
      }
    } catch (error) {
      onAuthChange({ token: null, refreshToken: null, isAuthenticated: false });
    }
  }, [refreshToken, onAuthChange]);

  useEffect(() => {
    if (token) {
      if (isTokenExpired(token)) {
        setIsTokenValid(false);
        refreshAccessToken();
      } else {
        setIsTokenValid(true);
        onAuthChange({ token, refreshToken, isAuthenticated: true });
      }
    } else {
      setIsTokenValid(false);
      if (isProtected) {
        onAuthChange({ token: null, refreshToken: null, isAuthenticated: false });
      }
    }

    const intervalId = setInterval(() => {
      if (token && isTokenExpired(token)) {
        refreshAccessToken();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [token, refreshToken, isProtected, refreshAccessToken, isTokenExpired, onAuthChange]);

  return {
    isAuthenticated: !!(token && refreshToken),
    isTokenValid,
  };
};
