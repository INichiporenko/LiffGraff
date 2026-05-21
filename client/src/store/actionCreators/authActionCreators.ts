import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {LoginDataType, RegisterDataType, ResetDataType} from '../types/authTypes.ts';
import {axiosInstance} from "../../utils/apiCalls";

const getApiErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        if (!error.response) {
            return 'Cannot reach server. Start the backend: cd server && npm run dev';
        }
        const data = error.response.data;
        if (typeof data === 'string') return data;
        if (typeof data === 'object' && data !== null && 'message' in data) {
            return String((data as { message: unknown }).message);
        }
    }
    if (error instanceof Error) return error.message;
    return 'Request failed';
};

export const registerUser = createAsyncThunk(
    'auth/register',
    async ({ username, email, fullName, password }: RegisterDataType, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            await axiosInstance.post(
                `/auth/register`,
                { username, email, fullName, password },
                config
            )
        } catch (error: unknown) {
            return rejectWithValue(getApiErrorMessage(error));
        }
    }
)

export const userLogin = createAsyncThunk(
    'auth/login',
    async ({ usernameOrEmail, password }: LoginDataType, { rejectWithValue }) => {
        try {
            // configure header's Content-Type as JSON
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            const { data } = await axiosInstance.post(
                `/auth/login`,
                { usernameOrEmail, password },
                config
            )
            return data
        } catch (error: unknown) {
            return rejectWithValue(getApiErrorMessage(error));
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/reset',
    async ({ usernameOrEmail }: ResetDataType, { rejectWithValue }) => {
        try {
            // configure header's Content-Type as JSON
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            const { data } = await axiosInstance.post(
                `/auth/reset`,
                { usernameOrEmail },
                config
            )
            return data
        } catch (error: unknown) {
            return rejectWithValue(getApiErrorMessage(error));
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.post(`/auth/logout`);
            document.cookie = ''; // Clear all cookies
        } catch (error: unknown) {
            return rejectWithValue(getApiErrorMessage(error));
        }
    }
);