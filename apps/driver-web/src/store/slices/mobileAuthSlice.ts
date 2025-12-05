import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MobileAuthState {
  number: string | null;
  verificationMethod: 'sms' | 'firebase' | null;
}

const initialState: MobileAuthState = {
  number: null,
  verificationMethod: null,
};

export const mobileAuthSlice = createSlice({
  name: 'mobileAuth',
  initialState,
  reducers: {
    setMobileAuth(state, action: PayloadAction<{ number: string; method: 'sms' | 'firebase' }>) {
      state.number = action.payload.number;
      state.verificationMethod = action.payload.method;
    },
    resetMobileAuth: () => initialState,
  },
});

export const { setMobileAuth, resetMobileAuth } = mobileAuthSlice.actions;
export default mobileAuthSlice.reducer;
