import {RootState} from "../store.ts";
import {createSelector} from "@reduxjs/toolkit";

const getFollowings = (state: RootState) => state.user.followings;

export const selectIfFollowing = createSelector(
    [getFollowings, (_: RootState, userId: string) => userId],
    (followings, userId) => {
        let isFollowing = false;
        followings.forEach(following => {
            if (following._id === userId) {
                isFollowing = true;
            }
        })
        return isFollowing;
    }
);