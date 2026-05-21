import { Request, Response } from "express";
import User, {UserType} from "../db/models/User";
import Chat from "../db/models/Chat";
import {
    getChatUnreadCount,
    getUnreadChatsCount,
    markChatAsRead,
} from "../utils/messageUtils";

export const getChatByReceiverUsername  = async (req: Request, res: Response) => {
    try {
        const {receiverUsername} = req.body;
        if (!receiverUsername || !req.user) {
            res.status(400).send('Receiver and sender must be provided');
            return;
        }
        const receiver: UserType | null = await User.findOne({username: receiverUsername});
        if (!receiver) {
            res.status(404).send('User is not found');
            return;
        }

        let chat = await Chat.findOne({
            $or: [
                { user1: req.user.id, user2: receiver._id },
                { user1: receiver._id, user2: req.user.id }
            ]
        }).populate({
            path: 'messages',
            select: 'content createdAt read author receiver',
            populate: [{
                path: 'author',
                select: 'profile_image username'
            }, {
                path: 'receiver',
                select: 'profile_image username _id'
            }]
        }).populate({
            path: 'user1',
            select: 'profile_image username _id'
        }).populate({
            path: 'user2',
            select: 'profile_image username _id'
        });

        if (!chat) {
            chat = new Chat({
                user1: req.user.id,
                user2: receiver._id,
            });
            await chat.save();
            await chat.populate({
                path: 'messages',
                select: 'content createdAt read author receiver',
                populate: [{
                    path: 'author',
                    select: 'profile_image username'
                }, {
                    path: 'receiver',
                    select: 'profile_image username _id'
                }]
            });
            await chat.populate({
                path: 'user1',
                select: 'profile_image username _id'
            });
            await chat.populate({
                path: 'user2',
                select: 'profile_image username _id'
            });
        } else {
            await markChatAsRead(chat._id, req.user.id);
        }

        const unreadChatsCount = await getUnreadChatsCount(req.user.id);

        res.status(200).json({
            ...chat.toObject(),
            unreadCount: 0,
            unreadChatsCount,
        });
    } catch (error) {
        console.error('Error getting chat: ', error);
        res.status(500).send('Error getting chat');
    }
};

export const getUserChats = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(404).send('User not found');
            return;
        }
        const chats = await Chat.find({
            $or: [
                { user1: req.user.id },
                {user2: req.user.id}
            ]
        }).populate({
            path: 'user1',
            select: 'profile_image username _id'
        }).populate({
            path: 'user2',
            select: 'profile_image username _id'
        }).populate({
            path: 'last_message',
            populate: {
                path: 'author',
                select: 'username profile_image'
            }
        });

        const chatsWithUnread = await Promise.all(
            chats.map(async (chat) => {
                const unreadCount = await getChatUnreadCount(chat._id, req.user!.id);
                return {
                    ...chat.toObject(),
                    unreadCount,
                };
            })
        );

        res.status(200).send(chatsWithUnread);
    } catch (error) {
        console.error('Error getting user chats: ', error);
        res.status(500).send('Error getting user chats');
    }
};

export const getUnreadMessagesCount = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).send('User is not authorized');
            return;
        }
        const unreadChatsCount = await getUnreadChatsCount(req.user.id);
        res.status(200).json({ unreadChatsCount });
    } catch (error) {
        console.error('Error getting unread messages count: ', error);
        res.status(500).send('Error getting unread messages count');
    }
};
