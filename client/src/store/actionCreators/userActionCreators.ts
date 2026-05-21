import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {EditProfileData, fetchUserData} from "../types/userTypes.ts";
import {axiosInstance} from "../../utils/apiCalls";

const getApiErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error) && error.response?.data !== undefined) {
        const data = error.response.data;
        if (typeof data === 'string') return data;
        if (typeof data === 'object' && data !== null && 'message' in data) {
            return String((data as { message: unknown }).message);
        }
    }
    if (error instanceof Error) return error.message;
    return 'Request failed';
};

export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async ({username}: fetchUserData, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }
        const response = await axiosInstance.get(
            `/users/${username}`,
            config
        );
        return response.data[0];
    } catch (error: unknown) {
            return rejectWithValue(getApiErrorMessage(error));
        }
    }
);

export const editProfile = createAsyncThunk(
    'user/editProfile',
    async ({profile_image, username, new_username, website, bio}: EditProfileData, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            if (profile_image) {
                formData.append('photo', profile_image[0]);
            }
            formData.append('new_username', new_username);
            formData.append('website', website);
            formData.append('bio', bio);

            const response = await axiosInstance.post(
                `/users/${username}/edit`,
                formData
            );
            return response.data;

        } catch (error: unknown) {
            return rejectWithValue(getApiErrorMessage(error));
        }
    }
);