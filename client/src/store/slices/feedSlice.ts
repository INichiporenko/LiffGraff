import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "../types/instanceTypes.ts";

export type PostFeedSync = Pick<Post, "_id" | "like_count" | "likes" | "isLiked">;

type FeedState = {
    postSync: Record<string, PostFeedSync>;
};

const initialState: FeedState = {
    postSync: {},
};

const feedSlice = createSlice({
    name: "feed",
    initialState,
    reducers: {
        syncPostInFeed: (state, action: PayloadAction<PostFeedSync>) => {
            state.postSync[action.payload._id] = action.payload;
        },
    },
});

export const { syncPostInFeed } = feedSlice.actions;

export const mergePostWithFeedSync = (post: Post, sync?: PostFeedSync): Post =>
    sync ? { ...post, ...sync, likes: sync.likes ?? post.likes } : post;

export const toPostFeedSync = (post: Post): PostFeedSync => ({
    _id: post._id,
    like_count: post.like_count,
    likes: post.likes ?? [],
    isLiked: post.isLiked,
});

export default feedSlice.reducer;
