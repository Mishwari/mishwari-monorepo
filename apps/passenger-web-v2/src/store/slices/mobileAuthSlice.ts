import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface MobileAuthState  {
    number: string | null;
}

const initialState: MobileAuthState = {
    number:null
}

export const mobileAuthSlice = createSlice({
    name:'mobileAuth',
    initialState,
    reducers:{
        setMobileAuth(state, action:PayloadAction<string>){
            state.number = action.payload;
        },
        resetMobileAuth(state){
            state.number = null;
        }
    }
})

export const {setMobileAuth, resetMobileAuth} = mobileAuthSlice.actions;

export default mobileAuthSlice.reducer;