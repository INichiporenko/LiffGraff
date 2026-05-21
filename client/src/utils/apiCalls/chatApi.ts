import {axiosInstance} from "./index.ts";

export const fetchChat = async (receiverUsername: string) => {
    try {

        const response = await axiosInstance.post(
            `/messages/get_chat`,
            {receiverUsername}
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching chat messages', error);
    }
};

export const fetchUserChats = async () => {
    try {

        const response = await axiosInstance.get(
            `/messages/get_user_chats`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching chat messages', error);
    }
};

export const fetchUnreadChatsCount = async (): Promise<number> => {
    const response = await axiosInstance.get<{ unreadChatsCount: number }>(
        `/messages/unread_count`
    );
    return response.data.unreadChatsCount;
};