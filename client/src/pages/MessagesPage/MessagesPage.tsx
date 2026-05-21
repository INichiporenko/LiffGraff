import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, Outlet, useParams} from "react-router";
import {AppDispatch, RootState} from "../../store/store.ts";
import {UserState} from "../../store/types/userTypes.ts";
import {Chat} from "../../store/types/instanceTypes.ts";
import {fetchUserChats} from "../../utils/apiCalls/chatApi.ts";
import {formatDate} from "../../utils/formatFunctions.ts";
import { setUnreadChatsCount } from "../../store/slices/messagesSlice.ts";

export const MessagesPage = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const user: UserState = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const { username } = useParams();

    const loadChats = async () => {
        const result = await fetchUserChats();
        if (!result) return;
        setChats(result);
        const chatsWithUnread = result.filter(
            (chat: Chat) => (chat.unreadCount ?? 0) > 0
        ).length;
        dispatch(setUnreadChatsCount(chatsWithUnread));
    };

    useEffect(() => {
        loadChats();
    }, [username, dispatch]);

    const clearChatUnreadInList = (chatId: string) => {
        setChats((prev) => {
            const updated = prev.map((chat) =>
                chat._id === chatId ? { ...chat, unreadCount: 0 } : chat
            );
            const chatsWithUnread = updated.filter(
                (c) => (c.unreadCount ?? 0) > 0
            ).length;
            dispatch(setUnreadChatsCount(chatsWithUnread));
            return updated;
        });
    };

    return (
        <div className="flex h-full">
            <div className={`${
                username ? "hidden" : "flex"
            } sm:flex lg:min-w-[398px] md:min-w-64 min-w-full md:border-r border-r-gray flex-col`}>
                <p className="font-semibold ml-4 lg:ml-6 mt-9 mb-14 text-xl">{user?.username}</p>
                <div className="flex flex-col">
                    {chats?.length > 0 && chats.map((chat: Chat) => {
                        const chatUsername =
                            chat?.user1?.username === user?.username ? chat?.user2.username : chat.user1.username;

                        const isActive = username === chatUsername;
                        const hasUnreadMessages = (chat.unreadCount ?? 0) > 0;
                        const showUnread = hasUnreadMessages && !isActive;

                        return (
                            <Link
                                to={`/messages/${chatUsername}`}
                                key={chat._id}
                                className={`flex items-center gap-3 py-2 px-4 lg:px-6 ${
                                    isActive ? "bg-gray" : showUnread ? "bg-lightblue" : ""
                                } hover:bg-lightgray`}
                            >
                                <img
                                    src={
                                        chat?.user1?.username === user?.username
                                            ? chat.user2.profile_image
                                            : chat.user1.profile_image
                                    }
                                    alt="profile_image"
                                    className="rounded-[50%] object-cover lg:w-14 lg:h-14
                                    w-8 h-8 shrink-0"
                                />
                                <div className="flex flex-col gap-1 min-w-0 flex-1">
                                    <p className={`text-sm ${showUnread ? "font-semibold" : ""}`}>
                                        {chatUsername}
                                    </p>
                                    {showUnread ? (
                                        <p className="text-xs font-semibold text-black">
                                            {chat.unreadCount === 1
                                                ? "1 new message"
                                                : `${chat.unreadCount} new messages`}
                                            {chat?.last_message?.createdAt && (
                                                <>
                                                    {" · "}
                                                    {formatDate(new Date(chat.last_message.createdAt))}
                                                </>
                                            )}
                                        </p>
                                    ) : chat?.last_message ? (
                                        <p className="text-xs text-darkgray">
                                            {chat.last_message.author?.username === user?.username
                                                ? "You"
                                                : chat.last_message.author?.username}{" "}
                                            sent a message.
                                            {chat.last_message.createdAt && (
                                                <>
                                                    {" · "}
                                                    {formatDate(new Date(chat.last_message.createdAt))}
                                                </>
                                            )}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-darkgray">No messages yet</p>
                                    )}
                                </div>
                                {showUnread && (
                                    <span
                                        className="w-2.5 h-2.5 rounded-full bg-blue shrink-0"
                                        aria-label="Unread messages"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
            <div className={`${username ? "flex" : "hidden"} sm:flex flex-1`}>
                <Outlet context={{ user, clearChatUnreadInList }} />
            </div>
        </div>
    );
}
