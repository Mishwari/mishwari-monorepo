import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, OtpInput } from '@mishwari/ui-web';
import { authApi, createAuthenticatedClient } from '@mishwari/api';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setAuthState, setProfile } from '@/store/slices/authSlice';
import { encryptToken, getRecaptchaToken, cleanupRecaptcha } from '@mishwari/utils';
import '@/config/firebase';

export default function JoinInvitationPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { code } = router.query;
  const [step, setStep] = useState<'validate' | 'otp'>('validate');
  const [invitation, setInvitation] = useState<any>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'sms' | 'firebase'>('sms');
  const [sessionInfo, setSessionInfo] = useState<string | null>(null);
  const [showOtpInput, setShowOtpInput] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (code) {
      validateInvite();
    }
    return () => cleanupRecaptcha();
  }, [code]);

  const validateInvite = async () => {
    try {
      const response = await authApi.validateInvite(code as string);
      setInvitation(response.data);
      const phone = response.data.mobile_number;
      setMobileNumber(phone);
      setStep('otp');
    } catch (error: any) {
      console.error('[JOIN] Validation failed:', error?.response?.data);
      toast.error(error?.response?.data?.error || 'رمز دعوة غير صالح');
      router.push('/login');
    }
  };

  const handleRequestOtp = async () => {
    if (showOtpInput) {
      cleanupRecaptcha();
      setShowOtpInput(false);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setLoading(true);
    try {
      const recaptchaToken = await getRecaptchaToken('recaptcha-container');
      const response = await authApi.requestOtp({ 
        phone: mobileNumber,
        recaptcha_token: recaptchaToken,
        use_firebase: true
      });
      
      setVerificationMethod(response.data.method);
      if (response.data.session_info) {
        setSessionInfo(response.data.session_info);
      }
      setShowOtpInput(true);
      toast.success('تم إرسال رمز التحقق');
    } catch (error: any) {
      toast.error('فشل إرسال رمز التحقق');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const response = await authApi.verifyOtp({ 
        phone: mobileNumber, 
        otp,
        method: verificationMethod,
        session_info: sessionInfo || undefined
      });
      const { access, refresh } = response.data.tokens;
      
      dispatch(setAuthState({
        isAuthenticated: true,
        token: encryptToken(access),
        refreshToken: encryptToken(refresh),
      }));
      
      toast.success('تم التحقق بنجاح');
      
      // Redirect immediately without waiting
      router.push(`/join/complete?code=${code}`);
    } catch (error: any) {
      console.error('[JOIN] OTP verification failed:', error?.response?.data || error.message);
      toast.error(error?.response?.data?.error || 'رمز التحقق غير صحيح');
      setLoading(false);
    }
  };



  if (step === 'validate') {
    return (
      <div className='w-full h-screen bg-white flex justify-center items-center'>
        <p className='text-gray-600'>جاري التحقق من الدعوة...</p>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className='w-full h-screen bg-white flex justify-center items-center'>
        <div className='flex flex-col w-full max-w-md px-6 py-8 border border-gray-200 rounded-xl bg-gray-100'>
          <h1 className='text-2xl font-bold text-center mb-4'>انضم إلى {invitation?.operator_name}</h1>
          <p className='text-center text-gray-600 mb-6'>تم دعوتك للانضمام كسائق</p>
          
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>رقم الجوال</label>
              <Input type='tel' value={mobileNumber} disabled dir='ltr' />
            </div>

            {!showOtpInput && <div id='recaptcha-container' className='flex justify-center my-4'></div>}

            {showOtpInput ? (
              <>
                <div className='flex justify-center'>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    length={6}
                  />
                </div>

                <Button onClick={handleVerifyOtp} disabled={loading || !otp} className='w-full'>
                  {loading ? 'جاري التحقق...' : 'تحقق'}
                </Button>

                <Button onClick={handleRequestOtp} variant='outline' disabled={loading} className='w-full'>
                  إعادة إرسال رمز التحقق
                </Button>
              </>
            ) : (
              <Button onClick={handleRequestOtp} disabled={loading} className='w-full'>
                {loading ? 'جاري الإرسال...' : 'طلب رمز التحقق'}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
