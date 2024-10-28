import axios from "axios";
import { isLoggedIn, isTokenExpired, refreshAccessToken } from "./userApis";

const getUserStatus = async (uid) => {
  if (isLoggedIn) {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "user/status",
        {
          params: {
            id: uid,
          },
          headers: {
            Authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      return res.data.status;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
};

const setUserStatus = async (uid, status) => {
  if (isLoggedIn) {
    const token = localStorage.getItem("accessToken");
    if (uid) {
      try {
        const res = await axios.put(
          import.meta.env.VITE_BACKEND_URL + "user/status",
          {
            id: uid,
            status: status,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        return res.data.status;
      } catch (err) {
        console.log(err);
        return false;
      }
    } else {
      console.log("uid in sendstatus is ", uid);
    }
  }
};

const getSearchUsers = async (search) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) refreshAccessToken();
  token = localStorage.getItem("accessToken");
  try {
    const res = await axios.get(
      import.meta.env.VITE_BACKEND_URL + "user/searchusers",
      {
        params: {
          search: search ?? "",
        },
        headers: {
          Authorization: token,
        },
      }
    );
    return res;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getUserData = async (uid = "") => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) await refreshAccessToken();
  token = localStorage.getItem("accessToken");
  try {
    const res = await axios.get(
      import.meta.env.VITE_BACKEND_URL + "user/userdata/" + uid,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const sendFriendRequest = async (uid) => {
  if (isLoggedIn) {
    const token = localStorage.getItem("accessToken");
    if (uid) {
      try {
        const res = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "user/sendfriendrequest",
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
        return false;
      }
    } else {
      console.log("uid in sendstatus is ", uid);
    }
  }
};

const cancelFriendRequest = async (uid, isUser) => {
 
  if (isLoggedIn) {
    const token = localStorage.getItem("accessToken");
    if (uid) {
      try {
        
        const res = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "user/cancelfriendrequest",
          {
            id: uid,
            isUser:isUser
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
        return false;
      }
    } else {
      console.log("uid in sendstatus is ", uid);
    }
  }
};

const acceptFriendRequest = async (uid) => {
  if (isLoggedIn) {
    const token = localStorage.getItem("accessToken");
    if (uid) {
      try {
        const res = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "user/acceptfriendrequest",
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
        return false;
      }
    } else {
      console.log("uid in accept friend is ", uid);
    }
  }
};

const getTotalFriendRequests = async () => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) await refreshAccessToken();
  token = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "user/totalfriendrequests",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return res.data;
    } catch (err) {
      //console.log(err);
      return err;
    }
};

const getAllFriendRequests = async () => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) await refreshAccessToken();
  token = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "user/getAllFriendRequest",
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


const getAllFriends = async () => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) await refreshAccessToken();
  token = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "user/getAllFriends",
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

const removeFriend = async (uid) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) await refreshAccessToken();
  token = localStorage.getItem("accessToken");
  if (uid) {
    try {
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "user/removefriend",
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
      return false;
    }
  } else {
    console.log("uid in remove friend is ", uid);
  }
}

const getAllBlockedUser = async () => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) await refreshAccessToken();
  token = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "user/getAllBlockedUser",
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

const blockUser = async (uid) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) await refreshAccessToken();
  token = localStorage.getItem("accessToken");
  if (uid) {
    try {
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "user/blockuser",
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
      return false;
    }
  } else {
    console.log("uid in block user is ", uid);
  }
}

const unblockUser = async (uid) => {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) await refreshAccessToken();
  token = localStorage.getItem("accessToken");
  if (uid) {
    try {
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "user/unblockuser",
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
      return false;
    }
  } else {
    console.log("uid in block user is ", uid);
  }
}

export {
  getUserStatus,
  setUserStatus,
  getSearchUsers,
  getUserData,
  sendFriendRequest,
  acceptFriendRequest,
  cancelFriendRequest,
  getTotalFriendRequests,
  getAllFriendRequests,
  getAllFriends,
  removeFriend,
  getAllBlockedUser,
  blockUser,
  unblockUser
};
