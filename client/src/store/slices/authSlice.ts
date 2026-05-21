import {createSlice} from "@reduxjs/toolkit";
import {authStateType} from '../types/authTypes.ts';
import {registerUser, resetPassword, userLogin, logoutUser} from "../actionCreators/authActionCreators.ts";

const initialState:authStateType = {
    status: 'IDLE',
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearAuthError: (state) => {
            state.error = null;
            state.status = 'IDLE';
        },
    },
    extraReducers: builder => {
        builder.addCase(registerUser.pending, (state) => {
            state.status = 'LOADING';
            state.error = null;
        }).addCase(registerUser.fulfilled, (state) => {
            state.status = 'REGISTERED';
            state.error = null;
        }).addCase(registerUser.rejected, (state, action) => {
            state.status = 'FAILED';
            state.error = (action.payload as string) || action.error.message || "Registration failed";
        }).addCase(userLogin.pending, (state) => {
            state.status = 'LOADING';
            state.error = null;
        }).addCase(userLogin.fulfilled, (state) => {
            state.status = 'SUCCEEDED';
            state.error = null;
        }).addCase(userLogin.rejected, (state, action) => {
            state.status = 'FAILED';
            state.error = (action.payload as string) || action.error.message || "Login failed";
        }).addCase(resetPassword.pending, (state) => {
        state.status = 'LOADING';
        state.error = null;
        }).addCase(resetPassword.fulfilled, () => initialState)
            .addCase(resetPassword.rejected, (state, action) => {
            state.status = 'FAILED';
            state.error = (action.payload as string) || action.error.message || "Reset failed";
        }).addCase(logoutUser.fulfilled, () => initialState); // Reset state on logout
    }
})

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;