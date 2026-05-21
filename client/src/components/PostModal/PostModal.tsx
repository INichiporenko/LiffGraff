import { MouseEvent, useEffect, useRef, useState} from "react";
import { useNavigate, useParams} from "react-router";
import {useDispatch, useSelector,} from "react-redux";
import {AppDispatch, RootState} from "../../store/store.ts";
import { syncPostInFeed, toPostFeedSync } from "../../store/slices/feedSlice.ts";
import more from "../../assets/more.svg";
import arrow_back from "../../assets/arrow_back.svg";
import {Post} from "../../store/types/instanceTypes.ts";
import {fetchPost} from "../../store/actionCreators/postActionCreators.ts";
import {PostMain} from "./PostMain.tsx";
import {EditPostForm} from "./EditPostForm.tsx";
import {PostModalSkeleton} from "../../skeletons/PostModalSkeleton.tsx";
import {PostMore} from "./PostMore.tsx";
import {PostImageViewer} from "../PostImageViewer/PostImageViewer.tsx";

export const PostModal = () => {
    const [post, setPost] = useState<Post | null>(null);
    const [postType, setPostType] = useState<'preview' | 'edit'>('preview');
    const moreRef = useRef<HTMLDivElement>(null);
    const {_id} = useSelector((state: RootState)=> state.user);
    const dispatch = useDispatch<AppDispatch>();
    const syncLikeToFeed = (updated: Post) => {
        dispatch(syncPostInFeed(toPostFeedSync(updated)));
    };

    const {postId} = useParams();
    const navigate = useNavigate();

    const closeModal = () => {
        navigate(-1);
    };

    useEffect(() => {
        const fetchPostFunc = async() => {
            if (!postId) return;
            const result = await dispatch(fetchPost({ id: postId })).unwrap();
            setPost(result);
        }
        fetchPostFunc();
    }, [postId, dispatch]);

    if (!post) return <PostModalSkeleton/>;

    const photoUrls = post.photos?.map((photoField) => photoField.url || "") ?? [];

    return (
    <>
        {post?.author?._id === _id && <div hidden ref={moreRef}>
            <PostMore
                modalRef={moreRef}
                postId={post?._id}
                authorUsername={post.author.username}
                setPostType={setPostType}
            />
        </div>}
        <div
            className="fixed z-20 inset-0 md:left-[60px] lgg:left-[244px] flex items-center justify-center p-4"
            style={{backgroundColor: 'rgba(0, 0, 0, 0.65)'}}
            onClick={closeModal}>
            <div
                className="flex flex-col bg-white rounded-lg overflow-hidden w-full max-w-[1000px] max-h-[92vh] shadow-xl"
                onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            >
                <div className="md:hidden flex w-full justify-between border-b border-b-gray px-4 py-2 font-semibold shrink-0">
                    <img
                        src={arrow_back}
                        alt="Back"
                        className="cursor-pointer"
                        onClick={closeModal}/>
                    {post?.author.username}
                    {post?.author?._id === _id ? <p></p> :
                        <img
                            src={more}
                            alt="More"
                            className="justify-self-end cursor-pointer"
                            onClick={() => {
                                if (moreRef.current) {
                                    moreRef.current.hidden = false;
                                }
                            }}
                        />
                    }
                </div>
                <div className="flex flex-col md:flex-row min-h-0 flex-1 overflow-hidden">
                    <PostImageViewer photos={photoUrls} />
                    <div className="flex flex-col w-full md:w-[400px] md:max-w-[423px] md:min-w-[335px] min-h-[320px] md:min-h-0 md:h-[min(90vh,680px)] border-t md:border-t-0 md:border-l border-gray overflow-hidden min-w-0">
                        {postType === "preview" ? (
                            <PostMain
                                post={post}
                                setPost={setPost}
                                moreRef={moreRef}
                                onPostLikeSync={syncLikeToFeed}
                            />
                        ) : (
                            <EditPostForm
                                postContent={post?.content}
                                postId={post?._id}
                                setPost={setPost}
                                setPostType={setPostType}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    </>
    );
};
