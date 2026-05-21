import {axiosInstance} from "./index.ts";
import {Post} from "../../store/types/instanceTypes.ts";

export type PostLikeApiResponse = {
    like?: { _id: string; user?: string };
    like_count: number;
    isLiked: boolean;
};

export const likePost = async (postId: string): Promise<PostLikeApiResponse> => {
    const response = await axiosInstance.post<PostLikeApiResponse>(
        `/posts/${postId}/like`,
        {}
    );
    return response.data;
};

export const unLikePost = async (postId: string): Promise<PostLikeApiResponse> => {
    const response = await axiosInstance.delete<PostLikeApiResponse>(
        `/posts/${postId}/unlike`
    );
    return response.data;
};

export const deletePost = async (postId: string) => {
    const response = await axiosInstance.delete(`/posts/${postId}`);
    return response.data;
};

export const fetchFollowedPosts = async (page: number) => {
    try {

        const response = await axiosInstance.get(
            `/posts/get_followed?page=${page}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching chat messages', error);
    }
};


export const getRandomPosts = async (fetchCount: number): Promise<Post[]> => {
    const response = await axiosInstance.get(`/posts/random?count=${fetchCount}`);
    return response.data;
};