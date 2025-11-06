// import { PassengerObject } from '@/pages/bus_list/[tripId]';
import { Passenger as PassengerObject } from '@/types/passenger';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Passenger {
    id:number
    name: string;
    email: string;
    phone: string;
    gender:boolean;
  }

interface PassengersState {
list: PassengerObject[];
}

const initialState: PassengersState = {
    list: [],
  };


  export const passengersSlice = createSlice({
    name: 'passengers',
    initialState,
    reducers: {
    setPassengers(state, action: PayloadAction<PassengerObject[]>) {
        // Filter out passengers that are already in the state
        const newPassengers = action.payload.filter(
            (newPassenger) => !state.list.some((existingPassenger) => existingPassenger.id === newPassenger.id)
        );
        state.list = [...state.list, ...newPassengers];
        },
      addPassenger(state, action: PayloadAction<PassengerObject>) {
        state.list.push(action.payload);
      },
      updatePassenger(state, action: PayloadAction<{ index: number; passenger: PassengerObject }>) {
        state.list[action.payload.index] = action.payload.passenger;
      },
      deletePassenger(state, action: PayloadAction<number>) {
        state.list.splice(action.payload, 1);
      },
      checkPassenger(state, action: PayloadAction<number>) {
        const index = action.payload;
        state.list[index].is_checked = !state.list[index].is_checked;
      },
      resetPassengersState: () => initialState
    },
  });

  export const { setPassengers, addPassenger, updatePassenger, deletePassenger,checkPassenger } = passengersSlice.actions;
  export default passengersSlice.reducer;
