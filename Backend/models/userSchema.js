import mongoose, { Schema } from "mongoose";


const userSchema = new Schema({
    username: {type: String, required: true},
    name: {type: String, default: "User"},
    email: {type: String, required: true},
    phone: {type: String},
    bio: {type: String, default: "Hi there, I am on NikChat"},
    profileimg: {type: String},
    password: {type: String, required: true},
    status: {type:Boolean, default: false},
    friends: {type:[String], default: []},
    requests: {type:[String], default: []},
    blocked: {type:[String], default: []},
    roles: {type:[String], default:['user']},
    refreshToken: String,
    createdAt: {type:Date, default:Date.now()}
});

const User = mongoose.model('User', userSchema); 
export default User;