import mongoose, { Schema } from "mongoose";

/*
const msgSchema = new Schema({
    senderid:{type:mongoose.Types.ObjectId, ref:"User", required:true},
    receiverid:{type:mongoose.Types.ObjectId, ref:"User", required:true}, 
    isOurMsg: {type:Boolean, default:true},
    msg: {type:String, default:""},
    msgType: {type:String, default:"Text"},
    seen: {type: Boolean, default: false},
    timeSent: {type: Date, default: Date.now}
});

const chatSchema = new Schema({
    participants: [{type:mongoose.Types.ObjectId, ref:"User", required:true}],
    chats: [msgSchema],
    createdAt: {type:Date, default:Date.now}
});
*/

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

const Chat = mongoose.model('Chats', chatSchema); 
export default Chat;