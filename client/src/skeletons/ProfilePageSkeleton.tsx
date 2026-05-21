import default_profile_pic from "../assets/default_profile_pic.png";

export const ProfilePageSkeleton = () => {
    return (
        <div className="animate-pulse-short flex flex-col items-center gap-8
            mx-auto max-w-[930px] md:my-9 lg:gap-16 w-full">
            <div className="w-full text-center border-b border-b-gray md:hidden p-2 font-semibold">
                <div className="w-32 h-6 bg-gray mx-auto"></div>
            </div>
            <div className="flex flex-col gap-8 lg:gap-16">
                <div className="flex gap-4 px-6 md:gap-12 lg:gap-20">
                    <img className="rounded-[50%] border border-gray
                    w-28 h-28 object-cover md:min-w-[150px] md:h-[150px]" src={default_profile_pic} alt="Profile pic"/>
                    <div>
                        <div className="flex flex-col items-start md:flex-row md:items-center gap-2 mb-3">
                            <div className="w-32 h-6 bg-gray"></div>
                            <div className="flex gap-2">
                                <button className="rounded-lg bg-gray text-sm text-white
                                h-7 w-20 sm:w-28 md:w-[132px]">Follow
                                </button>
                                <button className="rounded-lg bg-gray text-sm text-white
                                h-7 w-20 sm:w-28 md:w-[132px]">Message
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-3.5 sm:gap-8 md:gap-16 md:mb-5 text-sm md:text-md opacity-30">
                            <p><b>0</b> posts</p>
                            <p><b>0</b> followers</p>
                            <p><b>0</b> following</p>
                        </div>
                        <div className="hidden md:block w-48 h-6 bg-gray"></div>
                    </div>
                </div>
                <div className="grid grid-cols-3 px-2 sm:px-6 gap-1 sm:gap-2">
                    {new Array(12).fill(0).map((_, i) => (
                        <div key={i} className="bg-gray lg:h-[280px] md:h-[200px] aspect-square">
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}