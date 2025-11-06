import { setDriverDetails } from '@/slices/driverSlice';
import axios from 'axios';
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;




export const fetchDriverDetails = (token: string) => async (dispatch: any) => {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${apiBaseUrl}driver-details/`); // Adjust the URL
      dispatch(setDriverDetails( response.data));
  
    } catch (error: any) {
      console.error('Error fetching driver details:', error.message);
      // Optionally, handle token expiration or invalid token here
    }
  };
  