import {PayloadAction, createSlice}  from '@reduxjs/toolkit'
import {AppState} from '../store';
import {HYDRATE} from "next-redux-wrapper";
import type { Profile } from '@mishwari/types';

export interface AuthState {
  isAuthenticated: boolean| undefined;
  token: string | null| undefined;
  refreshToken: string|null| undefined;
  profile: Profile | null;
  canManageDrivers: boolean;
  canUpgrade: boolean;
  canPublish: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  profile: null,
  canManageDrivers: false,
  canUpgrade: false,
  canPublish: false,
};

export const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
    setAuthState(state, action: PayloadAction<Partial<AuthState>>) {
      return { ...state, ...action.payload };
    },
    setProfile(state, action: PayloadAction<Profile>) {
      state.profile = action.payload;
      const role = (action.payload as any)?.profile?.role || action.payload.role;
      const isVerified = (action.payload as any)?.profile?.is_verified || action.payload.is_verified;
      state.canManageDrivers = role === 'operator_admin';
      state.canUpgrade = role === 'driver';
      state.canPublish = isVerified;
    },
    resetAuthState: () => initialState,
   },

  extraReducers: (builder) => {
    builder.addCase(HYDRATE as any, (state, action: PayloadAction<{ auth: AuthState }>) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    });
  },
})

export const {setAuthState, setProfile, resetAuthState} = authSlice.actions;

export const selectAuthState = (state: AppState) => state.auth.authState;

export default authSlice.reducer
