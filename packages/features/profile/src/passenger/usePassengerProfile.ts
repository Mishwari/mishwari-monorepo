import { useProfile } from '../core/useProfile';

// Passenger-specific profile hook - currently just re-exports core
// Can be extended with passenger-specific logic in the future
export const usePassengerProfile = () => {
  return useProfile();
};
