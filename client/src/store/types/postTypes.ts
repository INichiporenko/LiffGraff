import {Comment, LikesFields} from "./instanceTypes.ts";

type PostUserFields = {
    _id: string;
    profile_image: string;
    username: string;
    followers: string[];
}

export type PostState = {
    status: string,
    error: string | null,
    _id: string,
    author: PostUserFields | null,
    photos: string[],
    content: string,
    createdAt: Date | null,
    like_count: number,
    likes: LikesFields[],
    isLiked?: boolean,
    comments: Comment[],
}

export type CreatePost = {
    photos: File[],
    content: string,
}

export type FetchPostParams = {
    id: string,
}

export type UpdatePostParams = {
    id: string,
    content: string,
}