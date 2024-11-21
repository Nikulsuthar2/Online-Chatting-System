import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { decodeJWT, isLoggedIn } from "../utils/userApis";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import {
  blockUser,
  cancelFriendRequest,
  getUserData,
  sendFriendRequest,
  setUserStatus,
  unblockUser,
} from "../utils/userDataApi";
import {
  MdArrowBack,
  MdAttachFile,
  MdBlock,
  MdCancel,
} from "react-icons/md";
import {
  getAllChats,
  getAllMsgs,
  sendSeenStatus,
  sendTextMsg,
} from "../utils/userChatApi";
import {
  FaPaperPlane,
  FaUserMinus,
  FaUserPlus,
} from "react-icons/fa6";
import "../assets/myCustomStyle.css";
import { format } from "date-fns";
import UserStatusDot from "../components/UserStatusDot";
import { getTypingStatus, sendTypingStatus } from "../utils/userActivityApi";
import profiledef from "../assets/default_img/profiledef.png";
import EmojiPicker from "../components/EmojiPicker";
import BlockedUserWarning from "../components/BlockedUserWarning";
import MessageList from "../components/MessageList";

const ChatPage = () => {
  const { id } = useParams();
  const [txtMsg, setTxtMsg] = useState("");
  const [userData, setUserData] = useState(null);
  const [currentUserMsgs, setCurrentUserMsgs] = useState(null);
  const chatContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const chatInputBoxRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [isNewMsgFromOther, setisNewMsgFromOther] = useState(false);
  const [newMsgDataFromOther, setnewMsgDataFromOther] = useState(null);
  const [isReplying, setIsReplying] = useState(false);
  const [replyData, setReplyData] = useState(null);


  const navigate = useNavigate();

  const handleTypingStatus = (uid) => {
    if (!isTyping) {
      setIsTyping(true);
      sendTypingStatus(uid, true);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingStatus(uid, false);
    }, 2000);
  };

  const getUserTypingStatus = async (uid) => {
    const res = await getTypingStatus(uid);
    if (res && res.data.length > 0) {
      //console.log(res.data[0].isTyping);
      setIsOtherUserTyping(res.data[0].isTyping);
    }
  };

  const fetchUserData = async (uid) => {
    //console.log("val:"+uid);
    const res = await getUserData(uid);
    if (res) {
      setUserData(res.user[0]);
      // console.log(res.user[0])
      fetchMessages(uid);
      getUserTypingStatus(uid);
    }
  };

  const fetchMessages = async (uid) => {
    const res = await getAllMsgs(uid);
    //console.log(res)
    if (res) {
      if (JSON.stringify(res) !== sessionStorage.getItem("msgs")) {
        await sendSeenStatus(uid);

        //console.log("ya its diffrent");
        setCurrentUserMsgs(res);
        console.log(res);
        sessionStorage.setItem("msgs", JSON.stringify(res));
      }
    }
  };

  const handleSendMessage = async () => {
    if (txtMsg != "") {
      const res = await sendTextMsg(
        userData._id,
        txtMsg,
        isReplying,
        replyData
      );
      setIsReplying(false);
      setReplyData(null);
      //console.log(res);
      setTxtMsg("");
    }
  };

  const handleSendFriendRequest = async (uid) => {
    const res = await sendFriendRequest(uid);
    if (res.result) {
      toast.success("Friend Request Sent");
    }
  };

  const handleFetchNewChatMsg = async (uid) => {
    const res = await getAllChats();
    if (res) {
      //console.log(res[0])
      if (
        res.length > 0 &&
        res[0].userid != uid &&
        res[0].isOur == false &&
        res[0].latestMsgSeen == false
      ) {
        // console.log("new message from other");
        // console.log(res[0]);
        setisNewMsgFromOther(true);
        setnewMsgDataFromOther(res[0]);
      }
      // toast.success("Friend Request Sent");
    }
  };

  const handleCancelFriendRequest = async (uid) => {
    const res = await cancelFriendRequest(uid, false);
    if (res.result) {
      toast.success("Friend Request Cancel");
    }
  };

  const handleBlockUser = async (uid) => {
    const res = await blockUser(uid);
    if (res.result) {
      toast.success("User Blocked");
    }
  };
  const handleUnBlockUser = async (uid) => {
    const res = await unblockUser(uid);
    if (res.result) {
      toast.success("User Unblocked");
    }
  };

  const reply = (data) => {
    setIsReplying(true);
    setReplyData(data);
    console.log(data);
  };

  const addEmoji = (emoji) => {
    setTxtMsg((prev) => prev + emoji);
  };

  useEffect(() => {
    setisNewMsgFromOther(false);
    sessionStorage.removeItem("msgs");
    const token = localStorage.getItem("accessToken");
    const decoded = decodeJWT(token);
    const isLogin = async () => {
      const res = await isLoggedIn(token);
      if (!res) {
        navigate("/login");
      }
    };
    isLogin();
    fetchUserData(id);
    const interval = setInterval(async () => {
      fetchUserData(id);
      handleFetchNewChatMsg(id);
    }, 1500);
    return () => clearInterval(interval);
  }, [, id]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [currentUserMsgs]);

  return (
    <div className="h-screen w-full flex justify-center items-center bg-[#F5F5F5] dark:bg-[#1a1a1a]">
      <div className="relative w-full h-full border-solid bg-white border-gray-200 dark:border-[#3f3f3f] border-[1px] shadow-lg md:rounded-3xl overflow-hidden md:min-w-[400px] md:max-w-[400px] md:h-[90%]">
        {userData ? (
          <nav className="bg-[#ffffffa6] dark:bg-[#ffffff29] dark:text-white dark:border-[#3f3f3f] absolute top-0 left-0 z-40 px-[10px] py-[10px] w-full flex justify-between items-center border-b-[1px] backdrop-blur-md">
            <div className="flex gap-[10px] items-center">
              <button
                onClick={() => navigate("/home")}
                className="h-[40px] w-[40px] text-white dark:text-black bg-black dark:bg-white hover:bg-slate-700 dark:hover:bg-slate-200 rounded-[15px] flex justify-center items-center cursor-pointer active:translate-y-1"
              >
                <MdArrowBack size={25} />
              </button>
              <img
                src={
                  userData && !userData.heBlockedMe
                    ? `${import.meta.env.VITE_BACKEND_URL}${
                        userData.profileimg
                      }`
                    : profiledef
                }
                alt=""
                className="h-[40px] w-[40px] rounded-[15px] aspect-square object-cover"
              />
              <div className="flex flex-col leading-none">
                <span className="font-bold">{userData.name}</span>
                <span className="text-sm flex gap-1">
                  @{userData.username}
                  <span>
                    {isOtherUserTyping && userData.isFriend ? (
                      <span className="text-green-500">Typing...</span>
                    ) : userData.isFriend ? (
                      <UserStatusDot status={userData.status} isDot={false} />
                    ) : (
                      ""
                    )}
                  </span>
                </span>
              </div>
            </div>
            {!userData.isFriend ? (
              !userData.isRequested ? (
                !userData.iBlockedHim ? (
                  <div className="flex gap-[10px]">
                    {!userData.heBlockedMe ? (
                      <button
                        onClick={() => handleSendFriendRequest(userData._id)}
                        className="h-[40px] w-[40px] text-black bg-[#F1F1F1] hover:bg-slate-200 rounded-[15px] flex justify-center items-center cursor-pointer active:translate-y-1"
                      >
                        <FaUserPlus size={25} />
                      </button>
                    ) : (
                      ""
                    )}
                    <button
                      onClick={() => handleBlockUser(userData._id)}
                      className="h-[40px] px-2 gap-1 text-white bg-red-500 hover:bg-red-700 rounded-[15px] flex justify-center items-center cursor-pointer active:translate-y-1"
                    >
                      <MdBlock size={25} /> Block
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleUnBlockUser(userData._id)}
                    className="h-[40px] px-2 gap-1 text-red-500 bg-gray-100 hover:bg-red-700 rounded-[15px] flex justify-center items-center cursor-pointer active:translate-y-1"
                  >
                    <MdBlock size={25} /> Unblock
                  </button>
                )
              ) : (
                <button
                  onClick={() => handleCancelFriendRequest(userData._id)}
                  className="h-[40px] w-[40px] text-black bg-[#F1F1F1] hover:bg-slate-200 rounded-[15px] flex justify-center items-center cursor-pointer active:translate-y-1"
                >
                  <FaUserMinus size={25} />
                </button>
              )
            ) : (
              ""
            )}
          </nav>
        ) : (
          ""
        )}
        <div
          ref={chatContainerRef}
          className="h-full dark:bg-black dark:text-white overflow-scroll flex flex-col gap-2 pt-[70px] pb-[70px] scrollbar-hide "
        >
          <BlockedUserWarning userData={userData} handleBlockUser={handleBlockUser}/>
          <MessageList  userData={userData} currentUserMsgs={currentUserMsgs} handleReply={reply}  />
        </div>
        <div className="bg-[#ffffff29] dark:bg-[#ffffff29] absolute bottom-0 left-0 z-40 px-[10px] py-[10px] w-full flex justify-between items-center gap-[10px] border-t-[1px] dark:border-[#3f3f3f] backdrop-blur-md">
          <div
            className="flex flex-col gap-2 text-black bg-[#F5F5F5] dark:bg-[#141414] border-solid border-gray-200 dark:border-[#3f3f3f]  border-[1px] py-2 px-2 rounded-[15px] w-full h-auto"
          >
            {isReplying && replyData ? (
              <div className="flex items-center justify-between gap-2 bg-gray-200 dark:bg-gray-700 dark:text-white p-2 rounded-[10px] border-l-4 border-green-500">
                <div className="flex flex-col">
                  <span className="text-sm text-green-500 font-semibold">
                    {replyData.isOur ? "You" : userData.name}
                  </span>
                  <span>{replyData.msg}</span>
                </div>
                <MdCancel
                  size={25}
                  onClick={() => {
                    setIsReplying(false);
                    setReplyData(null);
                  }}
                />
              </div>
            ) : (
              ""
            )}
            <div className="flex items-end gap-2 ">
              <EmojiPicker onEmojiSelect={addEmoji} />
              <textarea
                className="scrollbar-hide resize-none overflow-hidden leading-relaxed outline-none w-full bg-transparent"
                rows={1}
                type="text"
                value={txtMsg}
                onKeyUp={(e) => handleTypingStatus(userData._id)}
                onChange={(e) => setTxtMsg(e.target.value)}
                placeholder="Enter Your Messages..."
                disabled={
                  (userData && userData.iBlockedHim) ||
                  (userData && userData.heBlockedMe)
                }
              ></textarea>
              <MdAttachFile className="text-2xl dark:text-white cursor-pointer" />
            </div>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={
              (userData && userData.iBlockedHim) ||
              (userData && userData.heBlockedMe)
            }
            className="h-[40px] text-white bg-black px-4 hover:bg-slate-700 rounded-[15px] flex justify-center items-center cursor-pointer active:translate-y-1"
          >
            <FaPaperPlane size={20} />
          </button>
        </div>
      </div>
      {isNewMsgFromOther ? (
        <Link
          onClick={() => navigate("/chat/" + newMsgDataFromOther.userid)}
          className="w-[20%] absolute bottom-4 right-4 flex flex-col gap-4 p-4 bg-white border-gray-200 border-[1px] shadow-lg rounded-3xl"
        >
          <div className="flex gap-2 justify-between items-center">
            <div className="flex gap-2 items-center">
              <img
                src={
                  import.meta.env.VITE_BACKEND_URL +
                  newMsgDataFromOther.profileimg
                }
                className="h-[40px] w-[40px] rounded-[15px] aspect-square object-cover"
              />
              <div className="flex flex-col">
                <span className="font-bold">{newMsgDataFromOther.name}</span>
                <span className="text-sm font-semibold">
                  @{newMsgDataFromOther.username}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span>
                {format(
                  new Date(newMsgDataFromOther.latestMsgTimeSent),
                  "h:mm a"
                )}
              </span>
              <span className="w-[20px] h-[20px] text-white flex justify-center items-center bg-red-500 rounded-full">
                {newMsgDataFromOther.newMsg}
              </span>
            </div>
          </div>
          <div className="text-sm font-bold text-red-500">New Message!</div>
          <div className="flex justify-between items-center">
            <span className="text-lg">{newMsgDataFromOther.latestMessage}</span>
          </div>
        </Link>
      ) : (
        ""
      )}
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default ChatPage;
