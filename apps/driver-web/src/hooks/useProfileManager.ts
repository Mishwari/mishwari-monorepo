import { useState, useCallback } from 'react';
import { profileApi, operatorApi } from '@mishwari/api';

// Profile manager hook for driver-web
export const useProfileManager = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgradeStatus, setUpgradeStatus] = useState<any>({ status: null });
  const [loadingUpgrade, setLoadingUpgrade] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await profileApi.get();
      setProfile(response.data);
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
  }, []);

  const updateProfile = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await profileApi.completeProfile(data);
      setProfile(response.data);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.message || 'فشل تحديث الملف الشخصي';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  const fetchUpgradeStatus = useCallback(async () => {
    setLoadingUpgrade(true);
    try {
      const response = await operatorApi.getUpgradeStatus();
      setUpgradeStatus(response.data);
    } catch (err) {
      console.error('Failed to fetch upgrade status:', err);
    } finally {
      setLoadingUpgrade(false);
    }
  }, []);

  const submitUpgradeRequest = useCallback(async (data: any) => {
    setLoadingUpgrade(true);
    try {
      await operatorApi.submitUpgradeRequest(data);
      await fetchUpgradeStatus();
    } catch (err) {
      throw err;
    } finally {
      setLoadingUpgrade(false);
    }
  }, [fetchUpgradeStatus]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    refreshProfile,
    upgradeStatus,
    loadingUpgrade,
    fetchUpgradeStatus,
    submitUpgradeRequest,
    isOperator: profile?.role === 'operator_admin',
    isVerified: profile?.is_verified || false,
    canEditAll: profile?.role === 'operator_admin' || profile?.role === 'standalone_driver' || profile?.role === 'invited_driver',
  };
};
