import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MobileAuthState {
  number: string | null;
}

const initialState: MobileAuthState = {
  number: null,
};

export const mobileAuthSlice = createSlice({
  name: 'mobileAuth',
  initialState,
  reducers: {
    setMobileAuth(state, action: PayloadAction<string>) {
      state.number = action.payload;
    },
    resetMobileAuth: () => initialState,
  },
});

export const { setMobileAuth, resetMobileAuth } = mobileAuthSlice.actions;
export default mobileAuthSlice.reducer;
