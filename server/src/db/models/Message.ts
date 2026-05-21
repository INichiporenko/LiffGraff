import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    author: {type: mongoose.Types.ObjectId, ref: "User", required: true},
    receiver: {type: mongoose.Types.ObjectId, ref: "User", required: true},
    content: {type: String, required: true, maxLength: 255},
    read: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now},
});

const Message = mongoose.model("Message", MessageSchema);
export default Message;