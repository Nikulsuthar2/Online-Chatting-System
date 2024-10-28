import express from 'express'
import { handleGetStatus, handleSetStatus } from '../controller/userStatusController.js';
import { handleAcceptFriendRequest, handleAddFriendRequest, handleBlockUser, handleCancelFriendRequest, handleGetAllBlockedUser, handleGetAllFriendRequest, handleGetAllFriends, handleGetTotalRequests, handleGetUserData, handleRemoveFriend, handleSearchUser, handleUnblockUser } from '../controller/userDataController.js';

const userRouter = express.Router()

userRouter.get("/status", handleGetStatus);
userRouter.put("/status", handleSetStatus);
userRouter.get("/searchusers", handleSearchUser);
userRouter.get("/userdata/(:id)?", handleGetUserData);
userRouter.post("/sendfriendrequest", handleAddFriendRequest);
userRouter.post("/cancelfriendrequest", handleCancelFriendRequest);
userRouter.post("/acceptfriendrequest", handleAcceptFriendRequest);
userRouter.post("/blockuser", handleBlockUser);
userRouter.post("/unblockuser", handleUnblockUser);
userRouter.get("/totalfriendrequests", handleGetTotalRequests);
userRouter.get("/getAllFriendRequest", handleGetAllFriendRequest);
userRouter.get("/getAllFriends", handleGetAllFriends);
userRouter.post("/removefriend", handleRemoveFriend);
userRouter.get("/getAllBlockedUser", handleGetAllBlockedUser);

export default userRouter;