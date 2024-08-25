import express from 'express'
import handleNewUser from '../controller/registerController.js';
import handleUsernameChack from '../controller/usernameCheckController.js';
import handleLogin from '../controller/loginController.js';
import handleRefreshToken from '../controller/refreshTokenController.js';
import handleLogout from '../controller/logoutController.js';
import multer from 'multer';
import path from 'path';

const userAuthRouter = express.Router();
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

userAuthRouter.post("/signin", upload.single('profile'), handleNewUser);
userAuthRouter.post("/login", handleLogin);
userAuthRouter.post("/logout",handleLogout);
userAuthRouter.post("/refreshtoken", handleRefreshToken);
userAuthRouter.get("/checkusername/(:uid)?", handleUsernameChack);

export default userAuthRouter;