import mongoose, { Document } from "mongoose";
export interface UserType extends Document {
    _id: mongoose.Types.ObjectId;
    username: string;
    email: string;
    full_name: string;
    password: string;
    bio?: string;
    website?: string;
    profile_image?: string;
    notifications: mongoose.Types.ObjectId[];
    posts: mongoose.Types.ObjectId[];
    followers: mongoose.Types.ObjectId[];
    followings: mongoose.Types.ObjectId[];
    search_results: mongoose.Types.ObjectId[];
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
}
declare const User: mongoose.Model<UserType, {}, {}, {}, mongoose.Document<unknown, {}, UserType> & UserType & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default User;
