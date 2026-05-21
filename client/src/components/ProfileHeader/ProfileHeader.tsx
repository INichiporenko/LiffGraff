import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router";
import {AppDispatch, RootState} from "../../store/store.ts";
import website_link from "../../assets/website_link.svg";
import {selectIfFollowing} from "../../store/selectors/userSelector.ts";
import {User} from "../../store/types/instanceTypes.ts";
import {followUser, unfollowUser} from "../../utils/apiCalls/userApi.ts";
import {addFollowing, removeFollowing} from "../../store/slices/userSlice.ts";

export const ProfileHeader= ({user, profileUsername}: {user: User | null, profileUsername: string}) => {
    const [isFollowing, setIsFollowing] = useState<boolean>(false);

    const isFollowingFromRedux = useSelector((state: RootState) =>
        user ? selectIfFollowing(state, user._id) : false
    );

    useEffect(() => {
        if (user) {
            setIsFollowing(isFollowingFromRedux);
        }
    }, [isFollowingFromRedux, user]);

    const ifUser = user ? user.username === profileUsername : false;
    const dispatch = useDispatch<AppDispatch>();

    if (!user) {
        return <div>Loading...</div>;
    }

    const onFollow = async () => {
        try {
            if (!user) return;
            const condensedUser = await followUser(user.username);
            dispatch(addFollowing(condensedUser));
            setIsFollowing(true);
        } catch (e) {
            console.error('Error following user', e);
        }
    };

    const onUnfollow = async () => {
        try {
            if (!user) return;
            const condensedUser = await unfollowUser(user.username);
            dispatch(removeFollowing(condensedUser));
            setIsFollowing(false);
        } catch (e) {
            console.error('Error unfollowing user', e);
        }
    };

    return (
        <>
            <div className="flex gap-4 px-6 md:gap-12 lg:gap-20">
                <img
                    className="rounded-[50%] border border-gray
                    w-28 h-28 object-cover md:min-w-[150px] md:h-[150px]"
                     src={user?.profile_image} alt="Profile pic"
                />
                <div>
                    <div className="flex flex-col items-start md:flex-row md:items-center gap-2 mb-3">
                        <p className="text-lg mr-3">{user?.username}</p>
                        {!ifUser ?
                            <div className="flex gap-2 mb-4">
                                {!isFollowing &&
                                    <button
                                        className="rounded-lg bg-blue text-sm text-white
                                        h-7 w-20 sm:w-28 md:w-[132px] cursor-pointer"
                                        onClick={onFollow}>Follow
                                    </button>}
                                {isFollowing &&
                                    <button
                                        className="rounded-lg  text-sm bg-[#EFEFEF]
                                        h-7 w-20 sm:w-28 md:w-[132px]"
                                        onClick={onUnfollow}>Unfollow
                                    </button>}
                                <Link to={`/messages/${user.username}`}
                                      className="rounded-lg bg-[#EFEFEF] text-sm
                                      h-7 w-28 sm:w-36 md:w-[190px] cursor-pointer">
                                    <p className="text-center pt-1">Message</p>
                                </Link>
                            </div> :
                            <Link to={`${window.location.pathname}/edit`}>
                                <button className="rounded-lg bg-[#EFEFEF] text-sm
                                h-7 w-28 sm:w-36 md:w-[190px]">Edit profile
                                </button>
                            </Link>
                        }
                    </div>
                    <div className="flex gap-3.5 sm:gap-8 md:gap-16 md:mb-5 text-sm md:text-md">
                        <p><b>{user?.posts.length}</b> posts</p>
                        <p><b>{user?.followers.length}</b> followers</p>
                        <p><b>{user?.followings.length}</b> following</p>
                    </div>
                    {user.bio ? <p className="hidden md:block text-sm w-[434px] break-words">{user.bio}</p> :
                        <p className="hidden md:block text-sm text-darkgray">No bio yet</p>}
                    {user.website && <div className="hidden md:flex gap-1 text-darkblue text-sm mt-4">
                        <img src={website_link} alt="Website"/>
                        <a href={user?.website?.startsWith('http') ? user.website : `https://${user.website}`}
                           target="_blank"
                           rel="noopener noreferrer">{user?.website}</a>
                    </div>}
                </div>
            </div>
            <div className="md:hidden pl-6 text-sm w-[90vw] break-words">
                {user?.bio && <p>{user?.bio}</p>}
                {user?.website && <div className="flex gap-1 text-darkblue text-sm mt-4">
                    <img src={website_link} alt="Website"/>
                    <p>{user?.website}</p>
                </div>}
            </div>
        </>
    );
};