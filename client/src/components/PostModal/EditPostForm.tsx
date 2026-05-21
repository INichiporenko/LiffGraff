import {Dispatch, SetStateAction, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import Picker, {EmojiClickData} from "emoji-picker-react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store/store.ts";
import smiley from "../../assets/smiley.png";
import {updatePost} from "../../store/actionCreators/postActionCreators.ts";
import {Post} from "../../store/types/instanceTypes.ts";

type EditPostFormProps = {
    postContent: string | undefined;
    postId: string | undefined;
    setPostType: Dispatch<SetStateAction<'preview' | 'edit'>>;
    setPost: Dispatch<SetStateAction<Post | null>>;
}

export const EditPostForm = ({postContent, postId, setPostType, setPost}: EditPostFormProps) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    type EditPostInputs = {
        content: string;
    }

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<EditPostInputs>();

    const onEditPost: SubmitHandler<EditPostInputs> = async (data: EditPostInputs) => {
        if (!postId) return;
        await dispatch(updatePost({id: postId, content: data.content })).unwrap();
        setPost((prevPost) => {
            if (!prevPost) return null;

            return {
                ...prevPost,
                content: data.content,
            };
        });
        setPostType('preview');
    };

    // Handle emoji click
    const onEmojiClick = (emojiData: EmojiClickData) => {
        const currentContent = watch("content") || ""; // Get current content value
        const newContent = currentContent + emojiData.emoji; // Append emoji to content
        setValue("content", newContent); // Update content using setValue
    };

    return (
        <form
            onSubmit={handleSubmit(onEditPost)}
            className="flex flex-col gap-4 p-5">
            {errors.content && <p className="pl-3.5 pt-2 text-xs text-error">
                The comment should be less than 2200
                characters</p>}
            <textarea
                defaultValue={postContent}
                {...register('content', {required: true, maxLength: 2200})}
                className="py-2.5 outline-0 min-h-[240px]
                border-b border-b-gray"/>
            <div className="flex gap-4 justify-end items-center">
                <img src={smiley}
                     alt="Emoji"
                     className="w-6 h-6 cursor-pointer mr-auto"
                     onClick={() => setShowEmojiPicker(!showEmojiPicker)}/>
                {showEmojiPicker && (
                    <div className="absolute bottom-28 md:bottom-0 z-10
                                -right-50 md:right-72 lg:right-[420px]">
                        <Picker onEmojiClick={onEmojiClick} />
                    </div>
                )}
                <button className="text-darkgray"
                    onClick={() => setPostType('preview')}>Go back</button>
                <input type="submit" value="Edit"
                        className="bg-blue text-white rounded py-1 px-5 cursor-pointer"/>
            </div>
        </form>
    )
}