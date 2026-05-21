import {ChangeEvent, KeyboardEventHandler, useEffect, useRef, useState} from "react";
import {Link, useOutletContext, useParams} from "react-router";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import Picker, {EmojiClickData} from "emoji-picker-react";
import smiley from "../../assets/smiley.png";
import {CondensedUser, Message} from "../../store/types/instanceTypes.ts";
import {UserState} from "../../store/types/userTypes.ts";
import {fetchChat} from "../../utils/apiCalls/chatApi.ts";
import {formatMessageTime} from "../../utils/formatFunctions.ts";
import { AppDispatch } from "../../store/store.ts";
import { clearChatUnread, setUnreadChatsCount } from "../../store/slices/messagesSlice.ts";
import { socketURL } from "../../utils/apiCalls/index.ts";

const TEN_MINUTES = 10 * 60 * 1000;

const socket = io(socketURL, {
    autoConnect: true, // Allow automatic connection
    reconnection: true, // Enable reconnection
    reconnectionAttempts: 5, // Limit the number of reconnection attempts
    reconnectionDelay: 1000, // Delay between attempts in ms,
    withCredentials: true,
    transports: ["websocket"],
});

type OutletContextType = {
    user: UserState;
    clearChatUnreadInList?: (chatId: string) => void;
};

export const MessagesMain = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, clearChatUnreadInList } = useOutletContext<OutletContextType>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [receiver, setReceiver] = useState<CondensedUser | null>(null);
    const [chatId, setChatId] = useState<string>('');
    const {username} = useParams();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect((): void => {
        const getMessages = async () => {
            if (!username) return;

            try {
                const result = await fetchChat(username);
                setMessages(result.messages ?? []);

                const otherUser =
                    result.user1._id === user._id ? result.user2 : result.user1;
                setReceiver(otherUser);
                setChatId(result._id);

                dispatch(clearChatUnread(result._id));
                clearChatUnreadInList?.(result._id);
                if (typeof result.unreadChatsCount === "number") {
                    dispatch(setUnreadChatsCount(result.unreadChatsCount));
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        getMessages();
    }, [username, user._id, dispatch]);


    useEffect(() => {

        if (chatId) {
            // Join the chat room
            socket.emit("joinRoom", chatId);
        }

        // Listen for new messages
        socket.on("receiveMessage", (message: Message) => {
            const authorId =
                typeof message.author === "object"
                    ? message.author._id
                    : message.author;
            const receiverId =
                typeof message.receiver === "object"
                    ? message.receiver._id
                    : message.receiver;

            setMessages((prev) => [...prev, message]);

            if (receiverId === user._id && authorId !== user._id && chatId) {
                socket.emit("markChatRead", { chatId, userId: user._id });
                clearChatUnreadInList?.(chatId);
            }
        });

        // Cleanup on component unmount or when chatId changes
        return () => {
            if (chatId) {
                socket.emit("leaveRoom", chatId);
            }
            socket.off("receiveMessage");
        };
    }, [chatId]);

    const onInputKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === "Enter") {
            if (!receiver || !newMessage.trim()) return;
            socket.emit("sendMessage", {
                authorId: user._id,
                receiverId: receiver._id,
                content: newMessage.trim(),
            });
            if (chatId) {
                socket.emit("markChatRead", { chatId, userId: user._id });
                clearChatUnreadInList?.(chatId);
            }
            setNewMessage("");
            setShowEmojiPicker(false);
        }
    };

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setNewMessage((prev) => prev + emojiData.emoji);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView();
    }, [messages]);


    if (!user) return <p>Loading...</p>;

    return (<div className="w-full">
        <div className="border-b border-b-gray p-4 w-full">
            <Link
                to={`/profile/${receiver?.username}`}
                className="flex items-center gap-3 w-fit"
            >
                <img src={receiver?.profile_image} alt={receiver?.username}
                     className="w-11 h-11 object-cover rounded-[50%]" />
                <p className="font-semibold">{receiver?.username}</p>
            </Link>
        </div>
        <div className="h-[72vh] md:h-[56vh] overflow-y-scroll">
            <div className="flex flex-col items-center mt-16 mb-20">
                <Link to={`/profile/${username}`}>
                    <img src={receiver?.profile_image} alt={receiver?.username}
                         className="w-24 h-24 object-cover mb-4 rounded-[50%]"/>
                </Link>
                <Link to={`/profile/${username}`}>
                    <p className="font-semibold text-xl mb-4">{receiver?.username}</p>
                </Link>
                <Link to={`/profile/${username}`}
                      className="bg-gray text-sm py-2 w-[173px] rounded-lg text-center">
                    View profile</Link>
            </div>
            <div className="px-3.5 text-xs">
                {messages?.map((message: Message, index: number) => {
                    const prevMessage = messages[index - 1];
                    const showTime =
                        !prevMessage ||
                        new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() > TEN_MINUTES;
                    return (<div key={message._id}>
                            {showTime && (
                                <div className="flex justify-center my-2">
                                <span className="text-darkgray">
                                    {formatMessageTime(message.createdAt)}
                                </span>
                                </div>
                            )}
                        <div className="flex justify-start">
                            {message.author.username === user?.username ? (<>
                                <div
                                    className="flex gap-4 mb-2 py-5 px-4 bg-purple text-white
                                     w-60 lg:w-[397px] rounded-2xl ml-auto">
                                    <p>{message.content}</p>
                                </div>
                                <img src={user?.profile_image} alt={user?.username}
                                     className="w-7 h-7 object-cover rounded-[50%] ml-2"/>
                            </>) : (<>
                                <img src={message.author.profile_image} alt={user?.username}
                                     className="w-7 h-7 object-cover rounded-[50%] mr-2"/>
                                <div className="flex gap-4 mb-2 py-5 px-4 bg-gray
                                w-60 lg:w-[397px] rounded-2xl">
                                    <p>{message.content}</p>
                                </div>
                            </>)}
                        </div>
                    </div>
                    )
                })}
                {/* Invisible div to act as scroll anchor */}
                <div ref={messagesEndRef}></div>
            </div>
        </div>
        <div className="relative mx-3.5 my-6 flex items-center gap-3">
            <img
                src={smiley}
                alt="Emoji"
                className="w-6 h-6 shrink-0 cursor-pointer"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
            />
            {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 z-20">
                    <Picker
                        width={300}
                        height={300}
                        searchDisabled
                        onEmojiClick={onEmojiClick}
                    />
                </div>
            )}
            <input
                className="flex-1 px-6 py-3 rounded-3xl border border-gray text-sm outline-none"
                placeholder="Write message"
                value={newMessage}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                onKeyDown={onInputKeyDown}
                onFocus={() => setShowEmojiPicker(false)}
            />
        </div>
    </div>);
};