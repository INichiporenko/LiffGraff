import {PostState} from "../types/postTypes.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createPost, fetchPost, updatePost} from "../actionCreators/postActionCreators.ts";
import {Post} from "../types/instanceTypes.ts";

const initialState: PostState = {
        status: 'IDLE',
        error: null,
        _id: '',
        author: null,
        photos: [],
        content: '',
        createdAt: null,
        like_count: 0,
        likes: [],
        isLiked: false,
        comments: [],
};

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(createPost.pending, (state) => {
            state.status = 'LOADING';
            state.error = null;
        }).addCase(createPost.fulfilled, (state) => {
            state.status = 'CREATED';
            state.error = null;
        }).addCase(createPost.rejected, (state, action) => {
            state.status = 'FAILED';
            console.log(action);
            state.error = action.error.message || "Post creation failed";
        }).addCase(fetchPost.pending, (state) => {
            state.status = 'LOADING';
            state.error = null;
        }).addCase(fetchPost.fulfilled, (state, action) => {
            state.status = 'FETCHED';
            state.error = null;
            state._id = action.payload._id;
            state.author = action.payload.author;
            state.photos = action.payload.photos;
            state.content = action.payload.content;
            state.createdAt = action.payload.createdAt;
            state.like_count = action.payload.like_count;
            state.likes = action.payload.likes;
            state.isLiked = action.payload.isLiked ?? false;
            state.comments = action.payload.comments;
        }).addCase(fetchPost.rejected, (state, action) => {
            state.status = 'FAILED';
            console.log(action);
            state.error = action.error.message || "Post fetch failed";
        }).addCase(updatePost.pending, (state) => {
            state.status = 'LOADING';
            state.error = null;
        }).addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
            state.status = 'UPDATED';
            state.error = null;
            state.content = action.payload.content;
        }).addCase(updatePost.rejected, (state, action) => {
            state.status = 'FAILED';
            console.log(action);
            state.error = action.error.message || "Post creation failed";
        })
    }
});

export default postSlice.reducer;