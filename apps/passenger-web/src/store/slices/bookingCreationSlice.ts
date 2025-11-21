import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Passenger as PassengerObject } from "@/types/passenger";
import { Trip } from "@/types/trip";

interface Passenger {
    id: number;
    name: string;
    email: string;
    phone: string;
    gender: string;
}

interface BookingCreationSlice {
    trip: Trip | null;
    passengers: PassengerObject[];
    amount: number;
    isPaid: boolean;
    status: 'idle' | 'loading'| 'succeeded' | 'failed';
    error: string | null;
    paymentMethod: string | null;
}

const initialState: BookingCreationSlice = {
    trip: null,
    passengers: [],
    amount:0,
    isPaid: false,
    status: 'idle',
    error: null,
    paymentMethod: 'stripe',
};

export const bookingCreationSlice = createSlice({
    name: 'bookingCreation',
    initialState,
    reducers: {
        setTrip(state, action: PayloadAction<Trip>) {
            state.trip = action.payload;
            },

        setAmount(state, action: PayloadAction<number>) {
        state.amount = action.payload;
        },

        setPassengers(state, action: PayloadAction<Passenger[] >) {
            // Filter out passengers that are already in the state
                const newPassengers = action.payload.filter(
                    (newPassenger ) => !state.passengers.some((existingPassenger) => existingPassenger.id === newPassenger.id)
                );
                state.passengers = [...state.passengers, ...newPassengers];
            },

        addPassenger(state, action: PayloadAction<PassengerObject>) {
            state.passengers.push(action.payload);
            },
            
        updatePassenger(state, action: PayloadAction<{ index: number; passenger: PassengerObject }>) {
                state.passengers[action.payload.index] = action.payload.passenger;
            },

        deletePassenger(state, action: PayloadAction<number>) {
            state.passengers.splice(action.payload, 1);
            },

        checkPassenger(state, action: PayloadAction<number>) {
            const index = action.payload;
            state.passengers[index].is_checked = !state.passengers[index].is_checked;
        },

        resetPassengersState(state) {
            state.passengers = [];
            }, // not implemented

        setIsPaid(state, action: PayloadAction<boolean>) {
            state.isPaid = action.payload;
        },

        setStatus(state, action: PayloadAction<'idle' | 'loading' | 'succeeded' | 'failed'>) {
            state.status = action.payload;
          },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
          },

          setPaymentMethod(state, action: PayloadAction<string>) {
            state.paymentMethod = action.payload;
            },

        resetBookingCreationState(state) {
            state.trip = null;
            state.passengers = [];
            state.isPaid = false;
            state.status = 'idle';
            state.error = null;
            state.paymentMethod = null;
        }, // implemented when exit trip details
    },
  })
export const {
    setTrip, 
    setPassengers,
    setAmount,
    addPassenger, 
    updatePassenger, 
    deletePassenger, 
    checkPassenger, 
    setIsPaid, 
    setStatus, 
    setError,
    setPaymentMethod,
    resetBookingCreationState
} = bookingCreationSlice.actions 

export default bookingCreationSlice.reducer