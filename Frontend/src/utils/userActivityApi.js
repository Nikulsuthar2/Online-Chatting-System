import axios from "axios";
import { isLoggedIn, isTokenExpired, refreshAccessToken } from "./userApis";

const sendTypingStatus = async (id, isTyping) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) await refreshAccessToken();
  token = localStorage.getItem("accessToken");
  try {
    const res = await axios.post(
      import.meta.env.VITE_BACKEND_URL + "activity/sendTypingStatus",
      {
        id: id,
        istyping: isTyping,
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

const getTypingStatus = async (id) => {
    let token = localStorage.getItem("accessToken");
    if (isTokenExpired(token)) await refreshAccessToken();
    token = localStorage.getItem("accessToken");
    try {
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "activity/getTypingStatus",
        {
          id: id
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

export { sendTypingStatus, getTypingStatus };
