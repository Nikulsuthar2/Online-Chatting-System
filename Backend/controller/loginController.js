import User from '../models/userSchema.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const handleLogin = async (req, res) => {
    const {email, pswd} = req.body;
    if(!email || !pswd) return res.status(400).json({"success":false,"msg":"Email and password are required"});
    
    const foundUser = await User.findOne({email}).exec();
    if(!foundUser) return res.status(401).json({"success":false, "msg":"User not exist"});

    const match = await bcrypt.compare(pswd, foundUser.password);
    if(match){
        // create JWT
        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "id":foundUser._id,
                    "username": foundUser.username,
                    "roles": roles,
                    "profileimg":foundUser.profileimg
                }
            },
            process.env.ACCESS_TOKEN_SECRAT,
            {expiresIn: '120s'}
        );
        const refreshToken = jwt.sign(
            {"username": foundUser.username, "id": foundUser._id, "profileimg": foundUser.profileimg},
            process.env.REQUEST_TOKEN_SECRAT,
            {expiresIn: '1d'}
        );
        // saving refresh token with current user
        foundUser.refreshToken = refreshToken;
        foundUser.status = true;
        const result = await foundUser.save();
        //console.log(result);

        res.cookie("jwt", refreshToken, {httpOnly:true, sameSite: 'None', secure: true, maxAge: 24*60*60*1000})
        res.json({"success":true, "token": accessToken ,"msg":`User ${foundUser.username} is logged in`})
    } else {
        res.status(401).json({"success":false, "msg":"Username or password are incorrect"});
    }
}

export default handleLogin;