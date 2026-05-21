import {useEffect, useRef, useState} from "react";
import {useParams} from "react-router";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store/store.ts";
import { syncPostInFeed, toPostFeedSync } from "../../store/slices/feedSlice.ts";
import {Post} from "../../store/types/instanceTypes.ts";
import {fetchPost} from "../../store/actionCreators/postActionCreators.ts";
import {PostMain} from "../../components/PostModal/PostMain.tsx";
import {EditPostForm} from "../../components/PostModal/EditPostForm.tsx";
import {PostMore} from "../../components/PostModal/PostMore.tsx";
import {PostImageViewer} from "../../components/PostImageViewer/PostImageViewer.tsx";

export const PostPage = () => {
    const {postId} = useParams();
    const [post, setPost] = useState<Post | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const syncLikeToFeed = (updated: Post) => {
        dispatch(syncPostInFeed(toPostFeedSync(updated)));
    };
    const [postType, setPostType] = useState<'preview' | 'edit'>('preview');
    const moreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchPostFunc = async() => {
            if (!postId) return;
            try {
                const result = await dispatch(fetchPost({ id: postId })).unwrap();
                setPost(result);
            } catch {
                setPost(null);
            }
        };
        fetchPostFunc();
    }, [postId, dispatch]);

    if (!post) {
        return null;
    }

    const photoUrls = post.photos?.map((photoField) => photoField.url || "") ?? [];

    return (
        <>
            <div hidden ref={moreRef}>
                <PostMore
                    modalRef={moreRef}
                    postId={post?._id}
                    authorUsername={post.author.username}
                    setPostType={setPostType}
                />
            </div>
            <div className="mx-auto w-[95vw] max-w-[1000px] my-6 md:my-9">
                <div className="flex flex-col md:flex-row border border-gray rounded-lg overflow-hidden bg-white max-h-[92vh]">
                    <PostImageViewer photos={photoUrls} />
                    <div className="flex flex-col w-full md:w-[400px] md:max-w-[423px] md:min-w-[335px] min-h-[320px] md:min-h-0 md:h-[min(90vh,680px)] border-t md:border-t-0 md:border-l border-gray overflow-hidden">
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
        </>
    );
};
