import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { performMobileLogin } from '@/store/actions/mobileAuthActions';
import { useRouter } from 'next/router';
import { AppState } from '../../store/store';
import TextInput from '@/components/TextInput';
import PhoneInput from '@/components/PhoneInput';
import { Link } from '@nextui-org/react';
import useAuth from '@/hooks/useAuth';

function Login() {
  const { isAuthenticated } = useAuth();
  const getMobileNumber = useSelector(
    (state: AppState) => state.mobileAuth.number
  );

  const user = useSelector((state: AppState) => state.user);

  const router = useRouter();
  const authState = useSelector((state: AppState) => state.auth);
  const [mobileNumber, setMobileNumber] = useState<string>('');

  useEffect(() => {
    if (getMobileNumber) {
      setMobileNumber(getMobileNumber);
    }
  }, [getMobileNumber, router]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/'); // Redirect to the home page
    }
  }, [isAuthenticated, router]);

  const dispatch = useDispatch();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (mobileNumber) {
      dispatch(performMobileLogin(mobileNumber, router) as any);
    }
  };

  return (
    <div className='w-full h-screen bg-white flex justify-center items-center'>
      <div className='flex min-h-full sm:min-h-fit flex-col justify-center  sm:h-max sm:msx-auto w-full sm:max-w-md px-12 sm:px-6 py-8 sm:py-4  lg:px-8 sm:border border-blue-200 sm:rounded-xl bg-slate-100 '>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <h1 className='mt-5 text-center text-2xl  font-bold leading-9 tracking-tight text-gray-600'>
            سجل دخولك في مشواري
          </h1>
        </div>
        <div className='flex flex-col justify-center items-center mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form
            className='space-y-6'
            onSubmit={handleSubmit}>
            <PhoneInput setMobileNumber={setMobileNumber} />

            <div className='flex-shrink-0 px-4 py-4 flex justify-center'>
              <button
                type='submit'
                className=' inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#005687] hover:bg-[#148ace] focus:outline-none '>
                طلب رمز التحقق
              </button>
            </div>
          </form>
          <div>
            <Link
              href='/'
              className=' flex text-center  text-slate-600'>
              <p className='font-light border-b  border-slate-600'>ليس الان</p>؟
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
