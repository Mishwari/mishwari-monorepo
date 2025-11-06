export { 
  performLogin, 
  performOTPLogin, 
  fetchUserDetails, 
  fetchProfileDetails, 
  performLogout 
} from '@mishwari/features-auth';

// Re-export for backward compatibility
import { resetUserState } from '../slices/userSlice';
import { resetDriverState } from '@/slices/driverSlice';
import { resetTripsState } from '@/slices/tripsSlice';
import { performLogout as basePerformLogout } from '@mishwari/features-auth';

export const performLogoutWithCleanup = () => (dispatch: any) => {
  dispatch(basePerformLogout());
  dispatch(resetUserState());
  dispatch(resetDriverState());
  dispatch(resetTripsState());
};
