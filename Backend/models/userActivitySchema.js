import mongoose, { Schema } from "mongoose";

const activitySchema = new Schema({
    senderid:{type:mongoose.Types.ObjectId, ref:"User", required:true},
    receiverid:{type:mongoose.Types.ObjectId, ref:"User", required:true},
    isTyping:{type:Boolean, default:false}
});

const Activity = mongoose.model('Activity', activitySchema); 
export default Activity;