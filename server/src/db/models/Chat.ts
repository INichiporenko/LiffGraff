import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    user1: {type: mongoose.Types.ObjectId, ref: "User", required: true},
    user2: {type: mongoose.Types.ObjectId, ref: "User", required: true},
    messages: [{type: mongoose.Types.ObjectId, ref: "Message"}],
    last_message: {type: mongoose.Types.ObjectId, ref: "Message"}
});

const Chat = mongoose.model("Chat", ChatSchema);
export default Chat;