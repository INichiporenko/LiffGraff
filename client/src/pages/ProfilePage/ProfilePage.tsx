import { useEffect, useState} from 'react';
import {Link, useLocation, useParams} from "react-router";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";
import {User} from "../../store/types/instanceTypes.ts";
import {PostModal} from "../../components/PostModal/PostModal.tsx";
import {ProfileHeader} from "../../components/ProfileHeader/ProfileHeader.tsx";
import {ProfilePageSkeleton} from "../../skeletons/ProfilePageSkeleton.tsx";
import {fetchProfile} from "../../utils/apiCalls/userApi.ts";

export const ProfilePage = () => {
    const {username} = useParams();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const user = useSelector((state: RootState) => state.user);
    const location = useLocation();

    const isModal = location.pathname.includes("/post/");

    useEffect(() => {
        const fetchUserFunc = async() => {
            if (!username) return;
            if (user.username !== username) {
                const result = await fetchProfile(username);
                setCurrentUser(result);
            } else {
                setCurrentUser(user);
            }
        }
        fetchUserFunc();
    }, [username, user]);

    if (!currentUser) return <ProfilePageSkeleton/>;

    return (
        <div className="flex flex-col items-center gap-8 mx-auto max-w-[930px] md:my-9 lg:gap-16 w-full">
            <div className="w-full text-center border-b border-b-gray md:hidden p-2 font-semibold">
                {currentUser?.username}</div>
            <div className="flex flex-col gap-8 lg:gap-16">
                <ProfileHeader user={currentUser} profileUsername={user.username}/>
                <div className="grid grid-cols-3 px-2 sm:px-6 gap-1 sm:gap-2">
                    {currentUser?.posts &&
                        currentUser.posts.length > 0 &&
                        [...currentUser.posts].reverse().map((post) => (
                            <div key={post._id} className="relative aspect-square">
                                <Link to={`/post/${post._id}`} state={{backgroundLocation: location}}>
                                    <img
                                        src={post.photos[0].url}
                                        alt={post._id}
                                        className="w-full h-full object-cover"
                                    />
                                </Link>
                                {post.photos.length > 1 &&
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                         width="24px" fill="#FFF"
                                         className="absolute top-3 right-3">
                                        <path
                                            d="M240-400v80h-80q-33 0-56.5-23.5T80-400v-400q0-33 23.5-56.5T160-880h400q33 0 56.5 23.5T640-800v80h-80v-80H160v400h80ZM400-80q-33 0-56.5-23.5T320-160v-400q0-33 23.5-56.5T400-640h400q33 0 56.5 23.5T880-560v400q0 33-23.5 56.5T800-80H400Zm0-80h400v-400H400v400Zm200-200Z"/>
                                    </svg>}
                            </div>
                        ))}
                </div>
            </div>
            {isModal && <PostModal/>}
        </div>
    );
};