import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
    userDetails:any;
}

const initialState: UserState = {
    userDetails: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserDetails(state, action) {
            state.userDetails = action.payload;
        },
        resetUserState: () => initialState
    }
})


export const {setUserDetails,resetUserState} = userSlice.actions
export default userSlice.reducer

