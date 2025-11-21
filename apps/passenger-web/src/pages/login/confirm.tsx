import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { performVerifyLogin } from '@/store/actions/mobileAuthActions';
import { useRouter } from 'next/router';
import { AppState } from '../../store/store';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { OtpInput, Button } from '@mishwari/ui-web';



function Login() {
  const user = useSelector((state: AppState) => state.user);

  const router = useRouter();
  const mobileNumber = useSelector((state: AppState) => state.mobileAuth.number);
  const [otpCode, setOtpCode] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  useEffect(() => {
    if (!mobileNumber) {
      router.push('/login'); // Redirect to the home page
    }
  }, [mobileNumber, router]);

    const dispatch = useDispatch();

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        // if(mobileNumber && otpCode) {

            dispatch(performVerifyLogin(mobileNumber, otpCode, router) as any);
        // }

    };

  return (
    <div className='flex min-h-full flex-col justify-center h-screen sm:h-auto sm:mx-auto sm:w-full sm:max-w-md px-12 sm:px-6 py-8 sm:py-4 sm:mt-20 lg:px-8 sm:border border-gray-200 sm:rounded-xl bg-gray-50'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <h1 className='mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-brand-text-dark'>
          تاكيد رمز التحقق
        </h1>
      </div>
      <div className='flex-col justify-center text-center items-center mt-6'>
        <p className='text-gray-600'>ادخل رمز التحقق الذي ارسل الى</p>
        <div className='flex justify-center items-center gap-2 mt-2'>
          <h1 className='text-lg font-bold text-brand-primary' dir='ltr'>
            +{mobileNumber || 'Not Found!'}
          </h1>
          <Link href='/login'>
            <PencilSquareIcon className='h-5 w-5 text-brand-primary' />
          </Link>
        </div>
      </div>
      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <form className='space-y-8' onSubmit={handleSubmit}>
          <div className='flex justify-center'>
            <OtpInput
              value={otpCode}
              onChange={setOtpCode}
              length={4}
            />
          </div>

          <div className='flex justify-center'>
            <Button type='submit' variant='default' size='lg'>
              تسجيل الدخول
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login