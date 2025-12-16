import { useEffect, useCallback } from 'react';
import { authApi } from '@mishwari/api';

interface UseRevalidateOptions {
  isAuthenticated: boolean;
  token: string | null;
  onProfileUpdate: (profile: any) => void;
  enabled?: boolean;
}

export const useRevalidate = ({ 
  isAuthenticated, 
  token, 
  onProfileUpdate,
  enabled = true 
}: UseRevalidateOptions) => {
  const revalidate = useCallback(async () => {
    if (!isAuthenticated || !token || !enabled) return;

    try {
      const profile = await authApi.getMe();
      onProfileUpdate(profile);
    } catch (error: any) {
      if (error?.response?.status === 401) {
      } else {
        console.error('Failed to revalidate profile:', error);
      }
    }
  }, [isAuthenticated, token, onProfileUpdate, enabled]);

  useEffect(() => {
    if (enabled) {
      revalidate();
    }
  }, [revalidate, enabled]);

  useEffect(() => {
    if (!enabled) return;
    
    const handleFocus = () => revalidate();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [revalidate, enabled]);

  return { revalidate };
};
