import { setAuthState,resetAuthState } from '../slices/authSlice';
import { setUserDetails,resetUserState } from '../slices/userSlice';
import { setMobileAuth, resetMobileAuth } from '../slices/mobileAuthSlice';
import { setProfileDetails } from '../slices/profileSlice';
import { useSelector } from 'react-redux';

// import { resetDriverState } from '@/slices/driverSlice';
// import { resetTripsState } from '@/slices/tripsSlice';
import { toast } from 'react-toastify';
import axios, { AxiosResponse } from 'axios';
import { authApi } from '@mishwari/api';
import { AppStore } from '../store';
import { Profile } from '@/types/profileDetails';
import { fetchProfileDetails } from './authActions';
import { encryptToken, decryptToken } from '@/utils/tokenUtils';




interface LoginResponse {
  tokens: any;
  access: string;
  user_status :string
}






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
      axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}mobile-login/complete-profile/`, data, {
        headers: {
          Authorization: `Bearer ${decryptToken(auth.token)}`,
        },
      }),
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
    
    // Update profile state immediately with submitted data
    dispatch(setProfileDetails({
      user: {
        id: response[0].data.user?.id || null,
        username: data.username,
        email: data.email,
        first_name: '',
        last_name: '',
      },
      full_name: data.full_name,
      birth_date: data.birth_date,
      gender: data.gender,
      address: '',
    }));
    
    // Fetch full profile if status is not partial
    if (response[0].data.user_status !== 'partial') {
      await dispatch(fetchProfileDetails() as any);
    }
    
  } catch (error:any) {
      toast.dismiss(waitingRegister);
      toast.error('فشل التسجيل ',{
      autoClose:2000,
      hideProgressBar: true,
      })
      setTimeout(() => {
          toast.error(error.response?.data?.message || error.message,{
          autoClose:1500,
          hideProgressBar: true,
          })
      },2800)
      console.error('Register failed:', error.response?.data || error);

  }
}
  
  