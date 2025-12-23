import { setAuthState, setProfile } from '../slices/authSlice';
import { setMobileAuth, resetMobileAuth } from '../slices/mobileAuthSlice';
import { toast } from 'react-toastify';
import { authApi, createAuthenticatedClient } from '@mishwari/api';
import { encryptToken, decryptToken, getRecaptchaToken } from '@mishwari/utils';
import axios from 'axios';
import '@/config/firebase';


export const performMobileLogin = (mobileNumber: string, onSuccess: () => void, onRequiresPassword?: (requiresPassword: boolean) => void) => async (dispatch: any) => {
  const waitingLogin = toast.info('جاري تسجيل الدخول...', { autoClose: false });
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  try {
    const recaptchaToken = await getRecaptchaToken('recaptcha-container');
    const response = await authApi.requestOtp({
      phone: mobileNumber,
      recaptcha_token: recaptchaToken,
      use_firebase: true
    });
    
    dispatch(setMobileAuth({ 
      number: mobileNumber, 
      method: response.data.method,
      sessionInfo: response.data.session_info 
    }));
    
    if (onRequiresPassword) onRequiresPassword(response.data.requires_password);
    
    await delay(1000);
    toast.dismiss(waitingLogin);
    toast.success('تم ارسال رمز التحقق', { autoClose: 2000, hideProgressBar: true });
    onSuccess();
  } catch (error: any) {
    toast.dismiss(waitingLogin);
    toast.error('فشل تسجيل الدخول', { autoClose: 2000, hideProgressBar: true });
    console.error('Login failed:', error.message);
    throw error;
  }
};

export const performVerifyLogin = (mobileNumber: string, otpCode: string, router: any, password?: string, verificationMethod?: 'sms' | 'firebase', sessionInfo?: string) => async (dispatch: any) => {
  const waitingLogin = toast.info('جاري تسجيل الدخول...', { autoClose: false });

  try {
    const response = await authApi.verifyOtp({ 
      phone: mobileNumber, 
      otp: otpCode, 
      password, 
      app_type: 'driver',
      method: verificationMethod,
      session_info: sessionInfo
    });
    
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
    // Store the entire response (includes operator_name, is_standalone, etc.)
    dispatch(setProfile(profileResponse.data));

    toast.dismiss(waitingLogin);
    toast.success('تم تسجيل الدخول بنجاح', { autoClose: 2000, hideProgressBar: true });

    if (!profileResponse.data.profile?.full_name) {
      router.push('/login/complete_profile');
    } else {
      dispatch(resetMobileAuth());
      router.push('/');
    }
  } catch (error: any) {
    toast.dismiss(waitingLogin);
    console.error('Login failed:', error.response?.data || error);
    
    if (error.response?.status === 403 && error.response?.data?.error === 'WRONG_APP') {
      toast.error(error.response.data.message, { autoClose: 5000, hideProgressBar: true });
    } else if (error.response?.status === 401) {
      toast.error('كلمة المرور غير صحيحة', { autoClose: 2000, hideProgressBar: true });
    } else if (error.response?.status === 400) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'رمز التحقق غير صحيح';
      toast.error(errorMsg, { autoClose: 3000, hideProgressBar: true });
    } else {
      toast.error('فشل تسجيل الدخول', { autoClose: 2000, hideProgressBar: true });
    }
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
  
  if (profileData.password) {
    data.password = profileData.password;
  }
  
  if (profileData.operator_name) {
    data.operator_name = profileData.operator_name;
  }
  
  if (profileData.operational_regions) {
    data.operational_regions = profileData.operational_regions;
  }
  
  if (profileData.driver_license) {
    data.driver_license = profileData.driver_license;
  }
  
  if (profileData.national_id) {
    data.national_id = profileData.national_id;
  }

  const waitingRegister = toast.info('جاري التسجيل...', { autoClose: false });

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}mobile-login/complete-profile/`,
      data,
      { headers: { Authorization: `Bearer ${decryptToken(auth.token)}` } }
    );

    const response = await authApi.getMe();
    dispatch(setProfile(response.data));

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
