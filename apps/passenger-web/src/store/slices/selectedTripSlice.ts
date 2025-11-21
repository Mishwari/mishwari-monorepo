import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface TripState  {
    id: number | null;
}

const initialState: TripState = {
    id:null
}

export const selectedTripSlice = createSlice({
    name:'selectedTrip',
    initialState,
    reducers:{
        setSelectedTrip(state, action:PayloadAction<number>){
            state.id = action.payload;
        },
        resetSelectedTrip(state){
            state.id = null;
        }
    }
})

export const {setSelectedTrip, resetSelectedTrip} = selectedTripSlice.actions;

export default selectedTripSlice.reducer;