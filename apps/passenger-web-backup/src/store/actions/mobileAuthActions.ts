import { setAuthState,resetAuthState } from '../slices/authSlice';
import { setUserDetails,resetUserState } from '../slices/userSlice';
import { setMobileAuth, resetMobileAuth } from '../slices/mobileAuthSlice';
import { useSelector } from 'react-redux';

// import { resetDriverState } from '@/slices/driverSlice';
// import { resetTripsState } from '@/slices/tripsSlice';
import { toast } from 'react-toastify';
import axios, { AxiosResponse } from 'axios';
import { AppStore } from '../store';
import { Profile } from '@/types/profileDetails';
import { fetchProfileDetails } from './authActions';
import { encryptToken, decryptToken } from '@/utils/tokenUtils';




interface LoginResponse {
  tokens: any;
  access: string;
  user_status :string
}


// performLogin is an asynchronous Redux thunk that calls the login
export const performMobileLogin = (mobileNumber: string, router: any) => async (dispatch:any) => {

  const waitingLogin = toast.info('جاري تسجيل الدخول...',{
    autoClose: false
  })
  const delay = (ms:any) => new Promise(resolve => setTimeout(resolve , ms));

  try {
    const response: [AxiosResponse<LoginResponse>, any]  = await Promise.all([
      axios.post<LoginResponse>('api/next-external/auth/request-otp/', {mobile_number: mobileNumber}),
      delay(1000),
    ])

    console.log('mobile', mobileNumber)
    dispatch(setMobileAuth(mobileNumber));

    toast.dismiss(waitingLogin);
    toast.success('تم ارسال رمز التحقق',{
      autoClose:2000,
      hideProgressBar: true,
    })
    router.push('/login/confirm')
    // window.location.href = '/login/confirm'

  } catch (error:any) {

    toast.dismiss(waitingLogin);
    toast.error('فشل تسجيل الدخول ',{
      autoClose:2000,
      hideProgressBar: true,
    })
    setTimeout(() => {

      toast.error(error.message,{
        autoClose:1500,
        hideProgressBar: true,
      })
    },2800)

    console.error('Login failed:', error.message);
  }
};


export const performVerifyLogin = (mobileNumber: string, otpCode: string, router:any) => async (dispatch:any) => {

    const waitingLogin = toast.info('جاري تسجيل الدخول...',{
      autoClose: false
    })
    const delay = (ms:any) => new Promise(resolve => setTimeout(resolve , ms));
    console.log('mobile', mobileNumber,'otp', otpCode)
  
    try {
      const response: [AxiosResponse<LoginResponse>, any]  = await Promise.all([
        axios.patch<LoginResponse>('/api/next-external/auth/verify-otp/', {mobile_number: mobileNumber, otp_code: otpCode}),
        delay(1000),
      ])
  
      if (response[0].data.tokens.access){
        
          dispatch(setAuthState({
            isAuthenticated: true,
            token: encryptToken(response[0].data.tokens.access),
            refreshToken: encryptToken(response[0].data.tokens.refresh) ,
            status: response[0].data.user_status,
          }));
        }

        

    console.log("response: ",response)
  
      toast.dismiss(waitingLogin);
      toast.success('تم تسجيل الدخول بنجاح',{
        autoClose:2000,
        hideProgressBar: true,
      })
      if (response[0].data.user_status === 'partial'){
        
        router.push('/login/complete_profile')
      }else {
        dispatch(resetMobileAuth())
        router.push('/')
      }
      
  
    } catch (error:any) {
  
      toast.dismiss(waitingLogin);
      toast.error('فشل تسجيل الدخول ',{
        autoClose:2000,
        hideProgressBar: true,
      })
      setTimeout(() => {
  
        toast.error(error.message,{
          autoClose:1500,
          hideProgressBar: true,
        })
      },2800)
  
      console.error('Login failed:', error);
      router.push('/login'); 
    }
  };


export const performRegister = (profileData: Profile, router: any) => async (dispatch:any,  getState: () => AppStore) => {
  const data = {
      username : profileData.user.username,
      full_name: profileData.full_name,
      gender : profileData.gender,
      email : profileData.user.email,
      birth_date : profileData.birth_date
  }
  const {auth} = getState()
  if(!auth.isAuthenticated ) {
      // dispatch(setError('User is not authenticated'))
      return;
  }
  
  const waitingRegister = toast.info('جاري التسجيل...',{
    autoClose: false
  })
  const delay = (ms:any) => new Promise(resolve => setTimeout(resolve, ms));

  try {
    const response: [AxiosResponse<any>, any]  = await Promise.all([
      axios.post<any>('/api/next-external/auth/register',
      data, 
      {
          headers: {
            Authorization: `Bearer ${decryptToken(auth.token)}`,
          },
        }
      ),
      delay(1000),
    ])
    toast.dismiss(waitingRegister);
    toast.success('تم التسجيل بنجاح',{
      autoClose:2000,
      hideProgressBar: true,
    })
    console.log('respone',response);
    dispatch(setAuthState({
      isAuthenticated: true,
      token: encryptToken(response[0].data.tokens.access),
      refreshToken: encryptToken(response[0].data.tokens.refresh),
      status: response[0].data.user_status,
    }));
    if (response[0].data.purpose == 'create'){
      // console.log('edit', response[0].data.purpose)
      router.push('/')
    }
    dispatch(fetchProfileDetails(response[0].data.tokens.access))
    
  } catch (error:any) {
      toast.dismiss(waitingRegister);
      toast.error('فشل التسجيل ',{
      autoClose:2000,
      hideProgressBar: true,
      })
      setTimeout(() => {
          toast.error(error.message,{
          autoClose:1500,
          hideProgressBar: true,
          })
      },2800)
      console.error('Register failed:', error);

  }
}
  
  