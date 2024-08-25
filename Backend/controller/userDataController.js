import mongoose from "mongoose";
import User from "../models/userSchema.js";

const handleSearchUser = async (req, res) => {
  const { search } = req.query;
  if (!search)
    return res
      .status(400)
      .json({ result: false, data: "no search query provided" });

  //const users = await User.find({username:new RegExp("^"+ search)}).select({username:1,name:1,profileimg:1,status:1}).exec();
  const frires = (
    await User.findById(req.user).select("friends").exec()
  ).friends.map((ids) => new mongoose.Types.ObjectId(ids));
  const reqres = (
    await User.find({ requests: req.user.toString() }).select("_id").exec()
  ).map((ids) => new mongoose.Types.ObjectId(ids._id));
  //console.log(reqres)
  const users = await User.aggregate([
    {
      $match: {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
        ],
      },
    },
    {
      $addFields: {
        isFriend: {
          $in: ["$_id", frires ?? []],
        },
        isRequested: {
          $in: ["$_id", reqres ?? []],
        },
        isCurrentUser: {
          $eq: ["$_id", new mongoose.Types.ObjectId(req.user)],
        },
      },
    },
    {
      $project: {
        email: 0,
        password: 0,
        friends: 0,
        requests: 0,
        roles: 0,
        createdAt: 0,
        __v: 0,
        refreshToken: 0,
      },
    },
  ]);

  //console.log(users)
  if (users) {
    res.status(200).json(users);
  }
};

const handleGetUserData = async (req, res) => {
  let id = req.params.id;
  if (!id) {
    id = req.user;
  }
  if (!id)
    return res.status(404).json({ result: false, msg: "User not found" });
  try {
    const user = await User.findOne({ _id: id })
      .select({ username: 1, name: 1, profileimg: 1, status: 1, createdAt: 1 })
      .exec();
    res.status(200).json({ user });
  } catch (error) {
    res.status(501).json(error);
  }
};

const handleGetTotalRequests = async (req, res) => {
  if (!req.user)
    return res.status(404).json({ result: false, msg: "No ID for requests" });
  try {
    const result = await User.findById(req.user).select("requests").exec();
    //console.log(result.requests.length,result)
    res.status(200).json({ result: true, msg: result.requests.length });
  } catch (error) {
    res.status(500).json(error);
  }
};

const handleAddFriendRequest = async (req, res) => {
  let id = req.body.id;
  if (!id || id == req.user)
    return res
      .status(404)
      .json({ result: false, msg: "No ID in friend request" });
  try {
    const requests = await User.updateOne(
      { _id: id },
      { $addToSet: { requests: req.user } }
    ).exec();
    res.status(200).json({ result: true, msg: "Friend Request Sent" });
  } catch (error) {
    res.status(501).json(error);
  }
};

const handleCancelFriendRequest = async (req, res) => {
  let id = req.body.id;
  if (!id)
    return res
      .status(404)
      .json({ result: false, msg: "No ID in friend request" });
  try {
    const requests = await User.updateOne(
      { _id: req.user },
      { $pull: { requests: id.toString()} }
    ).exec();
    res.status(200).json({ result: true, msg: "Friend Request Cancelled" });
  } catch (error) {
    res.status(501).json(error);
  }
};

const handleAcceptFriendRequest = async (req, res) => {
  let { id } = req.body;
  if (!id)
    return res
      .status(404)
      .json({ result: false, msg: "No ID in friend request" });
  try {
    const friends = await User.updateOne(
      { _id: req.user },
      { $addToSet: { friends: id.toString() } }
    ).exec();
    const friends2 = await User.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $addToSet: { friends: req.user } }
    ).exec();
    const requested = await User.updateOne(
      { _id: req.user },
      { $pull: { requests: id } }
    ).exec();
    res.status(200).json({ result: true, msg: "Friend Request Accepted" });
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const handleGetAllFriendRequest = async (req, res) => {
  if (!req.user)
    return res.status(404).json({ result: false, msg: "No ID for requests" });
  try {
    const resultID = (
      await User.findById(req.user).select("requests").exec()
    ).requests.map((uid) => new mongoose.Types.ObjectId(uid));
    //console.log(resultID)
    const requestusers = await User.find({ _id: { $in: resultID } })
      .select({ username: 1, name: 1, profileimg: 1, status: 1 })
      .exec();
    res.status(200).json(requestusers);
  } catch (error) {
    res.status(500).json(error);
  }
};

const handleGetAllFriends = async (req, res) => {
  if (!req.user)
    return res.status(404).json({ result: false, msg: "No ID for requests" });
  try {
    const resultID = (
      await User.findById(req.user).select("friends").exec()
    ).friends.map((uid) => new mongoose.Types.ObjectId(uid));
    //console.log(resultID)
    const requestusers = await User.find({ _id: { $in: resultID } })
      .select({ username: 1, name: 1, profileimg: 1, status: 1 })
      .exec();
    res.status(200).json(requestusers);
  } catch (error) {
    res.status(500).json(error);
  }
};

const handleRemoveFriend = async (req, res) => {
  let { id } = req.body;
  if (!id)
    return res
      .status(404)
      .json({ result: false, msg: "No ID in remove friend" });
  try {
    const friends = await User.updateOne(
      { _id: req.user },
      { $pull: { friends: id.toString() } }
    ).exec();
    const friends2 = await User.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $pull: { friends: req.user } }
    ).exec();
    res.status(200).json({ result: true, msg: "Friend Removed" });
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

export {
  handleSearchUser,
  handleGetUserData,
  handleAddFriendRequest,
  handleAcceptFriendRequest,
  handleCancelFriendRequest,
  handleGetTotalRequests,
  handleGetAllFriendRequest,
  handleGetAllFriends,
  handleRemoveFriend,
};
