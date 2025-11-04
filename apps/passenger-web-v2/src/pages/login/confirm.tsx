import React, { useState,useEffect } from 'react'
import axios from 'axios';
import { useDispatch,useSelector } from 'react-redux';
import { performVerifyLogin } from '@/store/actions/mobileAuthActions';
import { useRouter } from 'next/router';
import { AppState } from '../../store/store';
import { PencilSquareIcon   } from '@heroicons/react/24/outline'
import Link from 'next/link';
import TextInput from '@/components/TextInput';



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
    <div className='flex min-h-full flex-col justify-center h-screen sm:h-auto sm:mx-auto sm:w-full sm:max-w-sm px-12 sm:px-6 py-8 sm:py-4 sm:mt-20 lg:px-8 sm:border border-blue-200 sm:rounded-xl bg-slate-50 '>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
            <h1 className='mt-5 text-center text-2xl  font-bold leading-9 tracking-tight text-gray-600'>تاكيد رمز التحقق</h1>
        </div>
        <div className='flex-col justify-center text-center items-center'>
            <h1>ادخل رمز التحقق الذي ارسل الى</h1>
            <div className='flex justify-center items-center gap-2'>
                <h1 className='text-lg font-bold'>{mobileNumber || 'Not Found!'}</h1>
                <Link href={'/login'}>
                    <PencilSquareIcon className='h-5 w-5' />
                </Link>
            </div>
        </div>
        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
            <form className='space-y-6' onSubmit={handleSubmit}>

            <div>
              <TextInput
                value={otpCode}
                setValue={(value:string) => setOtpCode( value)}
                title='رمز التحقق'
                placeholder='ادخل رمز التحقق'
              />
            </div>

            {/*pass */}
            {/* <div className='text-right'>  
                <label className='block text-sm font-medium leading-9 text-gray-900'>كلمة المرور</label>
                <div className='mt-2'>
                    <input type="password" value={password} onChange={(e) => {setPassword(e.target.value)}} required placeholder='كلمة المرور' className='block w-full  border-b border-blue-800 py-1.5 bg-transparent text-gray-900 placeholder:text-gray-300 focus:border-b-2 focus:outline-none sm:text-sm sm:leading-6"' />
                </div>
            </div> */}
            <div className='flex-shrink-0 px-4 py-4 flex justify-center'>
                <button
                    type='submit'
                    className=' inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#005687] hover:bg-[#148ace] focus:outline-none '>
                   تسجيل الدخول
                </button>
            </div>
            </form>
        </div>
    </div>
  )
}

export default Login