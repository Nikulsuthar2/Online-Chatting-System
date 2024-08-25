import bcrypt from 'bcrypt'
import User from '../models/userSchema.js';
import jwt from 'jsonwebtoken'


const handleNewUser = async (req, res) => {
    const {username, email, name, pswd} = req.body;
    if(!username || !email || !pswd) return res.status(400).json({"success":false,"msg":"Username, email and password are required"});
    
    //check for already exist
    const duplicate = await User.findOne({email}).exec();
    if(duplicate) return res.status(409).json({"success":false,"msg":"Email already exist"}); //conflict

    try {
        // encrypt the password
        const hashedPWD = await bcrypt.hash(pswd, 10);

        // store new user
        const newUser = {
            "name":name ?? "User",
            "username":username, 
            "email": email,
            "password":hashedPWD,
            "profileimg":req.file.path,
            "friends":[],
            "requests":[]
        };
        
        const result = await User.create(newUser);

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "id":result._id,
                    "username": result.username,
                    "roles": result.roles,
                    "profileimg":req.file.path
                }
            },
            process.env.ACCESS_TOKEN_SECRAT,
            {expiresIn: '120s'}
        );
        const refreshToken = jwt.sign(
            {"username": result.username, "id": result._id,"profileimg":req.file.path},
            process.env.REQUEST_TOKEN_SECRAT,
            {expiresIn: '1d'}
        ); 

        result.refreshToken = refreshToken;
        await result.save();


        //console.log(result);
        res.cookie("jwt", refreshToken, {httpOnly:true, sameSite: 'None', secure: true, maxAge: 24*60*60*1000})
        res.status(201).json({"success":true,"msg":"New User Created","token":accessToken});
    } catch (err) {
        res.status(500).json({"success":false,"msg":err.message});
    }   
}

export default handleNewUser;