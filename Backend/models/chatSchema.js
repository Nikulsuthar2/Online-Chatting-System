import mongoose, { Schema } from "mongoose";

/*
const msgSchema = new Schema({
    senderid:{type:mongoose.Types.ObjectId, ref:"User", required:true},
    isOurMsg: {type:Boolean, default:true},
    msg: {type:String, default:""},
    msgType: {type:String, default:"Text"},
    seen: {type: Boolean, default: false},
    timeSent: {type: Date, default: Date.now}
});

const chatUserSchema =new Schema({
    chatUid:{type:mongoose.Types.ObjectId, ref:"User", required:true},
    activity:{type:String, default:""},
    messages: [msgSchema]
})

const chatSchema = new Schema({
    uid: {type:mongoose.Types.ObjectId, ref:"User", required:true},
    chatUser: [chatUserSchema],
    createdAt: {type:Date, default:Date.now}
});
*/

const chatSchema = new Schema({
  senderid: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  receiverid: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  msg: { type: String, default: "" },
  msgType: { type: String, default: "Text" },
  isReply: { type: Boolean, default: false },
  replyData: { type: Object, default: null },
  seen: { type: Boolean, default: false },
  reactions: [
    {
      emoji: { type: String }, // Emoji used for the reaction
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who reacted
    },
  ],
  timeSent: { type: Date, default: Date.now },
  deletedBySender: { type: Boolean, default: false },
  deletedByReceiver: { type: Boolean, default: false },
});

const Chat = mongoose.model("Chats", chatSchema);
export default Chat;
