import User from '../models/userSchema.js'

const handleUsernameChack = async (req, res) => {
    console.log(req.url);
    const username = req.params.uid;
    if(!username || username.trim() == ""){
        res.status(200).json({"result":false, "msg":"Please enter a username"});
    } else {
        const findUsername = await User.findOne({username:username.toLowerCase()}).exec();
        if(findUsername){
            res.status(200).json({"result":false, "msg":`${username} is not available`});
        } else {
            res.status(200).json({"result":true, "msg":`${username} is available`});
        }
    }
}

export default handleUsernameChack;