import { createSlice } from "@reduxjs/toolkit";

export interface DriverState {
    driverDetails:any;
}

const initialState: DriverState = {
    driverDetails: null,
};

export const driverSlice = createSlice({
    name: 'driver',
    initialState,
    reducers: {
        setDriverDetails(state, action) {
            state.driverDetails = action.payload;
        },
        resetDriverState: () => initialState
    }
})


export const {setDriverDetails,resetDriverState} = driverSlice.actions
export default driverSlice.reducer