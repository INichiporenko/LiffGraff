import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { AppDispatch, RootState } from "../store/store.ts";
import {
    applyUnreadUpdate,
    setUnreadChatsCount,
} from "../store/slices/messagesSlice.ts";
import { fetchUnreadChatsCount } from "./apiCalls/chatApi.ts";
import { socketURL } from "./apiCalls/index.ts";

const socket = io(socketURL, {
    autoConnect: true,
    reconnection: true,
    withCredentials: true,
    transports: ["websocket"],
});

export const useMessagesUnread = () => {
    const dispatch = useDispatch<AppDispatch>();
    const userId = useSelector((state: RootState) => state.user._id);
    const unreadChatsCount = useSelector(
        (state: RootState) => state.messages.unreadChatsCount
    );

    useEffect(() => {
        if (!userId) return;

        const loadUnread = async () => {
            try {
                const count = await fetchUnreadChatsCount();
                dispatch(setUnreadChatsCount(count));
            } catch (error) {
                console.error("Error fetching unread chats:", error);
            }
        };

        loadUnread();
        socket.emit("joinUser", userId);

        const onUnreadUpdate = (payload: {
            unreadChatsCount: number;
            chatId?: string;
            chatUnread?: number;
        }) => {
            dispatch(applyUnreadUpdate(payload));
        };

        socket.on("unreadUpdate", onUnreadUpdate);

        return () => {
            socket.off("unreadUpdate", onUnreadUpdate);
        };
    }, [userId, dispatch]);

    return unreadChatsCount;
};
