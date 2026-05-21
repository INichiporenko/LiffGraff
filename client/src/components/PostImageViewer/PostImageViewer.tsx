import { PhotoCarousel } from "../PhotoCarousel/PhotoCarousel.tsx";

type PostImageViewerProps = {
    photos: string[];
    className?: string;
};

export const PostImageViewer = ({ photos, className = "" }: PostImageViewerProps) => {
    const imageUrls = photos.filter(Boolean);

    if (imageUrls.length === 0) {
        return null;
    }

    return (
        <div
            className={`relative flex items-center justify-center overflow-hidden bg-[#fafafa] shrink-0
            w-full h-[min(55vh,450px)] min-h-[300px]
            md:w-[min(58vw,560px)] md:h-[min(90vh,680px)] md:min-h-[480px]
            ${className}`}
        >
            {imageUrls.length > 1 ? (
                <div className="w-full h-full">
                    <PhotoCarousel photos={imageUrls} croppedStyle />
                </div>
            ) : (
                <img
                    src={imageUrls[0]}
                    alt="Post"
                    className="w-full h-full object-cover"
                />
            )}
        </div>
    );
};
