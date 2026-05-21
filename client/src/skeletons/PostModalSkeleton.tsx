import arrow_back from "../assets/arrow_back.svg";
import more from "../assets/more.svg";
import like from "../assets/reactions/like.svg";
import comment from "../assets/reactions/comment.svg";
import smiley from "../assets/smiley.png";

export const PostModalSkeleton = () => {
    return (
        <div className="fixed z-20 h-[calc(100vh-81px)] md:h-screen w-screen
                md:w-[calc(100vw-60px)] lgg:w-[calc(100vw-244px)] top-0 left-0 md:left-[60px] lgg:left-[244px]"
             style={{backgroundColor: 'rgba(0, 0, 0, 0.65)'}}>
            <div className="flex justify-center mt-6 h-[90%] md:h-full md:mt-0 md:items-center  w-full">
                <div className="flex flex-col  w-[80vw] md:w-fit mx-6 opacity-100 z-10 rounded bg-white">
                    <div
                        className="md:hidden flex w-full justify-between border-b border-b-gray
                        px-4 py-2 font-semibold">
                        <img
                            src={arrow_back}
                            alt="Back"
                            className="cursor-pointer"
                        />
                        <div className="w-32 h-6 bg-gray"></div>
                        <img
                            src={more}
                            alt="More"
                            className="justify-self-end"
                        />
                    </div>
                    <div className="animate-pulse-short flex flex-col md:flex-row
                    justify-center overflow-auto h-full">
                        <div className="flex justify-center items-center md:min-w-[280px] lg:min-w-[353px]
                        max-h-[360px] md:max-h-[680px]">
                            <div className="w-full h-full bg-gray"></div>
                        </div>
                        <div className="relative border-l  border-gray
                           w-full h-[460px] md:min-h-full md:w-[423px] overflow-y-auto">
                            <div className="flex flex-col overflow-y-scroll h-[calc(100%-150px)]">
                                <div className="hidden lg:flex justify-between border-b border-b-gray">
                                    <div className="flex items-center gap-3 mx-3.5 my-4 text-xs">
                                        <div
                                            className="w-6 h-6 rounded-[50%] object-cover bg-gray"></div>
                                        <div className="w-32 h-6 bg-gray"></div>
                                    </div>
                                    <p></p>
                                </div>
                                <div className="flex gap-3 mx-3.5 my-3 text-xs">
                                    <div className="min-w-6 max-w-6 h-6 object-cover
                                        rounded-[50%] bg-gray">
                                    </div>
                                    <div className="flex-col">
                                        <div className="flex gap-4">
                                            <div className="w-32 h-6 bg-gray"></div>
                                            <div className="w-48 h-6 bg-gray"></div>
                                        </div>
                                        <div className="w-full h-24 mt-2 bg-gray"></div>
                                    </div>
                                </div>
                                <div className="bg-white w-full absolute bottom-0">
                                    <div className="pl-3.5 mb-3 mt-2">
                                        <div className="flex gap-3 mb-2 opacity-30">
                                            <img
                                                src={like}
                                                alt='like'
                                                className="w-6 h-6 cursor-pointer"
                                            />
                                            <img src={comment}
                                                 alt="comment"
                                                 className="cursor-pointer"
                                            />
                                        </div>
                                        <div className="w-32 h-6 bg-gray"></div>
                                    </div>
                                    <div className="border-t border-t-gray">
                                        <div className="flex items-center justify-between pl-3.5 bg-white w-full">
                                            <div className="flex items-center gap-4 w-full mr-4">
                                                <img src={smiley}
                                                     alt="Emoji"
                                                     className="w-6 h-6 cursor-pointer"
                                                />
                                                <div className="p-2.5 h-10 w-full"/>
                                            </div>
                                            <button
                                                className="text-gray text-xs font-semibold pr-6 lg:pr-10">
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};