import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMobileAuth } from '@/store/slices/mobileAuthSlice';
import { setAuthState } from '@/store/slices/authSlice';
import { AppState } from '../store/store';
import { PhoneInput, OtpInput, countries } from '@mishwari/ui-web';
import { XMarkIcon, ArrowRightOnRectangleIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { authApi } from '@mishwari/api';
import { toast } from 'react-toastify';
import { encryptToken } from '@/utils/tokenUtils';
import ProfileFormModal from './ProfileFormModal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfileModal?: () => void;
}

export default function LoginModal({ isOpen, onClose, onOpenProfileModal }: LoginModalProps) {
  const getMobileNumber = useSelector(
    (state: AppState) => state.mobileAuth.number
  );
  const dispatch = useDispatch();
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [showOtp, setShowOtp] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (isOpen && getMobileNumber && !mobileNumber) {
      setMobileNumber(getMobileNumber);
    }
  }, [isOpen, getMobileNumber]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber) {
      const waitingLogin = toast.info('جاري تسجيل الدخول...', { autoClose: false });
      try {
        await authApi.requestOtp({ phone: mobileNumber });
        dispatch(setMobileAuth(mobileNumber));
        toast.dismiss(waitingLogin);
        toast.success('تم ارسال رمز التحقق', { autoClose: 2000, hideProgressBar: true });
        setShowOtp(true);
      } catch (error: any) {
        toast.dismiss(waitingLogin);
        toast.error('فشل تسجيل الدخول', { autoClose: 2000, hideProgressBar: true });
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber && otpCode) {
      const waitingLogin = toast.info('جاري تسجيل الدخول...', { autoClose: false });
      try {
        const response = await authApi.verifyOtp({ phone: mobileNumber, otp: otpCode });
        const responseData = response.data;
        const tokens = responseData.tokens || responseData;
        const access = tokens.access || responseData.access;
        const refresh = tokens.refresh || responseData.refresh;
        const userStatus = responseData.user_status || responseData.status;
        
        if (access) {
          dispatch(setAuthState({
            isAuthenticated: true,
            token: encryptToken(access),
            refreshToken: encryptToken(refresh),
            status: userStatus,
          }));
        }

        toast.dismiss(waitingLogin);
        toast.success('تم تسجيل الدخول بنجاح', { autoClose: 2000, hideProgressBar: true });
        
        // Reset form state and Redux
        setMobileNumber('');
        setOtpCode('');
        setShowOtp(false);
        dispatch(setMobileAuth(''));
        
        onClose();
        if (userStatus === 'partial') {
          setTimeout(() => {
            if (onOpenProfileModal) {
              onOpenProfileModal();
            } else {
              setShowProfileModal(true);
            }
          }, 100);
        }
      } catch (error: any) {
        toast.dismiss(waitingLogin);
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            error.response?.data?.detail ||
                            'رمز التحقق غير صحيح أو منتهي الصلاحية';
        toast.error('فشل تسجيل الدخول', { autoClose: 2000, hideProgressBar: true });
        setTimeout(() => {
          toast.error(errorMessage, { autoClose: 3000, hideProgressBar: true });
        }, 2200);
      }
    }
  };

  const handleEdit = () => {
    setShowOtp(false);
    setOtpCode('');
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <ProfileFormModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    <div className='fixed inset-0 z-[500] flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' onClick={onClose} />
      <div className='bg-white w-full max-w-sm rounded-3xl p-6 relative shadow-2xl z-10'>
        <button
          onClick={onClose}
          className='absolute top-4 left-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors'>
          <XMarkIcon className='w-5 h-5 text-slate-500' />
        </button>

        <div className='text-center mb-6'>
          <div className='w-12 h-12 bg-[#e6f2f7] rounded-full flex items-center justify-center mx-auto mb-3 text-[#005687]'>
            <ArrowRightOnRectangleIcon className='w-6 h-6' />
          </div>
          <h2 className='text-2xl font-black text-[#042f40]'>{showOtp ? 'تاكيد رمز التحقق' : 'سجل دخولك في مشواري'}</h2>
          <p className='text-slate-500 text-sm mt-1'>{showOtp ? 'ادخل رمز التحقق الذي ارسل الى' : 'أدخل رقم هاتفك للمتابعة'}</p>
        </div>

        {!showOtp ? (
          <form onSubmit={handleRequestOtp} className='space-y-6'>
            <PhoneInput
              value={mobileNumber}
              onChange={setMobileNumber}
              countries={countries}
            />

            <button
              type='submit'
              className='w-full py-3.5 bg-[#005687] hover:bg-[#004a73] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 active:scale-95 transition-all'>
              طلب رمز التحقق
            </button>
          </form>
        ) : (
          <>
            <div className='flex justify-center items-center gap-2 mb-6'>
              <h1 className='text-lg font-bold text-[#005687]' dir='ltr'>
                +{mobileNumber}
              </h1>
              <button onClick={handleEdit} type='button'>
                <PencilSquareIcon className='h-5 w-5 text-[#005687]' />
              </button>
            </div>
            <form onSubmit={handleVerifyOtp} className='space-y-6'>
              <div className='flex justify-center'>
                <OtpInput
                  value={otpCode}
                  onChange={setOtpCode}
                  length={4}
                />
              </div>

              <button
                type='submit'
                className='w-full py-3.5 bg-[#005687] hover:bg-[#004a73] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 active:scale-95 transition-all'>
                تسجيل الدخول
              </button>
            </form>
          </>
        )}

        {/* <div className='mt-4 text-center'>
          <button
            onClick={onClose}
            className='text-sm text-slate-600 hover:text-slate-800 font-medium'>
            ليس الآن
          </button>
        </div> */}
      </div>
    </div>
    </>,
    document.body
  );
}
