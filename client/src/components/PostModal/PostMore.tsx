import {Dispatch, MouseEvent, RefObject, SetStateAction, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {deletePost} from "../../utils/apiCalls/postApi.ts";
import {AppDispatch, RootState} from "../../store/store.ts";
import {removePost} from "../../store/slices/userSlice.ts";

type EditPostProps = {
    modalRef: RefObject<HTMLDivElement>;
    postId: string | undefined;
    authorUsername?: string;
    setPostType: Dispatch<SetStateAction<'preview' | 'edit'>>;
};

export const PostMore = ({modalRef, postId, authorUsername, setPostType}: EditPostProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const currentUsername = useSelector((state: RootState) => state.user.username);
    const {username: routeUsername} = useParams();
    const [showNotification, setShowNotification] = useState(false);

    const copyToClipboard = () => {
        const fullUrl = `${window.location.origin}${location.pathname}`;
        navigator.clipboard.writeText(fullUrl)
            .then(() => {
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
            })
            .catch((err) => {
                console.error('Failed to copy link: ', err);
            });
    };

    const closeModal = (e: MouseEvent<HTMLDivElement> | MouseEvent<HTMLAnchorElement>) => {
        if (modalRef.current) {
            e.stopPropagation();
            modalRef.current.hidden = true;
        }
    };

    const handleDeletePost = async () => {
        if (!postId || !modalRef.current) return;

        const profileUsername =
            authorUsername || routeUsername || currentUsername;

        if (!profileUsername) return;

        try {
            await deletePost(postId);
            dispatch(removePost(postId));
            navigate(`/profile/${profileUsername}`, { replace: true });
        } catch (error) {
            console.error('Could not delete post', error);
        }
    };

    return (
        <div
            className="fixed h-[calc(100vh-81px)] z-50 md:min-h-screen top-0 w-screen
            md:w-[calc(100vw-60px)] lgg:w-[calc(100vw-244px)] left-0 md:left-[60px] lgg:left-[244px]"
            style={{backgroundColor: 'rgba(0, 0, 0, 0.65)'}}
            onClick={closeModal}
        >
            <div
                className="bg-white opacity-100 mt-36 mx-auto rounded-xl
            xl:w-[400px] md:w-[320px] w-[90vw]"
                onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            >
                <div className="text-center">
                    <p
                        className="py-4 border-b border-b-gray text-error font-semibold cursor-pointer"
                        onClick={handleDeletePost}
                    >
                        Delete
                    </p>
                    <p
                        className="py-4 border-b border-b-gray cursor-pointer"
                        onClick={(e) => {
                            closeModal(e);
                            setPostType('edit');
                        }}
                    >
                        Edit
                    </p>
                    <p className="py-4 border-b border-b-gray cursor-pointer" onClick={closeModal}>
                        Go to post
                    </p>
                    <p className="py-4 border-b border-b-gray cursor-pointer" onClick={copyToClipboard}>
                        Copy link
                    </p>
                    <p className="py-4 cursor-pointer" onClick={closeModal}>
                        Cancel
                    </p>
                </div>
            </div>
            {showNotification && (
                <div className="fixed bottom-4 right-4 bg-white px-4 py-2 rounded shadow-md flex items-center gap-2">
                    <span>Link copied!</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowNotification(false);
                        }}
                        className="text-sm px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
};
