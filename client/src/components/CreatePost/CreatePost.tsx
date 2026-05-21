import {MouseEvent} from "react";
import {Link} from "react-router";
import Picker from "emoji-picker-react";
import upload from '../../assets/upload.png';
import arrow_back from '../../assets/arrow_back.svg';
import smiley from '../../assets/smiley.png';
import {PhotoCarousel} from "../PhotoCarousel/PhotoCarousel.tsx";
import {useCreatePost} from "../../utils/customHooks.ts";

interface CreatePostProps {
    userId: string | null;
    profileImage: string;
    username: string;
    setIsCreatePostOpen: (isOpen: boolean) => void;
}

export const CreatePost = ({ userId, username, profileImage, setIsCreatePostOpen }: CreatePostProps) => {
    const {
        content,
        setContent,
        photos,
        previews,
        showEmojiPicker,
        setShowEmojiPicker,
        creating,
        status,
        error,
        handleFileChange,
        onEmojiClick,
        handleSubmit,
        resetForm,
    } = useCreatePost(userId, setIsCreatePostOpen);

    const closeCreatePost = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setIsCreatePostOpen(false);
        setShowEmojiPicker(false);
        resetForm();
    };

    return (
        <div
            className="fixed z-30 inset-0 md:left-[60px] lgg:left-[244px] flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.65)" }}
            onClick={closeCreatePost}
        >
            <div
                className="bg-white w-[90vw] max-w-[1000px] max-h-[92vh] rounded-xl flex flex-col shadow-xl shrink-0 overflow-visible"
                onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            >
                {status === "FAILED" && error && (
                    <div className="p-4 text-error text-center">
                        Image should be less than 5MB and svg/jpg/png
                    </div>
                )}
                <form onSubmit={handleSubmit} className="flex justify-between p-4 border-b border-b-gray shrink-0">
                    <img src={arrow_back} alt="Back" className="cursor-pointer" onClick={closeCreatePost} />
                    <p className="font-semibold">Create new post</p>
                    <div className="relative">
                        {creating && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#0095F6"
                                className="absolute -left-8 animate-spin"
                            >
                                <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
                            </svg>
                        )}
                        <input
                            type="submit"
                            disabled={content.length === 0 || photos.length === 0}
                            className={content.length === 0 || photos.length === 0 ? "text-gray" : "text-blue cursor-pointer"}
                            value="Share"
                        />
                    </div>
                </form>
                <div className="flex flex-col md:flex-row overflow-hidden">
                    <div
                        className="relative flex items-center justify-center overflow-hidden shrink-0 bg-lightgray
                        w-full h-[min(55vh,450px)] min-h-[300px]
                        md:w-[560px] md:h-[min(90vh,680px)] md:min-h-[480px]"
                    >
                        {previews.length > 0 ? (
                            <div className="w-full h-full">
                                <PhotoCarousel
                                    croppedStyle={true}
                                    photos={previews.map((preview) => preview.url)}
                                />
                            </div>
                        ) : (
                            <img src={upload} alt="upload" />
                        )}
                        <input
                            type="file"
                            className="cursor-pointer opacity-0 absolute top-0 left-0 bottom-0 right-0 w-full h-full"
                            onChange={handleFileChange}
                            multiple
                        />
                    </div>
                    <div
                        className="flex flex-col px-4 py-6 w-full md:w-[400px] md:max-w-[440px] md:min-w-[335px]
                        md:h-[min(90vh,680px)] md:border-l border-gray min-h-[280px] overflow-y-auto overflow-x-visible"
                    >
                        <Link to={username ? `/profile/${username}` : "#"}>
                            <div className="flex items-center gap-4">
                                <img
                                    src={profileImage}
                                    alt="Profile image"
                                    className="w-6 h-6 rounded-[50%] border border-gray object-cover"
                                />
                                <p className="font-semibold">{username}</p>
                            </div>
                        </Link>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="resize-none w-full flex-1 min-h-[200px] lg:min-h-[360px] mt-4 p-0 outline-none"
                            maxLength={2200}
                        />
                        <div className="relative flex items-center justify-between border-b border-gray pb-3 mt-4 shrink-0">
                            <div className="relative">
                                <img
                                    src={smiley}
                                    alt="Emoji"
                                    className="w-6 h-6 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowEmojiPicker((prev) => !prev);
                                    }}
                                />
                                {showEmojiPicker && (
                                    <div
                                        className="absolute bottom-full left-0 mb-2 z-[100]"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Picker
                                            width={320}
                                            height={360}
                                            searchDisabled
                                            onEmojiClick={onEmojiClick}
                                        />
                                    </div>
                                )}
                            </div>
                            <p className="text-gray text-xs">{content.length}/2200</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
