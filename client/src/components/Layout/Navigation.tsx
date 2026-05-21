import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store.ts";
import links from "./navLinks.ts";
import lgMark from "../../assets/nav_icons/lg-mark.svg";
import {BrandLogo} from "../BrandLogo/BrandLogo.tsx";
import default_profile_pic from "../../assets/default_profile_pic.png";
import { CreatePost } from "../CreatePost/CreatePost.tsx";
import { NotificationsModal } from "../NotificationsModal/NotificationsModal.tsx";
import { SearchModal } from "../SearchModal/SearchModal.tsx";
import { useFetchUserAfterReload } from "../../utils/customHooks.ts";
import { useMessagesUnread } from "../../utils/useMessagesUnread.ts";
import { useNavigate } from "react-router";
import { AppDispatch } from "../../store/store.ts";
import { logoutUser } from "../../store/actionCreators/authActionCreators.ts";
import { logout } from "../../store/slices/userSlice";
import { FiLogOut } from "react-icons/fi";

export const Navigation = () => {
    const user = useSelector((state: RootState) => state.user);
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
    const [isCreatePostOpen, setIsCreatePostOpen] = useState<boolean>(false);
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    useFetchUserAfterReload(user);
    const unreadMessagesCount = useMessagesUnread();

    const backgroundState = location.state as { backgroundLocation?: { pathname: string } } | null;
    const activePath = backgroundState?.backgroundLocation?.pathname ?? location.pathname;
    const isPostModalOpen = Boolean(backgroundState?.backgroundLocation);

    const getActiveNavItem = (): string | null => {
        if (isSearchOpen) return links[1].name;
        if (isNotificationsOpen) return links[4].name;
        if (isCreatePostOpen) return links[5].name;
        if (isPostModalOpen) return null;

        if (activePath === "/") return links[0].name;
        if (activePath === "/explore") return links[2].name;
        if (activePath.startsWith("/messages")) return links[3].name;
        if (activePath.startsWith("/profile")) return "Profile";
        return null;
    };

    const activeNavItem = getActiveNavItem();

    const isNavItemActive = (name: string) => activeNavItem === name;

    const navLabelClass = (name: string) =>
        `hidden lgg:block${isNavItemActive(name) ? " font-semibold" : ""}`;

    const closeNavModals = () => {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
        setIsCreatePostOpen(false);
    };

    const openSearch = () => {
        setIsNotificationsOpen(false);
        setIsCreatePostOpen(false);
        setIsSearchOpen((prev) => !prev);
    };

    const openNotifications = () => {
        setIsSearchOpen(false);
        setIsCreatePostOpen(false);
        setIsNotificationsOpen((prev) => !prev);
    };

    const openCreatePost = () => {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
        setIsCreatePostOpen((prev) => !prev);
    };

    const navIconSrc = (_name: string, logo: string, logoFill: string, isActive: boolean) =>
        isActive ? logoFill : logo;

    useEffect(() => {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
        setIsCreatePostOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            dispatch(logout());
            navigate("/login");
        }
    };
    
    return (
        <>
        <div className="z-20 bg-white flex justify-center md:border-r border-t md:border-t-0 border-gray
         py-7 lgg:px-4 min-w-full md:min-w-[60px] lgg:min-w-[244px]"
             style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <div
                className="flex justify-around w-full md:w-fit mx-10 md:mx-0
                 md:justify-start md:fixed top-7 md:flex-col items-center gap-4 min-w-[60px]">

                <Link
                    to={user?.username ? `/profile/${user.username}` : "/"}
                    className="hidden md:flex"
                    onClick={closeNavModals}
                >
                    <BrandLogo className="hidden lgg:block" size="md"/>
                    <img src={lgMark} alt="LifeGraff" className="block lgg:hidden h-10 w-10 object-contain"/>
                </Link>
                <div className="flex md:flex-col items-center justify-around
                lgg:md:items-start lgg:px-2 gap-4 md:mt-6 min-w-full">
                    <Link to={links[0].href} className="mx-auto lgg:mx-0" onClick={closeNavModals}>
                        <div className="flex gap-4">
                            <img
                                src={navIconSrc(
                                    links[0].name,
                                    links[0].logo,
                                    links[0].logoFill,
                                    isNavItemActive(links[0].name)
                                )}
                                alt={links[0].name}
                            />
                            <span className={navLabelClass(links[0].name)}>{links[0].name}</span>
                        </div>
                    </Link>
                    <div className="hidden md:flex lgg:gap-4 flex-col lgg:flex-row items-center cursor-pointer"
                         onClick={openSearch}>
                        <img
                            src={navIconSrc(
                                links[1].name,
                                links[1].logo,
                                links[1].logoFill,
                                isNavItemActive(links[1].name)
                            )}
                            alt={links[1].name}
                        />
                        <span className={navLabelClass(links[1].name)}>Search</span>
                        {isSearchOpen && (
                            <SearchModal isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen}/>
                        )}
                    </div>
                    <Link to={links[2].href} className="mx-auto lgg:mx-0" onClick={closeNavModals}>
                        <div className="flex gap-4 cursor-pointer">
                            <img
                                src={navIconSrc(
                                    links[2].name,
                                    links[2].logo,
                                    links[2].logoFill,
                                    isNavItemActive(links[2].name)
                                )}
                                alt={links[2].name}
                            />
                            <span className={navLabelClass(links[2].name)}>{links[2].name}</span>
                        </div>
                    </Link>
                    <Link to="/messages" className="flex gap-4 cursor-pointer mx-auto lgg:mx-0 relative"
                          onClick={closeNavModals}>
                        <div className="relative shrink-0">
                            <img
                                src={navIconSrc(
                                    links[3].name,
                                    links[3].logo,
                                    links[3].logoFill,
                                    isNavItemActive(links[3].name)
                                )}
                                alt={links[3].name}
                            />
                            {unreadMessagesCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1
                                flex items-center justify-center rounded-full bg-error text-white
                                text-[10px] font-semibold leading-none">
                                    {unreadMessagesCount > 99 ? "99+" : unreadMessagesCount}
                                </span>
                            )}
                        </div>
                        <span className={navLabelClass(links[3].name)}>Messages</span>
                    </Link>
                    <div className="hidden md:flex lgg:gap-4 flex-col lgg:flex-row items-center cursor-pointer"
                         onClick={openNotifications}>
                        <img
                            src={navIconSrc(
                                links[4].name,
                                links[4].logo,
                                links[4].logoFill,
                                isNavItemActive(links[4].name)
                            )}
                            alt={links[4].name}
                        />
                        <span className={navLabelClass(links[4].name)}>Notifications</span>
                        {isNotificationsOpen && (
                            <NotificationsModal
                                isNotificationsOpen={isNotificationsOpen}
                                setIsNotificationsOpen={setIsNotificationsOpen}
                                notifications={user?.notifications ?? []}
                            />
                        )}
                    </div>
                    <div className="flex lgg:gap-4 flex-col lgg:flex-row items-center cursor-pointer mx-auto lgg:mx-0"
                         onClick={openCreatePost}>
                        <img
                            src={navIconSrc(
                                links[5].name,
                                links[5].logo,
                                links[5].logoFill,
                                isNavItemActive(links[5].name)
                            )}
                            alt={links[5].name}
                            className="cursor-pointer"
                        />
                        <span className={`cursor-pointer ${navLabelClass(links[5].name)}`}>Create</span>
                    </div>
                    <Link to={`profile/${user?.username}`} className="mx-auto lgg:mx-0" onClick={closeNavModals}>
                        <div className="flex items-center gap-4 md:mt-12">
                            <img
                                src={user?.profile_image || default_profile_pic}
                                alt="Profile image"
                                className="w-6 h-6 object-cover rounded-[50%] border border-gray"
                            />
                            <span className={navLabelClass("Profile")}>Profile</span>
                        </div>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="mx-auto lgg:mx-0 mt-4 bg-red-500 text-black px-4 py-2 rounded-md flex items-center gap-2"
                    >
                        <FiLogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
        {isCreatePostOpen && (
            <CreatePost
                userId={user?._id}
                username={user?.username}
                profileImage={user?.profile_image}
                setIsCreatePostOpen={setIsCreatePostOpen}
            />
        )}
        </>
    );
};
