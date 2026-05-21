import mongoose from "mongoose";
declare const Post: mongoose.Model<{
    content: string;
    createdAt: NativeDate;
    photos: mongoose.Types.ObjectId[];
    likes: mongoose.Types.ObjectId[];
    like_count: number;
    comments: mongoose.Types.ObjectId[];
    website?: string | null | undefined;
    author?: mongoose.Types.ObjectId | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    content: string;
    createdAt: NativeDate;
    photos: mongoose.Types.ObjectId[];
    likes: mongoose.Types.ObjectId[];
    like_count: number;
    comments: mongoose.Types.ObjectId[];
    website?: string | null | undefined;
    author?: mongoose.Types.ObjectId | null | undefined;
}> & {
    content: string;
    createdAt: NativeDate;
    photos: mongoose.Types.ObjectId[];
    likes: mongoose.Types.ObjectId[];
    like_count: number;
    comments: mongoose.Types.ObjectId[];
    website?: string | null | undefined;
    author?: mongoose.Types.ObjectId | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    content: string;
    createdAt: NativeDate;
    photos: mongoose.Types.ObjectId[];
    likes: mongoose.Types.ObjectId[];
    like_count: number;
    comments: mongoose.Types.ObjectId[];
    website?: string | null | undefined;
    author?: mongoose.Types.ObjectId | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    content: string;
    createdAt: NativeDate;
    photos: mongoose.Types.ObjectId[];
    likes: mongoose.Types.ObjectId[];
    like_count: number;
    comments: mongoose.Types.ObjectId[];
    website?: string | null | undefined;
    author?: mongoose.Types.ObjectId | null | undefined;
}>> & mongoose.FlatRecord<{
    content: string;
    createdAt: NativeDate;
    photos: mongoose.Types.ObjectId[];
    likes: mongoose.Types.ObjectId[];
    like_count: number;
    comments: mongoose.Types.ObjectId[];
    website?: string | null | undefined;
    author?: mongoose.Types.ObjectId | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Post;
