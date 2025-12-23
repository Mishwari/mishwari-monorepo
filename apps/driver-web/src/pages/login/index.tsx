import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { performMobileLogin, performVerifyLogin } from '@/store/actions/mobileAuthActions';
import { useRouter } from 'next/router';
import { AppState } from '@/store/store';
import { PhoneInput, Button, countries, OtpInput, SEO } from '@mishwari/ui-web';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import useAuth from '@/hooks/useAuth';
import '@/config/firebase';
import { cleanupRecaptcha } from '@mishwari/utils';


export default function Login() {
  const { isAuthenticated } = useAuth();
  const getMobileNumber = useSelector((state: AppState) => state.mobileAuth.number);
  const verificationMethod = useSelector((state: AppState) => state.mobileAuth.verificationMethod);
  const sessionInfo = useSelector((state: AppState) => state.mobileAuth.sessionInfo);
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showOtp, setShowOtp] = useState(false);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (getMobileNumber) {
      setMobileNumber(getMobileNumber);
    }
  }, [getMobileNumber]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
    return () => cleanupRecaptcha();
  }, [isAuthenticated, router]);

  const handleRequestOtp = async (e: any) => {
    e.preventDefault();
    if (mobileNumber) {
      try {
        await dispatch(performMobileLogin(
          mobileNumber,
          () => setShowOtp(true),
          (requiresPwd) => setRequiresPassword(requiresPwd)
        ) as any);
      } catch (error) {
        // Error handled in action
      }
    }
  };

  const handleVerifyOtp = async (e: any) => {
    e.preventDefault();
    try {
      await dispatch(performVerifyLogin(mobileNumber, otpCode, router, requiresPassword ? password : undefined, verificationMethod || 'sms', sessionInfo || undefined) as any);
    } catch (error) {
      // Error handled in action
    }
  };

  const handleEdit = () => {
    setShowOtp(false);
    setOtpCode('');
    setPassword('');
  };

  return (
    <>
      <SEO
        title="تسجيل دخول السائق"
        description="تسجيل دخول للسائقين وشركات النقل - إدارة رحلات الباصات في اليمن"
        canonical="/login"
        ogImage="/logo.jpeg"
        keywords="تسجيل دخول سائق, شركة نقل, يلا باص, باصات اليمن"
      />
      <div className='w-full h-screen bg-white flex justify-center items-center'>
      <div className='flex min-h-full sm:min-h-fit flex-col justify-center sm:h-max sm:msx-auto w-full sm:max-w-md px-12 sm:px-6 py-8 sm:py-4 lg:px-8 sm:border border-gray-200 sm:rounded-xl bg-gray-100'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <h1 className='mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-brand-text-dark'>
            {showOtp ? 'تاكيد رمز التحقق' : 'تسجيل دخول السائق'}
          </h1>
        </div>

        {!showOtp ? (
          <div className='flex flex-col justify-center items-center mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
            <form className='space-y-6 w-full' onSubmit={handleRequestOtp}>
              <PhoneInput
                value={mobileNumber}
                onChange={setMobileNumber}
                countries={countries}
              />

              <div id='recaptcha-container' className='flex justify-center my-4'></div>

              <div className='flex justify-center pt-4'>
                <Button type='submit' variant='default' size='lg'>
                  طلب رمز التحقق
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
            <div className='flex justify-center items-center gap-2 mb-6'>
              <h1 className='text-lg font-bold text-brand-primary' dir='ltr'>
                +{mobileNumber}
              </h1>
              <button onClick={handleEdit} type='button'>
                <PencilSquareIcon className='h-5 w-5 text-brand-primary' />
              </button>
            </div>

            <form className='space-y-8' onSubmit={handleVerifyOtp}>
              <div className='flex justify-center'>
                <OtpInput
                  value={otpCode}
                  onChange={setOtpCode}
                  length={6}
                />
              </div>

              {requiresPassword && (
                <div>
                  <label className='block text-sm font-medium text-gray-700 text-right mb-2'>
                    كلمة المرور
                  </label>
                  <input
                    type='password'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='أدخل كلمة المرور'
                    className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary'
                  />
                </div>
              )}

              <div className='flex justify-center'>
                <Button type='submit' variant='default' size='lg'>
                  تسجيل الدخول
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
