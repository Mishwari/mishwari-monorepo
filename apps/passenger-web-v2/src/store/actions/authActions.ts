import { setAuthState,resetAuthState } from '../slices/authSlice';
import { setUserDetails,resetUserState } from '../slices/userSlice';
// import { resetDriverState } from '@/slices/driverSlice';
// import { resetTripsState } from '@/slices/tripsSlice';
import { toast } from 'react-toastify';
import axios, { AxiosResponse } from 'axios';
import { userApi, profileApi } from '@mishwari/api';
import { setProfileDetails } from '../slices/profileSlice';
import { decryptToken } from '@/utils/tokenUtils';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
interface LoginResponse {
  access: string;
}


// performLogin is an asynchronous Redux thunk that calls the login
export const performLogin = (username: string, password: string) => async (dispatch:any) => {

  const waitingLogin = toast.info('جاري تسجيل الدخول...',{
    autoClose: false
  })
  const delay = (ms:any) => new Promise(resolve => setTimeout(resolve , ms));

  try {
    const response: [AxiosResponse<LoginResponse>, any]  = await Promise.all([
      axios.post<LoginResponse>('api/next-external/auth/login/', {username, password}),
      delay(1000),
    ])


    dispatch(setAuthState({
      isAuthenticated: true,
      token: response[0].data.access,
      status: ''
    }));

    toast.dismiss(waitingLogin);
    toast.success('تم تسجيل الدخول بنجاح',{
      autoClose:2000,
      hideProgressBar: true,
    })

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


export const fetchUserDetails = (token: string) => async (dispatch: any) => {
  try {
    const response = await axios.get(`${apiBaseUrl}user/`, {
      headers: {
        Authorization: `Bearer ${decryptToken(token)}`,
      },
    });
    dispatch(setUserDetails( response.data[0]));

  } catch (error: any) {
    console.error('Error fetching user details:', error.message);
  }
};




export const fetchProfileDetails = (token: string) => async (dispatch: any) => {
  try {
    const response = await axios.get(`${apiBaseUrl}profile/`, {
      headers: {
        Authorization: `Bearer ${decryptToken(token)}`,
      },
    });
    dispatch(setProfileDetails( response.data));
    console.log('fetch prof',response.data)

  } catch (error: any) {
    console.error('Error fetching user details:', error.message);
  }
};