import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type MessagesState = {
    /** Number of chats with unread messages (not message count). */
    unreadChatsCount: number;
    chatUnread: Record<string, number>;
};

const initialState: MessagesState = {
    unreadChatsCount: 0,
    chatUnread: {},
};

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setUnreadChatsCount: (state, action: PayloadAction<number>) => {
            state.unreadChatsCount = action.payload;
        },
        setChatUnread: (
            state,
            action: PayloadAction<{ chatId: string; count: number }>
        ) => {
            state.chatUnread[action.payload.chatId] = action.payload.count;
        },
        applyUnreadUpdate: (
            state,
            action: PayloadAction<{
                unreadChatsCount: number;
                chatId?: string;
                chatUnread?: number;
            }>
        ) => {
            state.unreadChatsCount = action.payload.unreadChatsCount;
            if (action.payload.chatId !== undefined && action.payload.chatUnread !== undefined) {
                state.chatUnread[action.payload.chatId] = action.payload.chatUnread;
            }
        },
        clearChatUnread: (state, action: PayloadAction<string>) => {
            const hadUnread = (state.chatUnread[action.payload] ?? 0) > 0;
            state.chatUnread[action.payload] = 0;
            if (hadUnread) {
                state.unreadChatsCount = Math.max(0, state.unreadChatsCount - 1);
            }
        },
    },
});

export const {
    setUnreadChatsCount,
    setChatUnread,
    applyUnreadUpdate,
    clearChatUnread,
} = messagesSlice.actions;

export default messagesSlice.reducer;
