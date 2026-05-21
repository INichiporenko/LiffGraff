import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {CreatePost, FetchPostParams, UpdatePostParams} from "../types/postTypes.ts";
import {axiosInstance} from "../../utils/apiCalls";

export const createPost = createAsyncThunk(
    'post/createPost',
    async ({photos, content}: CreatePost, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            Array.from(photos).forEach((photo) => {
                formData.append('photos', photo);
            });
            formData.append('content', content);

                const response = await axiosInstance.post(
                `/posts/create`,
                formData
            );
            return response.data;
        } catch (error: unknown) {
            // return custom error message from backend if present
            console.log(error)
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data.message) {
                    return rejectWithValue(error.response.data.message)
                } else {
                    return rejectWithValue(error.message)
                }
            }
        }
    }
);

export const fetchPost = createAsyncThunk(
    'post/fetchPost',
    async ({id}: FetchPostParams, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.get(
                `/posts/get/${id}`
            );
            return response.data;
        } catch (error: unknown) {
            // return custom error message from backend if present
            console.log(error)
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data.message) {
                    return rejectWithValue(error.response.data.message)
                } else {
                    return rejectWithValue(error.message)
                }
            }
        }
    }
);

export const updatePost = createAsyncThunk(
    'post/updatePost',
    async ({id, content}: UpdatePostParams, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/posts/${id}`,
                {content}
            );
            return response.data;
        } catch (error: unknown) {
            // return custom error message from backend if present
            console.log(error)
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data.message) {
                    return rejectWithValue(error.response.data.message)
                } else {
                    return rejectWithValue(error.message)
                }
            }
        }
    }
);