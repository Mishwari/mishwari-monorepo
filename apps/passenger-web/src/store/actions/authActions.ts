import { setAuthState,resetAuthState } from '../slices/authSlice';
import { setUserDetails,resetUserState } from '../slices/userSlice';
import { toast } from 'react-toastify';
import axios, { AxiosResponse } from 'axios';
import { userApi, profileApi, apiClient } from '@mishwari/api';
import { setProfileDetails } from '../slices/profileSlice';
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


export const fetchUserDetails = () => async (dispatch: any) => {
  try {
    const response = await apiClient.get('user/');
    dispatch(setUserDetails(response.data[0]));
  } catch (error: any) {
    console.error('Error fetching user details:', error.message);
  }
};




export const fetchProfileDetails = () => async (dispatch: any) => {
  try {
    const response = await apiClient.get('profile/');
    dispatch(setProfileDetails(response.data));
  } catch (error: any) {
    console.error('Error fetching profile details:', error.message);
  }
};