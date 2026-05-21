import {ChangeEvent, useEffect, useState} from 'react';
import { useNavigate} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store.ts";
import {fetchUser} from "../store/actionCreators/userActionCreators.ts";
import {UserState} from "../store/types/userTypes.ts";
import {axiosInstance} from "./apiCalls";
import {AxiosError} from "axios";
import {EmojiClickData} from "emoji-picker-react";
import {createPost} from "../store/actionCreators/postActionCreators.ts";
import {addPost, setAuthUser} from "../store/slices/userSlice.ts";

export const useScreenWidth = () => {
    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return screenWidth;
};

export const useFetchUserAfterReload = (user: UserState): void => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    useEffect(() => {
        const checkToken = async () => {
            try {
                if (user.username == '') {
                    // API call to validate the token
                    const {data} = await axiosInstance.get('/auth/check-access-token');
                    if (data.username) {
                        if (data.id) {
                            dispatch(setAuthUser({ _id: data.id, username: data.username }));
                        }
                        dispatch(fetchUser({username: data.username}));
                    }
                }
            } catch (error) {
                if (error instanceof AxiosError && error.response?.status === 401) {
                    // Token is invalid or expired
                    navigate('/login', { replace: true }); // Redirect to login
                } else {
                    console.error('Unexpected error during auth check:', error);
                }
            }
        };

        checkToken();
    }, [user, dispatch, navigate]);
};


export type PreviewType = {
    url: string;
    width: number;
    height: number;
};

export const useCreatePost = (userId: string | null, setIsCreatePostOpen: (isOpen: boolean) => void) => {
    const [content, setContent] = useState<string>("");
    const [photos, setPhotos] = useState<File[]>([]);
    const [previews, setPreviews] = useState<PreviewType[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const [creating, setCreating] = useState<boolean>(false);

    const { status, error } = useSelector((state: RootState) => state.post);
    const dispatch = useDispatch<AppDispatch>();

    // Handle file input change
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];

        if (files.length > 0) {
            const fileArray = Array.from(files);
            const previewPromises = fileArray.map((file) => {
                return new Promise<PreviewType>((resolve) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);

                    reader.onload = () => {
                        const img = new Image();
                        img.src = reader.result as string;

                        img.onload = () => {
                            resolve({
                                url: reader.result as string,
                                width: img.width,
                                height: img.height,
                            });
                        };
                    };
                });
            });

            Promise.all(previewPromises).then((previews) => {
                setPreviews(previews); // Update previews state
                setPhotos(fileArray); // Update photos state
            });
        }
    };

    // Handle emoji click
    const onEmojiClick = (emojiData: EmojiClickData) => {
        setContent((prevContent) => prevContent + emojiData.emoji); // Append emoji to content
    };

    // Reset form state
    const resetForm = () => {
        setContent("");
        setPhotos([]);
        setPreviews([]);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (content.length === 0 || photos.length === 0) {
            alert("Please add content and photos before submitting.");
            return;
        }

        setCreating(true);

        try {
            const result = await dispatch(createPost({ photos, content })).unwrap();
            if (result && userId) {
                dispatch(addPost(result));
                setIsCreatePostOpen(false);
                resetForm();
            }
        } catch (error) {
            console.error("Unexpected error:", error);
        } finally {
            setCreating(false);
        }
    };

    return {
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
    };
};


const useScrollToTop = () => {
    useEffect(() => {
        // Scroll to the top of the page when the component renders
        window.scrollTo({
            top: 0, // Smooth scroll to the top
        });
    }, []); // Empty dependency array ensures it runs only on mount
};

export default useScrollToTop;
