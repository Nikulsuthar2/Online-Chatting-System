import axios from "axios";
import { isLoggedIn, isTokenExpired, refreshAccessToken } from "./userApis";

const getAllChats = async () => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) await refreshAccessToken();
  token = localStorage.getItem("accessToken");
  try {
    const res = await axios.get(
      import.meta.env.VITE_BACKEND_URL + "chat/getAllChats",
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getAllMsgs = async (uid) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) await refreshAccessToken();
  token = localStorage.getItem("accessToken");
  try {
    const res = await axios.post(
      import.meta.env.VITE_BACKEND_URL + "chat/getMassages",
      {
        id: uid,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const sendTextMsg = async (id, message, isReply = false, replyData = null) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) await refreshAccessToken();
  token = localStorage.getItem("accessToken");
  try {
    const res = await axios.post(
      import.meta.env.VITE_BACKEND_URL + "chat/sendTextMsg",
      {
        uid: id,
        msg: message,
        isReply: isReply,
        replyData: replyData
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const sendSeenStatus = async (id) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) await refreshAccessToken();
  token = localStorage.getItem("accessToken");
  try {
    const res = await axios.post(
      import.meta.env.VITE_BACKEND_URL + "chat/setSeenStatus",
      {
        id: id,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const sendReaction = async (msgid, emoji) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) await refreshAccessToken();
  token = localStorage.getItem("accessToken");
  try {
    const res = await axios.post(
      import.meta.env.VITE_BACKEND_URL + "chat/reactMsg/"+msgid,
      {
        emoji: emoji,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export { getAllChats, getAllMsgs, sendTextMsg, sendSeenStatus, sendReaction };
