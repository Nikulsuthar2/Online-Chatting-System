import express from 'express'
import { handleGetStatus, handleSetStatus } from '../controller/userStatusController.js';
import { handleAcceptFriendRequest, handleAddFriendRequest, handleCancelFriendRequest, handleGetAllFriendRequest, handleGetAllFriends, handleGetTotalRequests, handleGetUserData, handleRemoveFriend, handleSearchUser } from '../controller/userDataController.js';

const userRouter = express.Router()

userRouter.get("/status", handleGetStatus);
userRouter.put("/status", handleSetStatus);
userRouter.get("/searchusers", handleSearchUser);
userRouter.get("/userdata/(:id)?", handleGetUserData);
userRouter.post("/sendfriendrequest", handleAddFriendRequest);
userRouter.post("/cancelfriendrequest", handleCancelFriendRequest);
userRouter.post("/acceptfriendrequest", handleAcceptFriendRequest);
userRouter.get("/totalfriendrequests", handleGetTotalRequests);
userRouter.get("/getAllFriendRequest", handleGetAllFriendRequest);
userRouter.get("/getAllFriends", handleGetAllFriends);
userRouter.post("/removefriend", handleRemoveFriend);

export default userRouter;