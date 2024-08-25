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

const sendTextMsg = async (id, message) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) await refreshAccessToken();
  token = localStorage.getItem("accessToken");
  try {
    const res = await axios.post(
      import.meta.env.VITE_BACKEND_URL + "chat/sendTextMsg",
      {
        uid: id,
        msg: message
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

export { getAllChats, getAllMsgs, sendTextMsg };