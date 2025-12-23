import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMobileAuth } from '@/store/slices/mobileAuthSlice';
import { setAuthState } from '@/store/slices/authSlice';
import { setProfileDetails } from '@/store/slices/profileSlice';
import { AppState } from '../store/store';
import { PhoneInput, OtpInput, countries } from '@mishwari/ui-web';
import {
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { authApi, createAuthenticatedClient } from '@mishwari/api';
import { toast } from 'react-toastify';
import { encryptToken } from '@/utils/tokenUtils';
import ProfileFormModal from './ProfileFormModal';
import '@/config/firebase';
import {
  sendFirebaseOtp,
  verifyFirebaseOtp,
  cleanupRecaptcha,
  shouldUseFirebase,
} from '@mishwari/utils';
import { createLogger } from '@/utils/logger';

const log = createLogger('loginmodal');

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfileModal?: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onOpenProfileModal,
}: LoginModalProps) {
  const getMobileNumber = useSelector(
    (state: AppState) => state.mobileAuth.number
  );
  const verificationMethod = useSelector(
    (state: AppState) => state.mobileAuth.verificationMethod
  );
  const dispatch = useDispatch();
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [showOtp, setShowOtp] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const loginLock = useRef(false);

  useEffect(() => {
    if (isOpen && getMobileNumber && !mobileNumber) {
      setMobileNumber(getMobileNumber);
    }
    return () => {
      if (!isOpen) cleanupRecaptcha();
    };
  }, [isOpen, getMobileNumber]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    log.info('OTP request initiated', { mobileNumber, lockStatus: loginLock.current });
    
    if (!mobileNumber) {
      log.warn('OTP request blocked: No mobile number');
      return;
    }
    
    if (loginLock.current) {
      log.warn('OTP request blocked: Lock active (double-click prevented)');
      return;
    }

    try {
      loginLock.current = true;
      log.debug('Lock acquired');
      
      const waitingLogin = toast.info('جاري تسجيل الدخول...', {
        autoClose: false,
      });
      const useFirebase = shouldUseFirebase(mobileNumber);
      log.info('Verification method selected', { method: useFirebase ? 'Firebase' : 'SMS', phone: mobileNumber });

      if (useFirebase) {
        try {
          log.info('Sending Firebase OTP...');
          await sendFirebaseOtp(mobileNumber, 'recaptcha-container');
          log.info('Firebase OTP sent successfully');
          dispatch(setMobileAuth({ number: mobileNumber, method: 'firebase' }));
        } catch (firebaseError: any) {
          log.error('Firebase OTP failed', {
            code: firebaseError.code,
            message: firebaseError.message,
            phone: mobileNumber
          });
          
          if (firebaseError.code === 'auth/too-many-requests') {
            log.info('Falling back to SMS due to rate limit');
            await authApi.requestOtp({ phone: mobileNumber });
            dispatch(setMobileAuth({ number: mobileNumber, method: 'sms' }));
          } else {
            throw firebaseError;
          }
        }
      } else {
        log.info('Sending SMS OTP...');
        await authApi.requestOtp({ phone: mobileNumber });
        log.info('SMS OTP sent successfully');
        dispatch(setMobileAuth({ number: mobileNumber, method: 'sms' }));
      }
      
      toast.dismiss(waitingLogin);
      toast.success('تم ارسال رمز التحقق', {
        autoClose: 2000,
        hideProgressBar: true,
      });
      log.info('OTP request completed successfully');
      setShowOtp(true);
    } catch (error: any) {
      log.error('OTP request failed', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        phone: mobileNumber
      });
      
      const waitingLogin = toast.info('جاري تسجيل الدخول...', { autoClose: false });
      toast.dismiss(waitingLogin);
      let errorMsg = 'فشل تسجيل الدخول';
      const errMsg = (error.message || '').toUpperCase();
      const errCode = error.code || '';
      
      if (
        errMsg.includes('INVALID_APP_CREDENTIAL') ||
        errMsg.includes('INVALID-APP-CREDENTIAL')
      ) {
        errorMsg = 'Firebase: Enable Phone Auth in Console or check API key';
      } else if (
        errMsg.includes('TOO MANY ATTEMPTS') ||
        errMsg.includes('TOO-MANY-REQUESTS') ||
        errMsg.includes('TOO_MANY_ATTEMPTS_TRY_LATER')
      ) {
        errorMsg = 'محاولات كثيرة. حاول بعد قليل';
      } else if (
        errMsg.includes('FIREBASE NOT CONFIGURED') ||
        errMsg.includes('FIREBASE NOT INITIALIZED')
      ) {
        errorMsg = 'Firebase not configured';
      } else if (errCode === 'auth/internal-error') {
        errorMsg = 'خطأ داخلي في Firebase. يرجى المحاولة مرة أخرى';
        log.error('Firebase internal-error detected', { phone: mobileNumber, fullError: error });
      }
      
      log.info('Showing error to user', { errorMsg });
      toast.error(errorMsg, { autoClose: 4000, hideProgressBar: true });
    } finally {
      loginLock.current = false;
      log.debug('Lock released');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    log.info('OTP verification initiated', { mobileNumber, otpLength: otpCode.length, method: verificationMethod });
    
    if (mobileNumber && otpCode) {
      const waitingLogin = toast.info('جاري تسجيل الدخول...', {
        autoClose: false,
      });
      try {
        let response;
        if (verificationMethod === 'firebase') {
          log.info('Verifying Firebase OTP...');
          const { token } = await verifyFirebaseOtp(otpCode);
          log.info('Firebase token received, calling backend...');
          response = await authApi.verifyFirebaseOtp({ firebase_token: token, app_type: 'passenger' });
          log.info('Backend verification successful');
        } else {
          log.info('Verifying SMS OTP...');
          response = await authApi.verifyOtp({
            phone: mobileNumber,
            otp: otpCode,
            app_type: 'passenger',
          });
          log.info('SMS verification successful');
        }
        const accessToken = response.data.tokens.access;

        dispatch(
          setAuthState({
            isAuthenticated: true,
            token: encryptToken(accessToken),
            refreshToken: encryptToken(response.data.tokens.refresh),
          })
        );

        log.info('Fetching user profile...');
        const authenticatedClient = createAuthenticatedClient(accessToken);
        const profileResponse = await authenticatedClient.get('/profile/me/');

        const profileData = profileResponse.data.profile;
        dispatch(setProfileDetails(profileData));

        const profile = { data: profileData };

        toast.dismiss(waitingLogin);
        toast.success('تم تسجيل الدخول بنجاح', {
          autoClose: 2000,
          hideProgressBar: true,
        });
        log.info('Login successful', { hasFullName: !!profile.data.full_name });

        setMobileNumber('');
        setOtpCode('');
        setShowOtp(false);
        dispatch(setMobileAuth(''));

        if (!profile.data.full_name) {
          log.info('Profile incomplete, showing profile form');
          onClose();
          setTimeout(() => {
            if (onOpenProfileModal) {
              onOpenProfileModal();
            } else {
              setShowProfileModal(true);
            }
          }, 100);
        } else {
          log.info('Profile complete, closing modal');
          onClose();
        }
      } catch (error: any) {
        log.error('OTP verification failed', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          method: verificationMethod,
          phone: mobileNumber
        });
        
        toast.dismiss(waitingLogin);
        
        if (error.response?.status === 403 && error.response?.data?.error === 'WRONG_APP') {
          log.warn('Wrong app error detected');
          toast.error(error.response.data.message, { autoClose: 5000, hideProgressBar: true });
        } else {
          const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.response?.data?.detail ||
            'رمز التحقق غير صحيح أو منتهي الصلاحية';
          
          log.info('Showing error to user', { errorMessage });
          toast.error('فشل تسجيل الدخول', {
            autoClose: 2000,
            hideProgressBar: true,
          });
          setTimeout(() => {
            toast.error(errorMessage, { autoClose: 3000, hideProgressBar: true });
          }, 2200);
        }
      }
    } else {
      log.warn('Verification blocked: missing data', { hasMobile: !!mobileNumber, hasOtp: !!otpCode });
    }
  };

  const handleEdit = () => {
    setShowOtp(false);
    setOtpCode('');
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <ProfileFormModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
      <div className='fixed inset-0 z-[500] flex items-center justify-center p-4'>
        <div
          className='absolute inset-0 bg-black/40 backdrop-blur-sm'
          onClick={onClose}
        />
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
            <h2 className='text-2xl font-black text-[#042f40]'>
              {showOtp ? 'تاكيد رمز التحقق' : 'سجل دخولك في يلا باص'}
            </h2>
            <p className='text-slate-500 text-sm mt-1'>
              {showOtp
                ? 'ادخل رمز التحقق الذي ارسل الى'
                : 'أدخل رقم هاتفك للمتابعة'}
            </p>
          </div>

          {!showOtp ? (
            <form
              onSubmit={handleRequestOtp}
              className='space-y-6'>
              <PhoneInput
                value={mobileNumber}
                onChange={setMobileNumber}
                countries={countries}
              />

              <div
                id='recaptcha-container'
                className='flex justify-center my-4'></div>

              <button
                type='submit'
                className='w-full py-3.5 bg-[#005687] hover:bg-[#004a73] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 active:scale-95 transition-all'>
                طلب رمز التحقق
              </button>
            </form>
          ) : (
            <>
              <div className='flex justify-center items-center gap-2 mb-6'>
                <h1
                  className='text-lg font-bold text-[#005687]'
                  dir='ltr'>
                  +{mobileNumber}
                </h1>
                <button
                  onClick={handleEdit}
                  type='button'>
                  <PencilSquareIcon className='h-5 w-5 text-[#005687]' />
                </button>
              </div>
              <form
                onSubmit={handleVerifyOtp}
                className='space-y-6'>
                <div className='flex justify-center'>
                  <OtpInput
                    value={otpCode}
                    onChange={setOtpCode}
                    length={6}
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
