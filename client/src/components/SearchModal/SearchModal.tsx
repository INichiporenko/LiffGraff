import {ChangeEvent, Dispatch, MouseEvent, SetStateAction, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router";
import {AppDispatch, RootState} from "../../store/store.ts";
import cancel from '../../assets/search_cancel.svg';
import arrow_back from "../../assets/arrow_back.svg";
import {CondensedUser} from "../../store/types/instanceTypes.ts";
import {addSearchResult} from "../../store/slices/userSlice.ts";
import {addUserToSearchResults, getAllUsersForSearch} from "../../utils/apiCalls/userApi.ts";

type SearchModalProps = {
    isSearchOpen: boolean;
    setIsSearchOpen: Dispatch<SetStateAction<boolean>>;
}

export const SearchModal = ({isSearchOpen, setIsSearchOpen}: SearchModalProps) => {
   const [users, setUsers] = useState<CondensedUser[]>([]);
   const [matchingUsers, setMatchingUsers] = useState<CondensedUser[]>([]);
   const [searchInput, setSearchInput] = useState("");
   const [isClosing, setIsClosing] = useState(false);
   const dispatch = useDispatch<AppDispatch>();
   const searchResults = useSelector((state: RootState) => state.user.search_results);

   useEffect(() => {
       const fetchUsers = async () => {
           const users = await getAllUsersForSearch();
           setUsers(users);
       }
       if (users?.length === 0) fetchUsers();
   }, [users]);

    const closeModal = (e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            setIsClosing(true);
            setTimeout(() => {
                setIsSearchOpen(false);
                setIsClosing(false);
            }, 300);
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)
        if (e.target.value?.length < 1) {
            setMatchingUsers([]);
            return;
        }
        if (users.length === 0) return;
        const regex = new RegExp(e.target.value, 'i');
        const filtered = users.filter((user: CondensedUser) => regex.test(user.username));
        setMatchingUsers(filtered);
    };

    const handleAddToSearch = async (user: CondensedUser) => {
        await addUserToSearchResults(user.username);
        dispatch(addSearchResult({
            _id: user._id,
            profile_image: user.profile_image,
            username: user.username,
        }));
    };
    return (<div
        className="absolute z-20 left-0 top-0 md:-top-7 h-[calc(100vh-81px)] md:h-screen w-screen
            md:w-[calc(100vw-60px)] lgg:w-[calc(100vw-244px)] md:left-[48px] lgg:left-[220px]"
        style={{backgroundColor: 'rgba(0, 0, 0, 0.65)'}}
        onClick={closeModal}
    >
            <div className={`bg-white h-[calc(100vh-81px)] md:h-screen md:rounded-r-xl 
            transition-all duration-300 md:py-5 md:px-6 
            ${!isSearchOpen || isClosing  ? "w-0 opacity-0" : "md:w-[397px] w-full opacity-100" }`}
                 onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
                <div className="flex md:hidden justify-between p-3 border-b border-b-gray">
                    <img
                        src={arrow_back}
                        alt="Back"
                        onClick={closeModal}
                    />
                    <p className="font-semibold">Search</p>
                    <p></p>
                </div>
                <div className="px-6 md:px-0 py-5 md:py-0">
                    <p className="hidden md:block font-semibold text-xl mb-4">Search</p>
                    <div className="relative">
                        <input value={searchInput}
                               onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearch(e)}
                               placeholder="Search"
                               className="bg-gray rounded-lg w-full py-2.5
                                pl-4 pr-10 placeholder:text-darkgray"/>
                        <img className="absolute bottom-2.5 right-2"
                             src={cancel} alt="Cancel"
                             onClick={() => {
                                 setSearchInput("");
                                 setMatchingUsers([]);
                             }}/>
                    </div>
                    <div className="flex flex-col mt-12 gap-3">
                        {matchingUsers?.length > 0 ? (matchingUsers.map((user: CondensedUser) => (
                            <Link to={`/profile/${user.username}`} key={user._id}
                                  className="flex items-center gap-3"
                                    onClick={() => handleAddToSearch({
                                        _id: user._id,
                                        profile_image: user.profile_image,
                                        username: user.username,
                                    })}>
                                <img
                                    src={user.profile_image}
                                    alt="profile_image"
                                    className="w-10 h-10 object-cover rounded-[50%]"
                                />
                                <p className="font-semibold">{user.username}</p>
                            </Link>
                        ))) : (searchResults?.length > 0 &&
                            searchResults?.slice()?.reverse()?.slice(0, 5)?.map((user: CondensedUser) => (
                            <Link to={`/profile/${user.username}`}
                                  key={user._id} className="flex items-center gap-3">
                                <img
                                    src={user.profile_image}
                                    alt="profile_image"
                                    className="w-10 h-10 object-cover rounded-[50%]"
                                />
                                <p className="font-semibold">{user.username}</p>
                            </Link>
                        )))}
                    </div>
                </div>
            </div>
        </div>
    )
};