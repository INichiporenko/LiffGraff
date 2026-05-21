import {axiosInstance} from "./index.ts";

export const fetchProfile = async (username: string, ) => {
    try {

        const response = await axiosInstance.get(
            `/users/${username}`
        );
        return response.data[0];
    } catch (error) {
        console.error('Error liking post', error);
    }
};

export const followUser = async (username: string) => {
    try {

        const response = await axiosInstance.post(
            `/users/${username}/follow`,
            {}
        );
        return response.data;
    } catch (error) {
        console.error('Error liking post', error);
    }
};

export const unfollowUser = async (username: string) => {
    try {

        const response = await axiosInstance.delete(
            `/users/${username}/unfollow`
        );
        return response.data;
    } catch (error) {
        console.error('Error liking post', error);
    }
};

export const getAllUsersForSearch = async () => {
    try {
        const response = await axiosInstance.get(
            `/users`
        );
        return response.data;
    } catch (error) {
        console.error('Error getting users', error);
    }
};

export const addUserToSearchResults = async(username: string) => {
    try {
        const response = await axiosInstance.post(
            "/users/add_to_search_results",
            {username}
        );
        return response.data;
    } catch (error) {
        console.error('Error adding user to search results', error);
    }
};