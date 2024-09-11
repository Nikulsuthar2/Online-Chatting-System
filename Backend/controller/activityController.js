import Activity from "../models/userActivitySchema.js";

const handleTypingStatus = async (req, res) => {
  const { id, istyping } = req.body;
  const currid = req.user;

  if (id) {
    await Activity.updateOne(
      { senderid: currid, receiverid: id },
      { $set: { isTyping: istyping } },
      { upsert: true }
    );
    res.status(200).json({ result: true, data: "seen updated" });
  } else {
    res.status(500).json({ msg: "please provide id" });
  }
};

const handleGetTypingStatus = async (req, res) => {
  const { id } = req.body;
  const currid = req.user;

  if (id) {
    const typing = await Activity.find({ senderid: id, receiverid: currid })
      .select("isTyping")
      .exec();
    res.status(200).json({ result: true, data: typing });
  } else {
    res.status(500).json({ msg: "please provide id" });
  }
};

export { handleTypingStatus, handleGetTypingStatus };
