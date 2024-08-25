import User from "../models/userSchema.js";


const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(401);
    const refreshToken1 = cookies.jwt;

    const foundUser = await User.findOne({refreshToken: refreshToken1}).exec();
    if(!foundUser) {
        res.clearCookie('jwt',{httpOnly: true, sameSite:'None', secure: true});
        return res.sendStatus(204);
    }

    foundUser.refreshToken = '';
    foundUser.status = false;
    const result = await foundUser.save();

    res.clearCookie('jwt',{httpOnly: true, sameSite:'None', secure: true});
    res.sendStatus(204);
}

export default handleLogout;