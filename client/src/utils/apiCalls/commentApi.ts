import axios from "axios";
import { axiosInstance } from "./index.ts";
import { mapCommentFromApi } from "../mapComment.ts";
import { Comment } from "../../store/types/instanceTypes.ts";

export const addComment = async (content: string, postId: string): Promise<Comment> => {
    const trimmed = content.trim();
    if (!trimmed) {
        throw new Error("Comment cannot be empty");
    }

    try {
        const response = await axiosInstance.post(`/comments/${postId}/add`, {
            content: trimmed,
        });
        return mapCommentFromApi(response.data);
    } catch (error) {
        console.error("Error adding comment", error);
        if (axios.isAxiosError(error)) {
            const message =
                typeof error.response?.data === "string"
                    ? error.response.data
                    : error.response?.data?.message;
            throw new Error(message || "Could not add comment");
        }
        throw error;
    }
};

export const likeComment = async (commentId: string) => {
    try {

        const response = await axiosInstance.post(
            `/comments/${commentId}/like`,
            {}
        );
        return response.data;
    } catch (error) {
        console.error('Error liking comment', error);
    }
};

export const unLikeComment = async (commentId: string) => {
    try {

        const response = await axiosInstance.delete(
            `/comments/${commentId}/unlike`
        );
        return response.data;
    } catch (error) {
        console.error('Error unliking comment', error);
    }
};

export const deleteComment = async (commentId: string) => {
    const response = await axiosInstance.delete(`/comments/${commentId}`);
    return response.data as { commentId: string; postId: string };
};