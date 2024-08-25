import mongoose, { Schema } from "mongoose";


const userSchema = new Schema({
    username: {type: String, required: true},
    name: {type: String, default: "User"},
    email: {type: String, required: true},
    phone: {type: String},
    profileimg: {type: String},
    password: {type: String, required: true},
    status: {type:Boolean, default: false},
    friends: {type:[String], default: []},
    requests: {type:[String], default: []},
    roles: {type:[String], default:['user']},
    refreshToken: String,
    createdAt: {type:Date, default:Date.now()}
});

const User = mongoose.model('User', userSchema); 
export default User;