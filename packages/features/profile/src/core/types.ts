import { Profile } from '@mishwari/types';

export interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

export interface UseProfileReturn {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}
