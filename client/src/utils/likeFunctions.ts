import { Dispatch, MouseEvent } from "react";
import { likePost, PostLikeApiResponse, unLikePost } from "./apiCalls/postApi.ts";
import { unLikeComment, likeComment } from "./apiCalls/commentApi.ts";
import { Comment, LikesFields, Post } from "../store/types/instanceTypes.ts";

const likingPosts = new Set<string>();
const likingComments = new Set<string>();

export const normalizeLikeUserId = (like: LikesFields): string => {
    const user = like.userId ?? like.user;
    if (!user) return "";
    if (typeof user === "string") return user;
    if (typeof user === "object" && "_id" in user) {
        return String(user._id);
    }
    return String(user);
};

export const isLikedByUser = (likedBy: LikesFields[] | undefined, userId: string): boolean => {
    if (!userId || !likedBy?.length) return false;
    return likedBy.some((like) => normalizeLikeUserId(like) === userId);
};

export const isPostLikedByUser = (post: Post, userId: string): boolean => {
    if (typeof post.isLiked === "boolean") return post.isLiked;
    return isLikedByUser(post.likes, userId);
};

const dedupeLikesForUser = (likes: LikesFields[], userId: string): LikesFields[] => {
    const filtered = likes.filter((like) => normalizeLikeUserId(like) !== userId);
    return filtered;
};

export const applyPostLikeApiResponse = (
    post: Post,
    userId: string,
    data: PostLikeApiResponse
): Post => {
    const currentLikes = post.likes ?? [];

    if (data.isLiked) {
        const withoutUser = dedupeLikesForUser(currentLikes, userId);
        return {
            ...post,
            isLiked: true,
            like_count: data.like_count,
            likes: [
                ...withoutUser,
                {
                    _id: data.like?._id ?? `local-${Date.now()}`,
                    userId,
                },
            ],
        };
    }

    return {
        ...post,
        isLiked: false,
        like_count: data.like_count,
        likes: dedupeLikesForUser(currentLikes, userId),
    };
};

const addLikeToComment = (comment: Comment, userId: string, likeId?: string): Comment => {
    const withoutUser = (comment.likes ?? []).filter(
        (like) => normalizeLikeUserId(like) !== userId
    );
    return {
        ...comment,
        like_count: comment.like_count + 1,
        likes: [...withoutUser, { _id: likeId ?? `local-${Date.now()}`, userId }],
    };
};

const removeLikeFromComment = (comment: Comment, userId: string): Comment => ({
    ...comment,
    like_count: Math.max(0, comment.like_count - 1),
    likes: (comment.likes ?? []).filter((like) => normalizeLikeUserId(like) !== userId),
});

export const onLikeComment = async (
    e: MouseEvent<HTMLImageElement>,
    commentId: string,
    post: Post | null,
    userId: string,
    setPost: Dispatch<React.SetStateAction<Post | null>>
) => {
    e.preventDefault();
    if (!post || !userId || likingComments.has(commentId)) return;

    const comment = post.comments.find((c) => c._id === commentId);
    if (!comment) return;

    const alreadyLiked = isLikedByUser(comment.likes, userId);
    likingComments.add(commentId);

    try {
        if (!alreadyLiked) {
            await likeComment(commentId);
            setPost({
                ...post,
                comments: post.comments.map((c) =>
                    c._id === commentId ? addLikeToComment(c, userId) : c
                ),
            });
        } else {
            await unLikeComment(commentId);
            setPost({
                ...post,
                comments: post.comments.map((c) =>
                    c._id === commentId ? removeLikeFromComment(c, userId) : c
                ),
            });
        }
    } catch (error) {
        console.error("Error toggling comment like:", error);
    } finally {
        likingComments.delete(commentId);
    }
};

const togglePostLike = async (
    postId: string,
    post: Post,
    userId: string
): Promise<Post> => {
    const alreadyLiked = isPostLikedByUser(post, userId);
    const data = alreadyLiked ? await unLikePost(postId) : await likePost(postId);
    return applyPostLikeApiResponse(post, userId, data);
};

export type PostLikeSyncHandler = (post: Post) => void;

export const onLikePost = async (
    e: MouseEvent<HTMLImageElement>,
    postId: string,
    post: Post | null,
    userId: string,
    setPost: Dispatch<React.SetStateAction<Post | null>>,
    onSync?: PostLikeSyncHandler
) => {
    e.preventDefault();
    if (!post || !userId || likingPosts.has(postId)) return;

    likingPosts.add(postId);
    try {
        const updated = await togglePostLike(postId, post, userId);
        setPost(updated);
        onSync?.(updated);
    } catch (error) {
        console.error("Error toggling post like:", error);
    } finally {
        likingPosts.delete(postId);
    }
};

export const onLikePostFromHomepage = async (
    e: MouseEvent<HTMLImageElement>,
    post: Post,
    userId: string,
    setPosts: Dispatch<React.SetStateAction<Post[]>>,
    onSync?: PostLikeSyncHandler
) => {
    e.preventDefault();
    if (!userId || likingPosts.has(post._id)) return;

    likingPosts.add(post._id);
    try {
        const updated = await togglePostLike(post._id, post, userId);
        setPosts((prev) =>
            prev.map((p) => (p._id === post._id ? updated : p))
        );
        onSync?.(updated);
    } catch (error) {
        console.error("Error toggling post like:", error);
    } finally {
        likingPosts.delete(post._id);
    }
};
