import { addTripDetails, setTripsDetails, updateTripStatus } from '@/slices/tripsSlice';
import axios from 'axios';
import { resolve } from 'path';

import { toast } from 'react-toastify';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;




export const fetchTripsDetails = (token: string) => async (dispatch: any) => {
    try {
      // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const config = {
        headers:{
          Authorization: `Bearer ${token}`
        },
      }

      const response = await axios.get(`${apiBaseUrl}driver-trips/`,config); // Adjust the URL
      dispatch(setTripsDetails( response.data));
  
    } catch (error: any) {
      console.error('Error fetching user details:', error.message);
      // Optionally, handle token expiration or invalid token here
    }
  };


  
export const createTrip = (tripData:object, token:string) => async (dispatch:any) => {

  const waitingCreateTrip = toast.info('جاري انشاء الرحلة...',{
    autoClose: false,
  })
  const delay = (ms:any) => new Promise(resolve => setTimeout(resolve , ms));

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await Promise.all([

      axios.post(`${apiBaseUrl}test-create/`, tripData, config),
      delay(1000)
    ])


    dispatch(addTripDetails(response[0].data));
    
    toast.dismiss(waitingCreateTrip)
    toast.success('تم انشاء الرحلة بنجاح',{
      autoClose:2000,
      hideProgressBar: true,
    })
    
  } catch (error) {
    toast.dismiss(waitingCreateTrip)
    toast.error('حدث خطأ اثناء انشاء الرحلة يرجى اعادة المحاولة',{
      autoClose:2000,
      hideProgressBar: true,
    })
    console.error('Error creating trip:', error);
  }
};



export const changeTripStatus = (id:number, newStatus:string, token:string) => async (dispatch:any) => {
  const waitingMessage = newStatus === 'active' ? 'جاري بدء الرحلة' : newStatus === 'completed'? 'جاري اتمام الرحلة': newStatus === 'stopped'? 'جاري ايقاف الرحلة اضطراريا' : newStatus ==='cancelled' ? 'جاري الغاء الرحلة':'جاري اتمام الطلب'
  const successMessage = newStatus === 'active' ? 'تم بدء الرحلة بنجاح' : newStatus === 'completed'? 'تم اتمام الرحلة بنجاح': newStatus === 'stopped'? 'تم ايقاف الرحلة اضطراريا' : newStatus ==='cancelled' ? 'تم الغاء الرحلة بنجاح':'تم اتمام الطلب'
  const failedMessage = newStatus === 'active' ? 'فشل بدء الرحلة' : newStatus === 'completed'? 'فشل اتمام الرحلة': newStatus === 'stopped'? 'فشل ايقاف الرحلة اضطراريا' : newStatus ==='cancelled' ? 'فشل الغاء الرحلة':'لم يتم اتمام الطلب'

  const waitingStatusChange = toast.info(waitingMessage+'...',{
    autoClose: false,
  })

  const delay = (ms:any) => new Promise(resolve => setTimeout(resolve , ms));

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    await Promise.all([
      axios.patch(`${apiBaseUrl}driver-trips/${id}/`, {trip_status:newStatus},config),
      delay(1000)
    ]) 
    
    
    

    toast.dismiss(waitingStatusChange)
    toast.success(successMessage,{
      autoClose:2000,
      hideProgressBar: true,
    })

    dispatch(updateTripStatus({id, newStatus}));

  } catch (error) {
    
    toast.dismiss(waitingStatusChange)
    toast.error(failedMessage,{
      autoClose:2000,
      hideProgressBar: true,
    })
    console.error('Error Update The Trip Status', error)
  }
}
