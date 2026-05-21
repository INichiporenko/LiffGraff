import mongoose from "mongoose";
declare const Photo: mongoose.Model<{
    url: string;
    post?: mongoose.Types.ObjectId | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    url: string;
    post?: mongoose.Types.ObjectId | null | undefined;
}> & {
    url: string;
    post?: mongoose.Types.ObjectId | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    url: string;
    post?: mongoose.Types.ObjectId | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    url: string;
    post?: mongoose.Types.ObjectId | null | undefined;
}>> & mongoose.FlatRecord<{
    url: string;
    post?: mongoose.Types.ObjectId | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Photo;
