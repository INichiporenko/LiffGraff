import {Dispatch, RefObject, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import Picker, {EmojiClickData} from "emoji-picker-react";
import {Link} from "react-router";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";
import more from "../../assets/more.svg";
import liked from "../../assets/reactions/liked.svg";
import like from "../../assets/reactions/like.svg";
import comment from "../../assets/reactions/comment.svg";
import trash from "../../assets/reactions/trash.svg";
import smiley from "../../assets/smiley.png";
import {Comment, Post} from "../../store/types/instanceTypes.ts";
import {onLikeComment, onLikePost, PostLikeSyncHandler} from "../../utils/likeFunctions.ts";
import {addComment, deleteComment} from "../../utils/apiCalls/commentApi.ts";
import {formatDate} from "../../utils/formatFunctions.ts";
import {isLikedByUser, isPostLikedByUser} from "../../utils/likeFunctions.ts";

type PostMainProps = {
    post: Post | null;
    setPost: Dispatch<SetStateAction<Post | null>>;
    moreRef: RefObject<HTMLDivElement>;
    onPostLikeSync?: PostLikeSyncHandler;
}

export const PostMain = ({post, setPost, moreRef, onPostLikeSync}: PostMainProps) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [commentError, setCommentError] = useState<string | null>(null);
    const userId = useSelector((state: RootState) => state.user._id);

    type CommentFormInputs = {
        content: string
    };
    const commentTextareaRef = useRef<HTMLTextAreaElement | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        setFocus,
        formState: { errors },
    } = useForm<CommentFormInputs>({mode: "onChange"});

    const commentContent = watch("content");

    const adjustCommentTextareaHeight = useCallback(() => {
        const textarea = commentTextareaRef.current;
        if (!textarea) return;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
    }, []);

    useEffect(() => {
        adjustCommentTextareaHeight();
    }, [commentContent, adjustCommentTextareaHeight]);

    const { ref: commentRef, ...commentField } = register("content", {
        required: true,
        maxLength: 120,
    });

    // Handle emoji click
    const onEmojiClick = (emojiData: EmojiClickData) => {
        const currentContent = watch("content") || "";
        const newContent = currentContent + emojiData.emoji;
        setValue("content", newContent, { shouldValidate: true });
    };

    const canDeleteComment = (commentItem: Comment): boolean => {
        if (!userId || !post) return false;
        const isAuthor = commentItem.author._id === userId;
        const isPostOwner = post.author._id === userId;
        return isAuthor || isPostOwner;
    };

    const onDeleteComment = async (commentId: string) => {
        if (!post) return;
        try {
            await deleteComment(commentId);
            setPost({
                ...post,
                comments: post.comments.filter((c) => c._id !== commentId),
            });
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const onComment: SubmitHandler<CommentFormInputs> = async (data: CommentFormInputs) => {
        if (!post) return;

        const trimmed = data.content.trim();
        if (!trimmed) {
            setCommentError("Comment cannot be empty");
            return;
        }

        setCommentError(null);

        try {
            const newComment = await addComment(trimmed, post._id);
            setPost((prev) =>
                prev
                    ? {
                          ...prev,
                          comments: [...(prev.comments ?? []), newComment],
                      }
                    : prev
            );
            reset();
            requestAnimationFrame(adjustCommentTextareaHeight);
        } catch (e) {
            console.error("Could not upload comment", e);
            setCommentError(
                e instanceof Error ? e.message : "Could not upload comment"
            );
        }
    };

    return (
        <div className="flex flex-col h-full min-h-0 overflow-x-hidden">
            <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
            <div className="hidden md:flex justify-between border-b border-b-gray shrink-0">
                <Link
                    to={`/profile/${post?.author?.username}`}
                >
                    <div className="flex items-center gap-3 mx-3.5 my-4 text-xs">
                        <img
                            src={post?.author?.profile_image}
                            alt="Profile image"
                            className="w-6 h-6 rounded-[50%] border border-gray object-cover"
                        />
                        <span className="font-semibold">{post?.author?.username}</span>
                    </div>
                </Link>
                {post?.author?._id === userId ? (
                    <img
                        src={more}
                        alt="More"
                        className="w-6 mr-2 cursor-pointer"
                        onClick={() => {
                            if (moreRef.current) {
                                moreRef.current.hidden = false;
                            }
                        }}
                    />
                ) : (
                    <button
                        className="text-xs"
                        onClick={() => {
                            if (moreRef.current) {
                                moreRef.current.hidden = false;
                            }
                        }}
                    >
                        ...
                    </button>
                )}
            </div>
            <div className="flex gap-3 mx-3.5 my-3 text-xs min-w-0">
                <Link
                    to={`/profile/${post?.author?.username}`}
                    className="shrink-0"
                >
                    <img
                        src={post?.author?.profile_image}
                        alt="Profile image"
                        className="min-w-6 max-w-6 h-6 object-cover rounded-[50%] border border-gray"
                    />
                </Link>
                <div className="flex-col min-w-0 flex-1">
                    <p className="break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
                        <Link
                            to={`/profile/${post?.author?.username}`}
                        >
                            <span className="font-semibold">{post?.author?.username}</span>
                        </Link>
                        <span>   </span>
                        {post?.content}
                    </p>
                    {post?.createdAt && <p className="text-darkgray text-[11px] mt-2">
                        {formatDate(new Date(post?.createdAt))}</p>}
                </div>
            </div>
            <div className="flex flex-col mb-3.5 px-3.5 text-xs gap-5 min-w-0">
                {post?.comments && post?.comments.length > 0 && (
                    post?.comments.map((comment) => (
                        <div key={comment._id} className="flex justify-between gap-2 min-w-0">
                            <div className="flex gap-3 min-w-0 flex-1">
                                <Link to={`/profile/${comment.author.username}`} className="shrink-0">
                                    <img src={comment.author.profile_image}
                                         alt={comment.author.username}
                                         className="min-w-6 h-6 rounded-[50%] border border-gray object-cover"/>
                                </Link>
                                <div className="min-w-0 flex-1">
                                    <Link to={`/profile/${comment.author.username}`}>
                                        <p className="font-semibold">{comment.author.username}</p>
                                    </Link>
                                    <p className="break-words [overflow-wrap:anywhere] whitespace-pre-wrap">{comment.content}</p>
                                    <div className="flex text-darkgray text-[11px]">
                                        {comment?.createdAt && <p className="mr-5">
                                            {formatDate(new Date(comment?.createdAt))}</p>}
                                        <p>Likes: {comment?.like_count}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 shrink-0 mt-0.5">
                                <img src={userId && isLikedByUser(comment?.likes, userId)
                                    ? liked : like} alt={comment._id}
                                     className="w-2.5 h-2.5 cursor-pointer"
                                     onClick={(e) => userId && onLikeComment(e, comment._id, post, userId, setPost)}/>
                                {canDeleteComment(comment) && (
                                    <img
                                        src={trash}
                                        alt="Delete comment"
                                        className="w-2.5 h-2.5 cursor-pointer"
                                        onClick={() => onDeleteComment(comment._id)}
                                    />
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
            </div>
            <div className="bg-white w-full shrink-0 border-t border-gray relative">
                <div className="pl-3.5 mb-3 mt-2">
                    <div className="flex gap-3 mb-2">
                        <img src={userId && post && isPostLikedByUser(post, userId) ? liked : like}
                             alt='like'
                             className="w-6 h-6 cursor-pointer"
                             onClick={(e) => {
                                 if (post?._id && userId) {
                                     onLikePost(e, post._id, post, userId, setPost, onPostLikeSync);
                                 }
                             }}/>
                        <img src={comment}
                             alt="comment"
                             className="cursor-pointer"
                             onClick={() => setFocus('content')}/>
                    </div>
                    <p className="text-xs font-semibold">{post?.like_count} likes</p>
                    {post?.createdAt && <p className="text-darkgray text-[11px] mt-2">
                        {formatDate(new Date(post?.createdAt))}</p>}
                </div>
                <div>
                    {errors.content && <p className="pl-3.5 pt-2 text-xs text-error">
                        The comment should be less than 120 characters</p>}
                    {commentError && <p className="pl-3.5 pt-2 text-xs text-error">{commentError}</p>}
                    <form className="flex items-end justify-between pl-3.5 py-2 bg-white w-full gap-2"
                          onSubmit={handleSubmit(onComment)}>
                        <div className="flex items-end gap-4 w-full mr-2 min-w-0">
                            <img src={smiley}
                                 alt="Emoji"
                                 className="w-6 h-6 shrink-0 cursor-pointer mb-2"
                                 onClick={() => setShowEmojiPicker(!showEmojiPicker)}/>
                            {showEmojiPicker && (
                                <div className="absolute bottom-14">
                                    <Picker width={300}
                                            height={300}
                                            searchDisabled={true}
                                            onEmojiClick={onEmojiClick}/>
                                </div>
                            )}
                            <textarea
                                {...commentField}
                                ref={(element) => {
                                    commentRef(element);
                                    commentTextareaRef.current = element;
                                }}
                                rows={1}
                                placeholder="Add comment"
                                onInput={adjustCommentTextareaHeight}
                                className="placeholder:text-xs p-2.5 w-full min-h-[40px]
                                resize-none overflow-hidden leading-normal break-words outline-none
                                bg-lightgray rounded-lg border border-gray"
                            />
                        </div>
                        <button type="submit"
                                className="text-blue text-xs font-semibold pr-4 lg:pr-6 shrink-0 mb-2">Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};