import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {jwtDecode} from 'jwt-decode';
import { setAuthState } from '@/store/slices/authSlice';
import axios from 'axios';
import { unescape } from 'querystring';
import { AppState } from '@/store/store';
import { encryptToken, decryptToken} from '@/utils/tokenUtils';



const useAuth = (isProtected = false) => {
  const { token, refreshToken } = useSelector((state: AppState) => state.auth);
  const dispatch = useDispatch();

  const [isTokenValid, setIsTokenValid] = useState<boolean>(true);

  const isTokenExpired = useCallback((token: string) => {
    if (!token) return true;
    try {
      const { exp } = jwtDecode(token);
      if (typeof exp === 'undefined') {
        console.warn('Token expiration time (exp) is undefined. Treating token as expired.');
        return true;
      }
      return Date.now() >= exp * 1000;
    } catch (e) {
      console.error('Error decoding token:', e);
      return true;
    }
  }, []);

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) {
      dispatch(
        setAuthState({
          isAuthenticated: false,
          token: null,
          refreshToken: null,
          status:'',
        })
      );
      return;
    }

    try {
      const response = await axios.post('/api/next-external/refreshAccess/', {
        refresh: decryptToken(refreshToken),
      });

      const newAccessToken = response.data.access;
      if (newAccessToken) {
        dispatch(
          setAuthState({
            token: encryptToken(newAccessToken),
            isAuthenticated: true,
            refreshToken,
            status: ''
          })
        );
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      dispatch(
        setAuthState({
          isAuthenticated: false,
          token: null,
          refreshToken: null,
          status: ''
        })
      );
    }
  }, [dispatch, refreshToken]);

  useEffect(() => {
    const decryptedToken = token ? decryptToken(token) : null;

    if (decryptedToken) {
      if (isTokenExpired(decryptedToken)) {
        setIsTokenValid(false);
        refreshAccessToken();
      } else {
        setIsTokenValid(true);
        if (token && refreshToken) {
          dispatch(
            setAuthState({
              isAuthenticated: true,
              token,
              refreshToken,
              status: ''
            })
          );
        }
      }
    } else {
      setIsTokenValid(false);
      if (isProtected) {
        dispatch(
          setAuthState({
            isAuthenticated: false,
            token: null,
            refreshToken: null,
            status: '',
          })
        );
      }
    }

    const intervalId = setInterval(() => {
      if (token && isTokenExpired(decryptToken(token))) { // isTokenExpired(token)
        console.log('isTokenExpired(token)', token);
        refreshAccessToken();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(intervalId);
  }, [token, refreshToken, isProtected, refreshAccessToken, isTokenExpired, dispatch]);

  return {
    isAuthenticated: !!(token && refreshToken),
    isTokenValid,
  };
};

export default useAuth;
