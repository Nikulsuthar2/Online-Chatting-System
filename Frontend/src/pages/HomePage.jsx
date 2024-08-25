import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { getUserData } from "../utils/userDataApi";
import { getAllChats, getAllMsgs, sendTextMsg } from "../utils/userChatApi";
import { format } from "date-fns";
import { FaShare } from "react-icons/fa6";
import UserStatusDot from "../components/UserStatusDot";
import AllChatList from "../components/AllChatList";
import ChatBoxUi from "../components/ChatBoxUi";

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [uid, setUid] = useState(null);
  const [userData, setUserData] = useState(null);
  const [chatUsers, setChatUsers] = useState(null);
  const [currentUserMsgs, setCurrentUserMsgs] = useState(null);

  

  const fetchUserData = async () => {
    const res = await getUserData(uid);
    if (res) {
      setUserData(res.user);
      fetchMessages(uid);
    }
  };

  const fetchChatData = async () => {
    const res = await getAllChats();
    if (res) {
      setChatUsers(res.data.chatUser);
    }
  };

  const fetchMessages = async (uid) => {
    const res = await getAllMsgs(uid);
    if (res) {
      if (
        JSON.stringify(res.data.messages) !== sessionStorage.getItem("msgs")
      ) {
        console.log("ya its diffrent");
        setCurrentUserMsgs(res.data.messages);
        sessionStorage.setItem("msgs", JSON.stringify(res.data.messages));
      }
    }
  };

  useEffect(() => {
    if (uid != null) {
      fetchUserData();
      //fetchMessages(uid);
    }
    fetchChatData();
    const interval = setInterval(async () => {
      if (uid != null) {
        fetchUserData();
        //fetchMessages(uid);
      }
      fetchChatData();
    }, 1500);
    if(searchParams.get("id")){ 
      handleCurrentChat(searchParams.get("id"))
    }
    return () => clearInterval(interval);
  }, [uid]);

  const handleCurrentChat = async (uid) => {
    setSearchParams(new URLSearchParams());
    sessionStorage.removeItem("msgs");
    setUid(uid);
  };

  return (
    <div className="pt-14 flex h-screen">
      <AllChatList chatUsers={chatUsers} onChatClick={handleCurrentChat} />
      <div className="w-[70%] bg-slate-50">
        {uid && userData ? (
          <ChatBoxUi userData={userData} currentUserMsgs={currentUserMsgs} />
        ) : (
          <div className="flex justify-center items-center gap-1 h-full text-xl">
            <p>Start Chatting</p>
            <Link to={"/home/friends/0"} className="text-blue-400 underline">
              {" "}
              here
            </Link>
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
};

export default HomePage;
