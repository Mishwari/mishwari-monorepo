import { setAuthState, setProfile } from '../slices/authSlice';
import { setMobileAuth, resetMobileAuth } from '../slices/mobileAuthSlice';
import { toast } from 'react-toastify';
import { authApi } from '@mishwari/api';
import { encryptToken, decryptToken } from '@mishwari/utils';
import axios from 'axios';

export const performMobileLogin = (mobileNumber: string, router: any) => async (dispatch: any) => {
  const waitingLogin = toast.info('جاري تسجيل الدخول...', { autoClose: false });
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  try {
    await Promise.all([
      authApi.requestOtp({ phone: mobileNumber }),
      delay(1000),
    ]);

    dispatch(setMobileAuth(mobileNumber));
    toast.dismiss(waitingLogin);
    toast.success('تم ارسال رمز التحقق', { autoClose: 2000, hideProgressBar: true });
    router.push('/login/confirm');
  } catch (error: any) {
    toast.dismiss(waitingLogin);
    toast.error('فشل تسجيل الدخول', { autoClose: 2000, hideProgressBar: true });
    console.error('Login failed:', error.message);
  }
};

export const performVerifyLogin = (mobileNumber: string, otpCode: string, router: any) => async (dispatch: any) => {
  const waitingLogin = toast.info('جاري تسجيل الدخول...', { autoClose: false });
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  try {
    const [response] = await Promise.all([
      authApi.verifyOtp({ phone: mobileNumber, otp: otpCode }),
      delay(1000),
    ]);

    if (response.data.tokens.access) {
      dispatch(setAuthState({
        isAuthenticated: true,
        token: encryptToken(response.data.tokens.access),
        refreshToken: encryptToken(response.data.tokens.refresh),
        status: response.data.user_status,
      }));

      if (response.data.user_status === 'complete') {
        try {
          const profile = await authApi.getMe();
          dispatch(setProfile(profile));
        } catch (error: any) {
          console.error('Failed to fetch profile after login:', error?.response?.data || error);
        }
      }
    }

    toast.dismiss(waitingLogin);
    toast.success('تم تسجيل الدخول بنجاح', { autoClose: 2000, hideProgressBar: true });

    if (response.data.user_status === 'partial') {
      router.push('/login/complete_profile');
    } else {
      dispatch(resetMobileAuth());
      router.push('/');
    }
  } catch (error: any) {
    toast.dismiss(waitingLogin);
    toast.error('فشل تسجيل الدخول', { autoClose: 2000, hideProgressBar: true });
    console.error('Login failed:', error);
    router.push('/login');
  }
};

export const performRegister = (profileData: any, router: any) => async (dispatch: any, getState: any) => {
  const data = {
    username: profileData.username,
    full_name: profileData.full_name,
    email: profileData.email,
    role: profileData.role,
    gender: profileData.gender,
    birth_date: profileData.birth_date,
  };

  const { auth } = getState();
  if (!auth.isAuthenticated) {
    return;
  }

  const waitingRegister = toast.info('جاري التسجيل...', { autoClose: false });
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  try {
    const [response] = await Promise.all([
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/mobile-login/complete-profile/`, data, {
        headers: {
          Authorization: `Bearer ${decryptToken(auth.token)}`,
        },
      }),
      delay(1000),
    ]);

    toast.dismiss(waitingRegister);
    toast.success('تم التسجيل بنجاح', { autoClose: 2000, hideProgressBar: true });

    dispatch(setAuthState({
      isAuthenticated: true,
      token: encryptToken(response.data.tokens.access),
      refreshToken: encryptToken(response.data.tokens.refresh),
      status: response.data.user_status,
    }));

    // Fetch profile before navigation
    try {
      const profile = await authApi.getMe();
      dispatch(setProfile(profile));
      router.push('/');
    } catch (error: any) {
      console.error('Failed to fetch profile after register:', error?.response?.data || error);
      router.push('/');
    }
  } catch (error: any) {
    toast.dismiss(waitingRegister);
    toast.error('فشل التسجيل', { autoClose: 2000, hideProgressBar: true });
    console.error('Register failed:', error.response?.data || error);
  }
};
