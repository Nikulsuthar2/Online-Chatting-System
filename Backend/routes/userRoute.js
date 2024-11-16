import express from 'express'
import { handleGetStatus, handleSetStatus } from '../controller/userStatusController.js';
import { handleAcceptFriendRequest, handleAddFriendRequest, handleBlockUser, handleCancelFriendRequest, handleGetAllBlockedUser, handleGetAllFriendRequest, handleGetAllFriends, handleGetTotalRequests, handleGetUserData, handleRemoveFriend, handleSearchUser, handleUnblockUser, handleUpdateProfile } from '../controller/userDataController.js';
import multer from 'multer';
import path from 'path';

const userRouter = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "uploads/profile_images/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, file.originalname.split(".")[0]+"_"+Date.now().toString()+ext);
    }
})
const upload = multer({storage});

userRouter.get("/status", handleGetStatus);
userRouter.put("/status", handleSetStatus);

userRouter.get("/searchusers", handleSearchUser);
userRouter.get("/userdata/(:id)?", handleGetUserData);
userRouter.post("/updateprofile", upload.single('profileimg'), handleUpdateProfile);

userRouter.post("/sendfriendrequest", handleAddFriendRequest);
userRouter.post("/cancelfriendrequest", handleCancelFriendRequest);
userRouter.post("/acceptfriendrequest", handleAcceptFriendRequest);
userRouter.get("/totalfriendrequests", handleGetTotalRequests);
userRouter.get("/getAllFriendRequest", handleGetAllFriendRequest);

userRouter.get("/getAllFriends", handleGetAllFriends);
userRouter.post("/removefriend", handleRemoveFriend);

userRouter.get("/getAllBlockedUser", handleGetAllBlockedUser);
userRouter.post("/blockuser", handleBlockUser);
userRouter.post("/unblockuser", handleUnblockUser);

export default userRouter;