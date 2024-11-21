import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "react-toastify/ReactToastify.css";
import { getUserData } from "../utils/userDataApi";
import { getAllChats, getAllMsgs, sendSeenStatus } from "../utils/userChatApi";
import AllChatList from "../components/AllChatList";
import '../assets/myCustomStyle.css';
import { UserContext } from "../Context/UserContext";

const HomePage = () => {
  const { user, setUser } = useContext(UserContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [uid, setUid] = useState(null);
  
  const [chatUsers, setChatUsers] = useState(null);
  const [currentUserMsgs, setCurrentUserMsgs] = useState(null);
  const navigate = useNavigate();

  const fetchChatData = async () => {
    const res = await getAllChats();
    if (res) {
      //console.log(res);
      setChatUsers(res);
    }
  };

  const handleUserData = async (id) => {
    const data = await getUserData();
    //console.log(data.user[0]);
    setUser(data.user[0]);
  };

  useEffect(() => {
    handleUserData();
    fetchChatData();
    const interval = setInterval(async () => {
      fetchChatData();
    }, 1500);
    return () => clearInterval(interval);
  }, [uid]);

  const handleCurrentChat = async (uid) => {
    /*setSearchParams(new URLSearchParams());
    sessionStorage.removeItem("msgs");
    setUid(uid);
    const res = await sendSeenStatus(uid);
    console.log("seen status",res);*/
    navigate(`/chat/${uid}`)
  };

  return (
    <div className=" pt-[60px] dark:bg-black dark:text-white pb-[10px] flex flex-col h-full overflow-auto scrollbar-hide">
      <div id="header" className="bg-white dark:bg-black px-[15px] py-[15px] text-md font-semibold">
        All Chats
      </div>
      <AllChatList chatUsers={chatUsers} onChatClick={handleCurrentChat} />
      {/* <ToastContainer position="bottom-right" theme="colored" /> */}
    </div>
  );
};

export default HomePage;
