import { setAuthState,resetAuthState } from '../slices/authSlice';
import { setUserDetails,resetUserState } from '../slices/userSlice';
import { setMobileAuth, resetMobileAuth } from '../slices/mobileAuthSlice';
import { setProfileDetails } from '../slices/profileSlice';
import { useSelector } from 'react-redux';

// import { resetDriverState } from '@/slices/driverSlice';
// import { resetTripsState } from '@/slices/tripsSlice';
import { toast } from 'react-toastify';
import axios, { AxiosResponse } from 'axios';
import { authApi, apiClient } from '@mishwari/api';
import { AppStore } from '../store';
import { Profile } from '@/types/profileDetails';
import { fetchProfileDetails } from './authActions';
import { encryptToken, decryptToken } from '@/utils/tokenUtils';




interface LoginResponse {
  tokens: any;
  access: string;
}






export const performRegister = (profileData: Profile, router: any) => async (dispatch:any,  getState: () => AppStore) => {
  const {auth} = getState()
  const data = {
      full_name: profileData.full_name,
      gender : profileData.gender,
      email : profileData.user.email,
      birth_date : profileData.birth_date
  }
  if(!auth.isAuthenticated ) {
      return;
  }
  
  const waitingRegister = toast.info('جاري التسجيل...',{
    autoClose: false
  })

  try {
    await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}mobile-login/complete-profile/`, data, {
      headers: {
        Authorization: `Bearer ${decryptToken(auth.token)}`,
      },
    });

    // Fetch updated profile - getMe returns nested structure
    const response = await authApi.getMe();
    // Reconstruct profile with user data from top level
    const profileData = {
      ...response.data.profile,
      user: {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        first_name: '',
        last_name: ''
      }
    };
    dispatch(setProfileDetails(profileData));

    toast.dismiss(waitingRegister);
    toast.success('تم التسجيل بنجاح',{
      autoClose:2000,
      hideProgressBar: true,
    })
    
  } catch (error:any) {
      toast.dismiss(waitingRegister);
      toast.error('فشل التسجيل ',{
      autoClose:2000,
      hideProgressBar: true,
      })
      setTimeout(() => {
          toast.error(error.response?.data?.message || error.response?.data?.error || error.message,{
          autoClose:1500,
          hideProgressBar: true,
          })
      },2800)
      console.error('Register failed:', error.response?.data || error);
  }
}
  
  