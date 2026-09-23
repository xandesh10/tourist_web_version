import { createSlice } from "@reduxjs/toolkit";

const initialState = ({
    email : ''
})


export const emailAuthSlice = createSlice({
    name: 'emailForToken',
    initialState,
    reducers : {
        setEmailOnRedux : (state , action) => {
                state.email = action.payload.email
        },
        resetEmailOnRedux : (state) => {
            state.email = ''
        }
    }
})


export const {setEmailOnRedux, resetEmailOnRedux} = emailAuthSlice.actions;
export default emailAuthSlice.reducer;