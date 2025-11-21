import { useDispatch, useSelector } from 'react-redux';
import { useRevalidate as useRevalidateCore } from '@mishwari/features-auth';
import { setProfile } from '@/store/slices/authSlice';
import { AppState } from '@/store/store';
import { decryptToken } from '@/utils/tokenUtils';

export const useRevalidate = (enabled = false) => {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state: AppState) => state.auth);

  const decryptedToken = token ? decryptToken(token) : null;

  return useRevalidateCore({
    isAuthenticated: !!isAuthenticated,
    token: decryptedToken,
    onProfileUpdate: (profile) => {
      dispatch(setProfile(profile));
    },
    enabled,
  });
};
