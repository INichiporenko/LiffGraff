import {User} from "./instanceTypes.ts";

export type fetchUserData = {
    username: string,
}

export interface UserState extends User {
    status: string,
    error: string | null,
}

export type EditProfileData = {
    profile_image: File[] | null,
    username: string,
    new_username: string,
    website: string,
    bio: string,
}