import { useState } from 'react';
import { authApi } from '@mishwari/api';

interface UseOtpProxyReturn {
  sessionInfo: string | null;
  method: 'firebase' | 'sms' | null;
  isLoading: boolean;
  error: string | null;
  requestOtp: (phone: string, recaptchaToken?: string) => Promise<void>;
  verifyLogin: (code: string, phone: string) => Promise<any>;
  reset: () => void;
}

export const useOtpProxy = (): UseOtpProxyReturn => {
  const [sessionInfo, setSessionInfo] = useState<string | null>(null);
  const [method, setMethod] = useState<'firebase' | 'sms' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestOtp = async (phone: string, recaptchaToken?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('[useOtpProxy] Calling API with:', { phone, hasToken: !!recaptchaToken });
      const response = await authApi.requestOtp({
        phone,
        recaptcha_token: recaptchaToken,
        use_firebase: true
      });
      console.log('[useOtpProxy] API response:', response.data);
      
      setMethod(response.data.method);
      
      if (response.data.session_info) {
        setSessionInfo(response.data.session_info);
      }
    } catch (err: any) {
      console.error('[useOtpProxy] API error:', err);
      console.error('[useOtpProxy] Error details:', {
        message: err.message,
        code: err.code,
        response: err.response,
        request: err.request
      });
      setError(err.message || 'Failed to send OTP');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyLogin = async (code: string, phone: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authApi.verifyOtp({
        phone: phone,
        otp: code,
        session_info: sessionInfo || undefined,
        method: method || undefined,
        app_type: 'passenger'
      });
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setSessionInfo(null);
    setMethod(null);
    setError(null);
  };

  return {
    sessionInfo,
    method,
    isLoading,
    error,
    requestOtp,
    verifyLogin,
    reset
  };
};
