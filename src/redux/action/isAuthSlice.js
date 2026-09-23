import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status : false
};

export const isAuthSlice = createSlice({
    name: 'isAuth',
    initialState,
    reducers : {
        setAuthToken : (state) => {
            state.status = true
        },
        resetAuthToken : (state) => {
            state.status = false
        }
    }
})


export const { setAuthToken , resetAuthToken } = isAuthSlice.actions;
export default isAuthSlice.reducer;
