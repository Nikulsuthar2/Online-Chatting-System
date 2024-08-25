import User from "../models/userSchema.js";


const handleGetStatus = async (req, res) => {
    const {id} = req.query;
    if(!id) return res.status(400).json({"res":false,"msg":"id is required"});

    const foundUser = await User.findOne({"_id":id}).exec();
    if(!foundUser) return res.status(409).json({"res":false,"msg":"User not found"});
    res.status(200).json({"res":true,"status":foundUser.status});
}

const handleSetStatus = async (req, res) => {
    const {id, status} = req.body;
    if(!id) return res.status(400).json({"res":false,"msg":"id is required"});

    const foundUser = await User.findOne({"_id":id}).exec();
    if(!foundUser) return res.status(409).json({"res":false,"msg":"User not found"});

    foundUser.status = status;
    foundUser.save();

    res.sendStatus(204);
}

export {handleGetStatus, handleSetStatus}