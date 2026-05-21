export const SearchPageSkeleton = () => {
    return (
        <div className="h-full md:mx-auto md:my-20 m-2 lgg:max-w-[989px] lg:max-w-[820px] md:max-w-[640px]">
        {new Array(3).fill(0).map((_, ind) =>
            <div
                key={ind}
                className="grid grid-cols-3 grid-flow-col gap-2 mb-2 animate-pulse-short">
                {new Array(5).fill(0).map((_, i) => (
                    <div key={i} className={`bg-gray ${(ind % 2 === 0 && i === 0) ||
                    (ind % 2 !== 0 && i === 4)
                        ? "row-span-2"
                        : "lgg:h-[316px] lg:h-[280px] md:h-[200px] aspect-square"} cursor-pointer`}>
                    </div>
                ))}
            </div>
        )}
    </div>);
}