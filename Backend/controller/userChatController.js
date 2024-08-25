import mongoose from "mongoose";
import Chat from "../models/chatSchema.js";

const handleSendTextMessage = async (req, res) => {
  const { uid, msg } = req.body;
  if (uid) {
    try {
      const newOurMsg = {
        senderid: req.user,
        isOurMsg: true,
        msg: msg,
      };
      Chat.findOne({ uid: req.user, "chatUser.chatUid": uid })
        .then((doc) => {
          // if chatUser exist
          if (doc) {
            return Chat.findOneAndUpdate(
              { uid: req.user, "chatUser.chatUid": uid },
              { $push: { "chatUser.$.messages": newOurMsg } },
              { new: true }
            );
          }
          //if chatUser not exist
          else {
            return Chat.findOneAndUpdate(
              { uid: req.user },
              { $push: { chatUser: { chatUid: uid, messages: [newOurMsg] } } },
              { upsert: true, new: true }
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });

      const newTheirMsg = {
        senderid: req.user,
        isOurMsg: false,
        msg: msg,
      };
      Chat.findOne({ uid: uid, "chatUser.chatUid": req.user })
        .then((doc) => {
          // if chatUser exist
          if (doc) {
            return Chat.findOneAndUpdate(
              { uid: uid, "chatUser.chatUid": req.user },
              { $push: { "chatUser.$.messages": newTheirMsg } },
              { new: true }
            );
          }
          //if chatUser not exist
          else {
            return Chat.findOneAndUpdate(
              { uid: uid },
              {
                $push: {
                  chatUser: { chatUid: req.user, messages: [newTheirMsg] },
                },
              },
              { upsert: true, new: true }
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
      res.status(200).json({ result: true, data: "Message Sent" });
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

const handleGetAllChats = async (req, res) => {
  const uid = req.user;
  try {
    const chat = await Chat.findOne({ uid: uid })
      .select("chatUser")
      .populate("chatUser.chatUid", "name username profileimg status")
      .catch((err) => {
        console.log(err);
      });
    res.status(200).json({ result: true, data: chat });
  } catch (error) {
    console.log(error);
    res.status(500).json({ result: false, data: error });
  }
};

const handleGetMessages = async (req, res) => {
  const {id} = req.body;
  try {
    const chat = await Chat.findOne({ uid: req.user }).select('chatUser');
    res.status(200).json({ result: true, data: chat.chatUser.find(item => item.chatUid.toString() == id) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ result: false, data: error });
  }
};

export { handleSendTextMessage, handleGetAllChats, handleGetMessages };
