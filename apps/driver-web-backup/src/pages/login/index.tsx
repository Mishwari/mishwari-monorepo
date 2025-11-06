import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

function Login() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const [mobileNumber, setMobileNumber] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const dispatch = useDispatch();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (mobileNumber) {
      // TODO: Implement OTP login for driver
      console.log('Request OTP for:', mobileNumber);
    }
  };

  return (
    <div className='w-full h-screen bg-white flex justify-center items-center'>
      <div className='flex min-h-full sm:min-h-fit flex-col justify-center sm:h-max sm:msx-auto w-full sm:max-w-md px-12 sm:px-6 py-8 sm:py-4 lg:px-8 sm:border border-blue-200 sm:rounded-xl bg-slate-100'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <h1 className='mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-600'>
            سجل كسائق في مشواري
          </h1>
        </div>
        <div className='flex flex-col justify-center items-center mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form className='space-y-6' onSubmit={handleSubmit}>
            <div>
              <input
                type='tel'
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder='رقم الجوال'
                className='block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#005687] sm:text-sm sm:leading-6'
                dir='rtl'
              />
            </div>

            <div className='flex-shrink-0 px-4 py-4 flex justify-center'>
              <button
                type='submit'
                className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#005687] hover:bg-[#148ace] focus:outline-none'>
                طلب رمز التحقق
              </button>
            </div>
          </form>
          <div>
            <a href='/' className='flex text-center text-slate-600'>
              <p className='font-light border-b border-slate-600'>ليس الان</p>؟
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
