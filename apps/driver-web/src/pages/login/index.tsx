import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { performMobileLogin } from '@/store/actions/mobileAuthActions';
import { useRouter } from 'next/router';
import { AppState } from '@/store/store';
import { PhoneInput, Button, countries } from '@mishwari/ui-web';
import useAuth from '@/hooks/useAuth';

export default function Login() {
  const { isAuthenticated } = useAuth();
  const getMobileNumber = useSelector((state: AppState) => state.mobileAuth.number);
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState<string>('');
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
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (mobileNumber) {
      dispatch(performMobileLogin(mobileNumber, router) as any);
    }
  };

  return (
    <div className='w-full h-screen bg-white flex justify-center items-center'>
      <div className='flex min-h-full sm:min-h-fit flex-col justify-center sm:h-max sm:msx-auto w-full sm:max-w-md px-12 sm:px-6 py-8 sm:py-4 lg:px-8 sm:border border-gray-200 sm:rounded-xl bg-gray-100'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <h1 className='mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-brand-text-dark'>
            تسجيل دخول السائق
          </h1>
        </div>
        <div className='flex flex-col justify-center items-center mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form className='space-y-6 w-full' onSubmit={handleSubmit}>
            <PhoneInput
              value={mobileNumber}
              onChange={setMobileNumber}
              countries={countries}
            />

            <div className='flex justify-center pt-4'>
              <Button type='submit' variant='default' size='lg'>
                طلب رمز التحقق
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
