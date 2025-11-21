import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { profileApi } from '@mishwari/api';
import { setProfileDetails } from '@/store/slices/profileSlice';
import { AppState } from '@/store/store';

// Profile manager hook for passenger-web
export const useProfileManager = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state: AppState) => state.profile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await profileApi.get();
      dispatch(setProfileDetails(response.data));
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch profile';
      setError(errorMsg);
      console.error('Profile fetch error:', errorMsg);
      // Don't throw on 401, just log it
      if (err.response?.status !== 401) {
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const updateProfile = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await profileApi.update(data);
      dispatch(setProfileDetails(response.data));
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    refreshProfile,
  };
};
