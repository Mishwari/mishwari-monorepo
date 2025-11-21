import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Trip } from '@mishwari/types';

export interface TripsState {
  tripsDetails: Trip[] | null;
  loading: boolean;
}

const initialState: TripsState = {
  tripsDetails: null,
  loading: false,
};

export const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    setTripsDetails(state, action: PayloadAction<Trip[]>) {
      state.tripsDetails = action.payload;
      state.loading = false;
    },
    addTripDetails(state, action: PayloadAction<Trip>) {
      state.tripsDetails = state.tripsDetails ? [...state.tripsDetails, action.payload] : [action.payload];
    },
    updateTripStatus: (state, action: PayloadAction<{ id: number, newStatus: string }>) => {
      const { id, newStatus } = action.payload;
      const index = state.tripsDetails!.findIndex(trip => trip.id === id);
      if (index !== -1) {
        state.tripsDetails![index].trip_status = newStatus;
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    resetTripsState: () => initialState,
  }
});

export const { setTripsDetails, addTripDetails, resetTripsState, updateTripStatus, setLoading } = tripsSlice.actions;
export default tripsSlice.reducer;
