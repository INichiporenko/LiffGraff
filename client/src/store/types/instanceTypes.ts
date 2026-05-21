export type CondensedUser = {
    _id: string;
    profile_image: string;
    username: string;
}

export type CondensedPost = {
    _id: string;
    photos: string[];
}

export type Message = {
    _id: string;
    content: string;
    author: CondensedUser;
    receiver: CondensedUser | string;
    createdAt: string;
    read?: boolean;
}

export type Chat = {
    _id: string;
    user1: CondensedUser;
    user2: CondensedUser;
    messages: Message[];
    last_message: Message;
    unreadCount?: number;
    unreadChatsCount?: number;
}

export type Notification = {
    _id: string,
    user: string,
    actionMaker: CondensedUser,
    post?: Post,
    comment?: { post: Post },
    createdAt: string,
    type: "liked your post" | "liked your comment" | "commented on your post" | "started following you"
}

export type Comment = {
    _id: string;
    author: CondensedUser;
    content: string;
    postId: string;
    post?: Post;
    createdAt: Date;
    like_count: number;
    likes: LikesFields[];
}

type PhotosFields = {
    _id: string,
    url: string,
}

export type LikesFields = {
    _id: string;
    user?: string | { _id: string };
    userId?: string;
}

export type Post = {
    _id: string;
    author: CondensedUser;
    photos: PhotosFields[];
    content: string;
    createdAt: Date | null;
    like_count: number;
    likes: LikesFields[];
    comments: Comment[];
    isLiked?: boolean;
}

export type User = {
    _id: string,
    username: string,
    email: string,
    full_name: string,
    profile_image: string,
    bio: string,
    website?: string,
    posts: Post[],
    notifications: Notification[],
    followers: CondensedUser[],
    followings: CondensedUser[],
    search_results: CondensedUser[],
}