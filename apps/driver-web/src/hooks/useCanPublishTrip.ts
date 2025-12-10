import { useSelector } from 'react-redux';
import type { AppState } from '@/store/store';
import type { Bus, Driver } from '@mishwari/types';

interface CanPublishResult {
  canPublish: boolean;
  missingVerifications: string[];
  message: string;
}

/**
 * Hook to check if a trip can be published based on Golden Rule:
 * - Operator must be verified
 * - Bus must be verified
 * - Driver must be verified (if provided and not standalone)
 */
export function useCanPublishTrip(bus?: Bus | null, driver?: Driver | null, isStandalone?: boolean): CanPublishResult {
  const { canPublish: operatorVerified } = useSelector((state: AppState) => state.auth);
  
  const missing: string[] = [];
  
  if (!operatorVerified) {
    missing.push('المشغل');
  }
  
  if (bus) {
    if (!bus.is_verified) {
      missing.push('الحافلة');
    }
  } else {
    missing.push('الحافلة');
  }
  
  // For standalone drivers, skip driver verification check (they are the driver)
  // For operator_admin, require driver verification
  if (!isStandalone) {
    if (driver) {
      if (!driver.is_verified) {
        missing.push('السائق');
      }
    } else {
      missing.push('السائق');
    }
  }
  
  const canPublish = missing.length === 0 && bus !== undefined && bus !== null;
  const message = missing.length > 0
    ? `لنشر هذه الرحلة، يجب توثيق: ${missing.join('، ')}`
    : '';
  
  return {
    canPublish,
    missingVerifications: missing,
    message,
  };
}
