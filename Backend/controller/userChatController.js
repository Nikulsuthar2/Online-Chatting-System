import mongoose from "mongoose";
import Chat from "../models/chatSchema.js";

const handleSendTextMessage = async (req, res) => {
  const { uid, msg } = req.body;
  if (uid) {
    try {
      const newMsg = {
        senderid: new mongoose.Types.ObjectId(req.user),
        receiverid: new mongoose.Types.ObjectId(uid),
        msg: msg,
      };
      
      const chat = await Chat.create(newMsg);
      console.log(chat);
      res.status(200).json({ result: true, data: "Message Sent" });
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

const handleGetAllChats = async (req, res) => {
  const uid = req.user;
  const currentUid = new mongoose.Types.ObjectId(uid);
  try {
    const chat = await Chat.aggregate([
      {$match:{ $or:[{senderid: currentUid},{receiverid: currentUid}]}},
      {$project:{
        otherUser:{
          $cond:{
            if: {$eq:['$senderid',currentUid]},
            then:'$receiverid',
            else:'$senderid'
          }
        },
        isOur:{
          $cond:{
            if: {$eq:['$senderid',currentUid]},
            then:true,
            else:false
          }
        },
        msg:'$msg',
        seen:'$seen',
        timeSent:'$timeSent'
      }},
      {$sort:{timeSent:-1}},
      {$group:{
        _id:'$otherUser',
        latestMessage:{$first:'$$ROOT.msg'},
        latestMsgSeen:{$first:'$$ROOT.seen'},
        isOur:{$first:'$$ROOT.isOur'},
        latestMsgTimeSent:{$first:'$$ROOT.timeSent'},
      }},
      {$lookup:{
        from:'users',
        localField:'_id',
        foreignField:'_id',
        as:'userDetails'
      }},
      {$unwind:'$userDetails'},
      {$sort:{'latestMsgTimeSent':-1}},
      {$project:{
        _id:0,
        userid:'$userDetails._id',
        name:'$userDetails.name',
        username:'$userDetails.username',
        profileimg:'$userDetails.profileimg',
        status:'$userDetails.status',
        latestMessage:'$latestMessage',
        latestMsgSeen:'$latestMsgSeen',
        latestMsgTimeSent:'$latestMsgTimeSent',
        isOur:'$isOur'
      }}
    ]);
    const chatUsers = chat.map(data=>data.userid);
    const Data = chat;
    //console.log(Data)
    Data.forEach(elem=>{
      elem.newMsg = 0;
    })
    const promises = chatUsers.map(async (data) => {
      const res = await Chat.aggregate([
        {$match:{$or:[{senderid: currentUid, receiverid:data},{senderid: data, receiverid:currentUid}]}},
        {$match:{senderid:data,seen:false}},
      ]);
      Data.forEach(elem=>{
        if(elem.userid.toString() == data.toString()){
          elem.newMsg = res.length;
        }
      });
    })
    await Promise.all(promises);
    //console.log(Data);
    res.status(200).json(Data)
  } catch (error) {
    console.log(error);
    res.status(500).json({ result: false, data: error });
  }
};

const handleGetMessages = async (req, res) => {
  const { id } = req.body;
  try {
    //const chat = await Chat.find({ $or:[{senderid: req.user, receiverid:id},{senderid: id, receiverid:req.user}]}).exec();
    const chat = await Chat.aggregate([
      {$match:{ $or:[{senderid: new mongoose.Types.ObjectId(req.user), receiverid:new mongoose.Types.ObjectId(id)},{senderid: new mongoose.Types.ObjectId(id), receiverid:new mongoose.Types.ObjectId(req.user)}]}},
      {$addFields:{
        isOur:{
          $cond:{
            if: {$eq:['$senderid',new mongoose.Types.ObjectId(req.user)]},
            then:true,
            else:false
          }
        },
      }},
    ]);
    res
      .status(200)
      .json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ result: false, data: error });
  }
};

const handleSeenStatus = async (req, res) => {
  const { id } = req.body;
  try {
    const chat = await Chat.updateMany(
      { senderid: id, receiverid: req.user, seen:false },
      { $set: { seen: true } }
    );
    //console.log(chat);
    res.status(200).json({ result: true, data: "seen updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export {
  handleSendTextMessage,
  handleGetAllChats,
  handleGetMessages,
  handleSeenStatus,
};
