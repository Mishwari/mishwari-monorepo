import { useSelector, useDispatch } from 'react-redux';
import { useAuth as useAuthCore } from '@mishwari/features-auth';
import { setAuthState } from '@/store/slices/authSlice';
import { AppState } from '@/store/store';
import { encryptToken, decryptToken } from '@/utils/tokenUtils';

const useAuth = (isProtected = false) => {
  const { token, refreshToken } = useSelector((state: AppState) => state.auth);
  const dispatch = useDispatch();

  const decryptedToken = token ? decryptToken(token) : null;
  const decryptedRefreshToken = refreshToken ? decryptToken(refreshToken) : null;

  return useAuthCore({
    token: decryptedToken,
    refreshToken: decryptedRefreshToken,
    onAuthChange: (auth) => {
      dispatch(
        setAuthState({
          token: auth.token ? encryptToken(auth.token) : null,
          refreshToken: auth.refreshToken ? encryptToken(auth.refreshToken) : null,
          isAuthenticated: auth.isAuthenticated,
        })
      );
    },
    isProtected,
  });
};

export default useAuth;
