import User from "../models/userSchema.js";
import jwt, { decode } from 'jsonwebtoken'

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    //console.log(cookies);
    if(!cookies?.jwt) return res.status(401).json({"msg":"No jwt cookie found so Unauthorized"});
    const refreshToken1 = cookies.jwt;
    //console.log(refreshToken1);
    const foundUser = await User.findOne({refreshToken: refreshToken1}).exec();
    if(!foundUser) return res.sendStatus(403); //forbidden
    jwt.verify(
        refreshToken1,
        process.env.REQUEST_TOKEN_SECRAT,
        (err, decoded) => {
            if(err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "id":decoded.id,
                        "username": decoded.username,
                        "roles": roles,
                        "profileimg":decoded.profileimg
                    }
                },
                process.env.ACCESS_TOKEN_SECRAT,
                {expiresIn: '300s'}
            );
            res.json({accessToken});
        }
    )
}

export default handleRefreshToken;