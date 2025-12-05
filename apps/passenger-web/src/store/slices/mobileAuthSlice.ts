import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface MobileAuthState  {
    number: string | null;
    verificationMethod: 'sms' | 'firebase' | null;
}

const initialState: MobileAuthState = {
    number:null,
    verificationMethod: null
}

export const mobileAuthSlice = createSlice({
    name:'mobileAuth',
    initialState,
    reducers:{
        setMobileAuth(state, action:PayloadAction<{ number: string; method: 'sms' | 'firebase' } | string>){
            if (typeof action.payload === 'string') {
                state.number = action.payload;
                state.verificationMethod = 'sms';
            } else {
                state.number = action.payload.number;
                state.verificationMethod = action.payload.method;
            }
        },
        resetMobileAuth(state){
            state.number = null;
        }
    }
})

export const {setMobileAuth, resetMobileAuth} = mobileAuthSlice.actions;

export default mobileAuthSlice.reducer;