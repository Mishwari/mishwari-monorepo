import { useState, useCallback } from 'react';
import { useProfile } from '../core/useProfile';
import { operatorApi } from '@mishwari/api';

interface UpgradeStatus {
  status: 'pending' | 'approved' | 'rejected' | null;
  company_name?: string;
  commercial_registration?: string;
}

export const useDriverProfile = () => {
  const profileHook = useProfile();
  const [upgradeStatus, setUpgradeStatus] = useState<UpgradeStatus>({ status: null });
  const [loadingUpgrade, setLoadingUpgrade] = useState(false);

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

  const submitUpgradeRequest = useCallback(async (data: {
    company_name: string;
    commercial_registration: string;
    tax_number?: string;
    documents: Record<string, string>;
  }) => {
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
    ...profileHook,
    upgradeStatus,
    loadingUpgrade,
    fetchUpgradeStatus,
    submitUpgradeRequest,
    isOperator: profileHook.profile?.role === 'operator_admin',
    isVerified: profileHook.profile?.is_verified || false,
  };
};
