import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    first_name : '',
    last_name : '',
    username : '',
    user_id : '',
    access : '',
    refresh : ''
};

export const userInfoSlice = createSlice({
    name : 'userInformation',
    initialState,
    reducers : {
        setUserInfo : (state, action) => {
            state.first_name = action.payload.first_name,
            state.last_name = action.payload.last_name,
            state.username = action.payload.username
            state.access = action.payload.access,
            state.refresh = action.payload.refresh
            state.user_id = action.payload.user_id
        },
        resetUserInfo : (state) => {
             state.first_name = '',
            state.last_name = '',
            state.username = ''
            state.access = '',
            state.refresh = ''
            state.user_id = ''
        }
    }
})

export const { setUserInfo , resetUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;