// to be updated 
import axios from 'axios';
// import { AppDispatch, RootState } from '../index';
import { AppState, AppStore } from '../store';
import { setPassengers } from '../slices/passengersSlice';
// import { PassengerObject } from '@/pages/bus_list/[tripId]';
import { Passenger } from '@/types/passenger';
import { decryptToken } from '@/utils/tokenUtils';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


export const fetchPassengers = () => async (dispatch: any , getState: () => AppStore) => {
  const { auth } = getState();
  console.log(auth)
  try {


    const response = await axios.get(`${apiBaseUrl}passengers/`, {
      headers: {
        // Authorization: `Bearer ${localStorage.getItem('token')}`,
        Authorization: `Bearer ${decryptToken(auth.token)}`,
      },
    });
    const newPassengers = response.data.map((passenger: Passenger) => ({
        id: passenger.id || null,
        name: passenger.name || '',
        email: passenger.email || '',
        phone: passenger.phone || '',
        age: Number(passenger.age) || null,
        is_checked: passenger.is_checked || false,
        gender: Boolean(passenger.gender) ,
      }));
  
      const existingPassengers = getState().passengers.list;
      const passengersToAdd = newPassengers.filter(
        (newPassenger:Passenger) => !existingPassengers.some((existingPassenger:Passenger) => existingPassenger.id === newPassenger.id)
      );
  
      dispatch(setPassengers(passengersToAdd));
  
  } catch (error: any) {
    console.error('Error fetching passengers:', error.message);
  }
};
