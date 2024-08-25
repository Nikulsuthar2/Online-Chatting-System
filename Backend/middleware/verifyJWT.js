import jwt from 'jsonwebtoken'

const verifyJWT = (req, res, next) => {
    let authHeader = req.headers["authorization"];
    //console.log(authHeader);
    if(!authHeader) return res.status(401).json({msg:"auth header not found"});
    if(authHeader.startsWith("Bearer")){
        authHeader = authHeader.split(" ")[1];
    }
    const token = authHeader;
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRAT,
        (err, decoded) => {
            if (err) console.log(err);
            if (err) return res.sendStatus(403); // forbidden
            req.user = decoded.UserInfo.id;
            //console.log(decoded.UserInfo.id);
            next();
        }
    )
}

export default verifyJWT;