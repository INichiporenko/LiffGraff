import mongoose from "mongoose";
declare const Like: mongoose.Model<{
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
}> & {
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    minimize: true;
}, {
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
}>> & mongoose.FlatRecord<{
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Like;
