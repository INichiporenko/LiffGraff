import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    photos: [{type: mongoose.Schema.Types.ObjectId, ref: "Photo"}],
    content: {type: String, required: true, maxlength: 2200},
    website: {type: String},
    createdAt: {type: Date, default: Date.now},
    like_count: {type: Number, default: 0},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: "Like"}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}],
});

const Post = mongoose.model("Post", PostSchema);

export default Post;