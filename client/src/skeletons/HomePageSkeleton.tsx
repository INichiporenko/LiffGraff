import like from "../assets/reactions/like.svg";
import comment from "../assets/reactions/comment.svg";

export const HomePageSkeleton = () => {
    return (<div className="flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2
             gap-x-10 gap-y-6 my-6 md:my-14 mx-[5vw] sm:mx-auto animate-pulse-short">
            {new Array(6).fill(0).map((_, ind) => <div
                key={ind} className="border-b border-b-gray max-w-[473px]">
                <div className="flex gap-2 mb-3">
                    <div className="w-7 h-7 bg-gray rounded-[50%]"></div>
                    <div className="w-32 h-7 bg-gray"></div>
                </div>
                <div className="aspect-square w-[90vw] sm:w-[420px] lgg:w-[473px] bg-gray"></div>
                <div className="flex gap-2 mt-1.5 mb-2.5 opacity-30">
                    <img src={like}
                         alt='like'
                         className="w-6 h-6 cursor-pointer"/>
                    <img src={comment} alt="comment"/>
                </div>
                <div className="flex gap-2 mb-3">
                    <div className="w-7 h-7 bg-gray rounded-[50%]"></div>
                    <div className="w-full h-12 bg-gray"></div>
                </div>
            </div>)}
        </div>
    </div>)
}