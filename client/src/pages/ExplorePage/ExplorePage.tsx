import {useCallback, useEffect, useRef, useState} from "react";
import {Link} from "react-router";
import {getRandomPosts} from "../../utils/apiCalls/postApi.ts";
import {Post} from "../../store/types/instanceTypes.ts";
import useScrollToTop from "../../utils/customHooks.ts";
import {SearchPageSkeleton} from "../../skeletons/SearchPageSkeleton.tsx";

export const ExplorePage = () => {
    const [photos, setPhotos] = useState<Post[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    useScrollToTop();

    const loadPosts = useCallback(async (): Promise<void> => {
        if (isFetching) return;

        try {
            setIsFetching(true);
            setLoadError(null);
            const fetchCount =
                window.innerHeight > window.innerWidth && photos.length === 0 ? 20 : 10;
            const result = await getRandomPosts(fetchCount);

            if (!Array.isArray(result)) {
                setLoadError("Could not load posts. Please try again.");
                return;
            }

            setPhotos((prevPosts) => {
                const existingIds = new Set(prevPosts.map((post) => post._id));
                const newPosts = result.filter((post) => !existingIds.has(post._id));
                return [...prevPosts, ...newPosts];
            });
        } catch (error) {
            console.error("Error fetching posts:", error);
            setLoadError("Could not load posts. Please try again.");
        } finally {
            setIsFetching(false);
            setIsInitialLoading(false);
        }
    }, [isFetching, photos.length]);

    useEffect(() => {
        loadPosts();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && !isFetching && !isInitialLoading) {
                    loadPosts();
                }
            },
            { threshold: 0.1 }
        );

        const ref = loadMoreRef.current;
        if (ref) observer.observe(ref);

        return () => {
            if (ref) observer.unobserve(ref);
        };
    }, [loadPosts, isFetching, isInitialLoading]);

    const getBlocks = () => {
        const blocks = [];
        for (let i = 0; i < photos.length; i += 5) {
            blocks.push(photos.slice(i, i + 5));
        }
        return blocks;
    };

    if (isInitialLoading) return <SearchPageSkeleton />;

    if (loadError && photos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-4 text-center">
                <p className="text-darkgray">{loadError}</p>
                <button
                    type="button"
                    onClick={() => loadPosts()}
                    className="bg-blue text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (photos.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] px-4 text-center text-darkgray">
                No posts to explore yet. Create a post or check back later.
            </div>
        );
    }

    return (
        <div
            className="flex flex-col md:mx-auto md:my-20 m-2 gap-2
        lgg:max-w-[989px] lg:max-w-[820px] md:max-w-[640px]"
        >
            {getBlocks().map((block: Post[], blockIndex: number) => (
                <div key={blockIndex} className="grid grid-cols-3 grid-flow-col gap-2">
                    {block.map((post: Post, postIndex: number) => {
                        const imageUrl = post.photos?.[0]?.url;
                        if (!imageUrl) return null;

                        return (
                            <Link
                                to={`/post/${post._id}`}
                                key={post._id}
                                className={`
                                ${
                                    (blockIndex % 2 === 0 && postIndex === 0) ||
                                    (blockIndex % 2 !== 0 && postIndex === 4)
                                        ? "row-span-2"
                                        : "lgg:h-[316px] lg:h-[280px] md:h-[200px] aspect-square"
                                } cursor-pointer
                            `}
                            >
                                <img
                                    src={imageUrl}
                                    alt="Photo"
                                    className="w-full h-full object-cover"
                                />
                            </Link>
                        );
                    })}
                </div>
            ))}
            <div ref={loadMoreRef} className="load-more-trigger h-8" />
        </div>
    );
};
