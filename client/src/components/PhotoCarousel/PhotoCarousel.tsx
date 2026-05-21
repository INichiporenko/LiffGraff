import React, { useState } from "react";

type PhotoCarouselProps = {
    photos: string[];
    type?: string;
    croppedStyle?: boolean;
};

export const PhotoCarousel = ({ photos, type, croppedStyle = false }: PhotoCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
    };

    const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setCurrentIndex((prevIndex) => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <div
            className={`relative flex justify-center items-center w-full h-full overflow-hidden ${
                type ? "h-[473px] max-w-[473px]" : ""
            }`}
        >
            <img
                src={photos[currentIndex]}
                alt={`Photo ${currentIndex + 1}`}
                className={
                    croppedStyle
                        ? "w-full h-full object-cover"
                        : "max-w-full max-h-full w-auto h-auto object-contain"
                }
            />

            {photos.length > 1 && (
                <>
                    <button
                        className="absolute z-10 top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full px-2.5"
                        onClick={handlePrev}
                    >
                        &#8249;
                    </button>
                    <button
                        className="absolute z-10 top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full px-2.5"
                        onClick={handleNext}
                    >
                        &#8250;
                    </button>
                </>
            )}
        </div>
    );
};
