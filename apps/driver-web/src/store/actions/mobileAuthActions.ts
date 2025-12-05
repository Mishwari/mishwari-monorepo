import { setAuthState, setProfile } from '../slices/authSlice';
import { setMobileAuth, resetMobileAuth } from '../slices/mobileAuthSlice';
import { toast } from 'react-toastify';
import { authApi, createAuthenticatedClient } from '@mishwari/api';
import { encryptToken, decryptToken } from '@mishwari/utils';
import axios from 'axios';
import '@/config/firebase';
import { sendFirebaseOtp, verifyFirebaseOtp, shouldUseFirebase } from '@mishwari/utils';

export const performMobileLogin = (mobileNumber: string, router: any) => async (dispatch: any) => {
  const waitingLogin = toast.info('جاري تسجيل الدخول...', { autoClose: false });
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const useFirebase = shouldUseFirebase(mobileNumber);

  try {
    if (useFirebase) {
      try {
        await sendFirebaseOtp(mobileNumber, 'recaptcha-container');
        dispatch(setMobileAuth({ number: mobileNumber, method: 'firebase' }));
      } catch (firebaseError: any) {
        if (firebaseError.code === 'auth/too-many-requests') {
          const [response] = await Promise.all([
            authApi.requestOtp({ phone: mobileNumber }),
            delay(1000),
          ]);
          dispatch(setMobileAuth({ number: mobileNumber, method: 'sms' }));
          const requiresPassword = response.data.requires_password ? 'true' : 'false';
          router.push(`/login/confirm?requiresPassword=${requiresPassword}`);
          toast.dismiss(waitingLogin);
          toast.success('تم ارسال رمز التحقق', { autoClose: 2000, hideProgressBar: true });
          return;
        }
        throw firebaseError;
      }
    } else {
      const [response] = await Promise.all([
        authApi.requestOtp({ phone: mobileNumber }),
        delay(1000),
      ]);
      dispatch(setMobileAuth({ number: mobileNumber, method: 'sms' }));
      const requiresPassword = response.data.requires_password ? 'true' : 'false';
      router.push(`/login/confirm?requiresPassword=${requiresPassword}`);
      toast.dismiss(waitingLogin);
      toast.success('تم ارسال رمز التحقق', { autoClose: 2000, hideProgressBar: true });
      return;
    }

    toast.dismiss(waitingLogin);
    toast.success('تم ارسال رمز التحقق', { autoClose: 2000, hideProgressBar: true });
    router.push('/login/confirm');
  } catch (error: any) {
    toast.dismiss(waitingLogin);
    toast.error('فشل تسجيل الدخول', { autoClose: 2000, hideProgressBar: true });
    console.error('Login failed:', error.message);
  }
};

export const performVerifyLogin = (mobileNumber: string, otpCode: string, router: any, password?: string, verificationMethod?: 'sms' | 'firebase') => async (dispatch: any) => {
  const waitingLogin = toast.info('جاري تسجيل الدخول...', { autoClose: false });

  try {
    let response;
    
    if (verificationMethod === 'firebase') {
      const { token } = await verifyFirebaseOtp(otpCode);
      response = await authApi.verifyFirebaseOtp({ firebase_token: token, password });
    } else {
      response = await authApi.verifyOtp({ phone: mobileNumber, otp: otpCode, password });
    }
    
    if (response.data.requires_password) {
      toast.dismiss(waitingLogin);
      return { requiresPassword: true };
    }

    const accessToken = response.data.tokens.access;

    dispatch(setAuthState({
      isAuthenticated: true,
      token: encryptToken(accessToken),
      refreshToken: encryptToken(response.data.tokens.refresh),
    }));

    const authenticatedClient = createAuthenticatedClient(accessToken);
    const profileResponse = await authenticatedClient.get('/profile/me/');
    const profileData = profileResponse.data.profile;
    dispatch(setProfile(profileData));

    toast.dismiss(waitingLogin);
    toast.success('تم تسجيل الدخول بنجاح', { autoClose: 2000, hideProgressBar: true });

    if (!profileData.full_name) {
      router.push('/login/complete_profile');
    } else {
      dispatch(resetMobileAuth());
      router.push('/');
    }
  } catch (error: any) {
    toast.dismiss(waitingLogin);
    if (error.response?.status === 401) {
      toast.error('كلمة المرور غير صحيحة', { autoClose: 2000, hideProgressBar: true });
    } else {
      toast.error('فشل تسجيل الدخول', { autoClose: 2000, hideProgressBar: true });
    }
    console.error('Login failed:', error);
    throw error;
  }
};

export const performRegister = (profileData: any, router: any) => async (dispatch: any, getState: any) => {
  const { auth } = getState();
  const data: any = {
    full_name: profileData.full_name,
    email: profileData.email,
    role: profileData.role,
    gender: profileData.gender,
    birth_date: profileData.birth_date,
  };
  
  // Only include password if provided (operator_admin only)
  if (profileData.password) {
    data.password = profileData.password;
  }

  const waitingRegister = toast.info('جاري التسجيل...', { autoClose: false });

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}mobile-login/complete-profile/`,
      data,
      { headers: { Authorization: `Bearer ${decryptToken(auth.token)}` } }
    );

    // Fetch updated profile and extract nested profile
    const response = await authApi.getMe();
    const profileData = response.data.profile;
    dispatch(setProfile(profileData));

    toast.dismiss(waitingRegister);
    toast.success('تم التسجيل بنجاح', { autoClose: 2000, hideProgressBar: true });
    router.push('/');
  } catch (error: any) {
    toast.dismiss(waitingRegister);
    const errorMsg = error.response?.data?.error || 'فشل التسجيل';
    toast.error(errorMsg, { autoClose: 2000, hideProgressBar: true });
    console.error('Register failed:', error.response?.data || error);
  }
};
