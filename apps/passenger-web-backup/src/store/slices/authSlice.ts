import {PayloadAction, createSlice}  from '@reduxjs/toolkit'
import {AppState} from '../store';
import {HYDRATE} from "next-redux-wrapper";


export interface AuthState {
  isAuthenticated: boolean| undefined;
  token: string | null| undefined;
  refreshToken: string|null| undefined;
  status: string | null| undefined;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  status: null,
  
};

export const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
    setAuthState(state, action: PayloadAction<{ isAuthenticated?: boolean | undefined; token?: string | null| undefined; refreshToken?:string|null| undefined; status?: string | null | undefined; }>) {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.status = action.payload.status;
      },
    resetAuthState: () => initialState,
   },

  //  extraReducers: {
  //   [HYDRATE]: (state, action) => {
  //       return {
  //           ...state,
  //           ...action.payload.auth,
  //      }
  //    }
  //  }
  extraReducers: (builder) => {
    builder.addCase(HYDRATE as any, (state, action: PayloadAction<{ auth: AuthState }>) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    });
  },
  
})

export const {setAuthState,resetAuthState} = authSlice.actions;

export const selectAuthState = (state: AppState) => state.auth.authState;

export default authSlice.reducer


