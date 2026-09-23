import { createSlice } from "@reduxjs/toolkit";


export const infoSlice = createSlice({
    name: 'information',
    initialState : {
        value : false
    },
    reducers: {
        display: (state) => {
            state.value = true
        },
        undoDisplay: (state) => {
            state.value = false
        }
    }
})

export const {display, undoDisplay} = infoSlice.actions
export default infoSlice.reducer