import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Trip {
    driver_id:number;
    pickup: string;
    destination: string;
    departure_time: any;
    arrival_time: any;
    price: number;
    id:number;
    trip_status:string;

  }

export interface TripsState {
    tripsDetails: Trip[] | null;
}

const initialState: TripsState = {
    tripsDetails: null,
};

export const tripsSlice = createSlice({
    name: 'trips',
    initialState,
    reducers: {
        setTripsDetails(state, action: PayloadAction<Trip[]>) {
            state.tripsDetails = action.payload;
        },
        addTripDetails(state, action:PayloadAction<Trip>){
            state.tripsDetails = state.tripsDetails ? [...state.tripsDetails, action.payload] : [action.payload];        
        },
        updateTripStatus:(state,action: PayloadAction<{id: number, newStatus:string}>) => {
            const {id, newStatus} = action.payload
            const index = state.tripsDetails!.findIndex(trip => trip.id === id)
            if (index !== -1) {
                state.tripsDetails![index].trip_status = newStatus
            }
        },
        resetTripsState: () => initialState,
    }
})


export const {setTripsDetails, addTripDetails, resetTripsState, updateTripStatus} = tripsSlice.actions
export default tripsSlice.reducer