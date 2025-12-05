import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Input } from '@mishwari/ui-web';
import { authApi, createAuthenticatedClient } from '@mishwari/api';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setAuthState, setProfile } from '@/store/slices/authSlice';
import { encryptToken } from '@mishwari/utils';
import '@/config/firebase';
import { sendFirebaseOtp, verifyFirebaseOtp, cleanupRecaptcha } from '@mishwari/utils';

export default function JoinInvitationPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { code } = router.query;
  const [step, setStep] = useState<'validate' | 'otp' | 'profile'>('validate');
  const [invitation, setInvitation] = useState<any>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'sms' | 'firebase'>('sms');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    national_id: '',
    driver_license: ''
  });
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
      setVerificationMethod(phone.startsWith('967') ? 'firebase' : 'sms');
      setStep('otp');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'رمز دعوة غير صالح');
      router.push('/login');
    }
  };

  const handleRequestOtp = async () => {
    setLoading(true);
    try {
      if (verificationMethod === 'firebase') {
        await sendFirebaseOtp(mobileNumber, 'recaptcha-container');
      } else {
        await authApi.requestOtp({ phone: mobileNumber });
      }
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
      let response;
      if (verificationMethod === 'firebase') {
        const { token } = await verifyFirebaseOtp(otp);
        response = await authApi.verifyFirebaseOtp({ firebase_token: token });
      } else {
        response = await authApi.verifyOtp({ phone: mobileNumber, otp });
      }
      const { access, refresh } = response.data.tokens;
      
      dispatch(setAuthState({
        isAuthenticated: true,
        token: encryptToken(access),
        refreshToken: encryptToken(refresh),
      }));
      
      setStep('profile');
    } catch (error: any) {
      toast.error('رمز التحقق غير صحيح');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvite = async () => {
    setLoading(true);
    try {
      await authApi.acceptInvite({
        invite_code: code as string,
        ...formData
      });
      
      // Fetch updated profile
      const profileResponse = await authApi.getMe();
      dispatch(setProfile(profileResponse.data.profile));
      
      toast.success('تم الانضمام بنجاح!');
      
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'فشل قبول الدعوة');
    } finally {
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
        <div id='recaptcha-container'></div>
        <div className='flex flex-col w-full max-w-md px-6 py-8 border border-gray-200 rounded-xl bg-gray-100'>
          <h1 className='text-2xl font-bold text-center mb-4'>انضم إلى {invitation?.operator_name}</h1>
          <p className='text-center text-gray-600 mb-6'>تم دعوتك للانضمام كسائق</p>
          
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>رقم الجوال</label>
              <Input type='tel' value={mobileNumber} disabled dir='ltr' />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>رمز التحقق</label>
              <Input
                type='text'
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder='أدخل رمز التحقق'
                maxLength={6}
              />
            </div>

            <Button onClick={handleVerifyOtp} disabled={loading || !otp} className='w-full'>
              {loading ? 'جاري التحقق...' : 'تحقق'}
            </Button>

            <Button onClick={handleRequestOtp} variant='outline' disabled={loading} className='w-full'>
              إرسال رمز التحقق
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full h-screen bg-white flex justify-center items-center'>
      <div className='flex flex-col w-full max-w-md px-6 py-8 border border-gray-200 rounded-xl bg-gray-100'>
        <h1 className='text-2xl font-bold text-center mb-4'>أكمل معلوماتك</h1>
        
        <form onSubmit={(e) => { e.preventDefault(); handleAcceptInvite(); }} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>الاسم الكامل *</label>
            <Input
              type='text'
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>البريد الإلكتروني</label>
            <Input
              type='email'
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              dir='ltr'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>رقم الهوية الوطنية</label>
            <Input
              type='text'
              value={formData.national_id}
              onChange={(e) => setFormData({ ...formData, national_id: e.target.value })}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>رقم رخصة القيادة</label>
            <Input
              type='text'
              value={formData.driver_license}
              onChange={(e) => setFormData({ ...formData, driver_license: e.target.value })}
            />
          </div>

          <Button type='submit' disabled={loading || !formData.full_name} className='w-full'>
            {loading ? 'جاري الانضمام...' : 'انضم الآن'}
          </Button>
        </form>
      </div>
    </div>
  );
}
