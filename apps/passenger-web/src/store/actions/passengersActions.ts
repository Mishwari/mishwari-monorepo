import { apiClient } from '@mishwari/api';
import { AppState, AppStore } from '../store';
import { setPassengers } from '../slices/passengersSlice';
import { Passenger } from '@/types/passenger';


export const fetchPassengers = () => async (dispatch: any , getState: () => AppStore) => {
  try {
    const response = await apiClient.get('passengers/');
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
