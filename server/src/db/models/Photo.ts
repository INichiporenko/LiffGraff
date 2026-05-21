import mongoose from "mongoose";

const PhotoSchema = new mongoose.Schema({
    url: { type: String, required: true },
    post: {type: mongoose.Schema.Types.ObjectId, ref: "Post"},
});

const Photo = mongoose.model("Photo", PhotoSchema);
export default Photo;