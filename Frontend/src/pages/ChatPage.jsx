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
  MdReplay,
  MdReply,
} from "react-icons/md";
import {
  getAllChats,
  getAllMsgs,
  sendSeenStatus,
  sendTextMsg,
} from "../utils/userChatApi";
import {
  FaPaperPlane,
  FaReply,
  FaUserMinus,
  FaUserPlus,
} from "react-icons/fa6";
import "../assets/myCustomStyle.css";
import { format } from "date-fns";
import UserStatusDot from "../components/UserStatusDot";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { getTypingStatus, sendTypingStatus } from "../utils/userActivityApi";
import profiledef from "../assets/default_img/profiledef.png";
import EmojiPicker from "../components/EmojiPicker";

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
  const [isHighlighted, setIsHighlighted] = useState(false);

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

  const addEmoji = (emoji) => {
    setTxtMsg((prev) => prev + emoji);
  };

  const reply = (data) => {
    setIsReplying(true);
    setReplyData(data);
    console.log(data);
  };

  const handleReplyScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      let previousSection = section.previousElementSibling.previousElementSibling;
      // Scroll smoothly to the section
      //section.scrollIntoView({ behavior: 'smooth' });

      if(previousSection != null)
        previousSection.scrollIntoView({ behavior: 'smooth' });
      else if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = section.getBoundingClientRect().top;
      }

      setIsHighlighted(id);

      // Remove the highlight after 2 seconds
      setTimeout(() => {
        setIsHighlighted(null);
      }, 2000);
    }
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

  let prevDiff;
  let prevCount = 0;

  return (
    <div className="h-screen w-full flex justify-center items-center bg-[#F5F5F5]">
      <div className="relative w-full h-full border-solid bg-white border-gray-200 border-[1px] shadow-lg md:rounded-3xl md:min-w-[400px] md:max-w-[400px] md:h-[90%]">
        {userData ? (
          <nav className="bg-[#ffffffa6] absolute top-0 left-0 z-10 px-[10px] py-[10px] w-full flex justify-between items-center border-b-[1px] backdrop-blur-md rounded-t-3xl">
            <div className="flex gap-[10px] items-center">
              <button
                onClick={() => navigate("/home")}
                className="h-[40px] w-[40px] text-white bg-black hover:bg-slate-700 rounded-[15px] flex justify-center items-center cursor-pointer active:translate-y-1"
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
          className="h-full rounded-3xl overflow-scroll flex flex-col gap-2 pt-[70px] pb-[70px] scrollbar-hide "
        >
          {userData &&
          !userData.isRequested &&
          !userData.isFriend &&
          !userData.iBlockedHim ? (
            <div className="flex justify-center">
              <div className="bg-red-500 shadow-xl p-4 rounded-2xl flex gap-2 flex-col">
                <p className="font-semibold text-white">
                  {userData.name} is not your friend
                </p>
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handleBlockUser(userData._id)}
                    className="px-2 py-1 text-sm w-full rounded-full bg-white font-bold text-red-500 flex gap-1 items-center justify-center active:translate-y-1"
                  >
                    <MdBlock size={15} /> Block
                  </button>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {userData && userData.iBlockedHim ? (
            <div className="h-full flex justify-center items-center font-bold flex-col text-xl">
              <MdBlock size={100} color="red" />
              You blocked this user
            </div>
          ) : userData && userData.heBlockedMe ? (
            <div className="h-full flex justify-center items-center font-bold flex-col text-xl">
              <MdBlock size={100} color="red" />
              You are blocked by this user
            </div>
          ) : currentUserMsgs ? (
            currentUserMsgs.map((data, idx) => {
              const today = new Date();
              const msgDate = new Date(data.timeSent);
              const diff = Math.floor(
                (today - msgDate) / (1000 * 60 * 60 * 24)
              );
              if (prevDiff != diff) {
                prevDiff = diff;
                prevCount = 0;
              } else {
                prevCount++;
              }
              return (
                <>
                  <div className="flex justify-center">
                    {prevCount == 0 ? (
                      <span className="bg-blue-200 font-bold rounded-xl py-1 px-3">
                        {diff == 0
                          ? "Today"
                          : diff > 0 && diff < 7
                          ? format(new Date(data.timeSent), "EEEE")
                          : format(new Date(data.timeSent), "dd MMMM yyyy")}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div
                    key={idx}
                    id={data._id}
                    className={`flex justify-end gap-2 items-center ${
                      data.isOur ? "flex-row pr-2" : "flex-row-reverse pl-2"
                    } ${
                      isHighlighted == data._id ? "bg-gray-200" : "bg-inherit"
                    }`}
                  >
                    <button
                      className="bg-gray-400 text-sm text-white rounded-full p-1"
                      onClick={() => reply(data)}
                    >
                      <FaReply />
                    </button>
                    <div
                      className={`max-w-[70%] p-1 rounded-xl flex flex-col items-end ${
                        data.isOur ? "bg-green-200" : "bg-gray-100"
                      }`}
                    >
                      {data.isReply ? (
                        <div
                          onClick={() => handleReplyScroll(data.replyData._id)}
                          className="w-full cursor-pointer mb-1 flex flex-col gap-0 bg-[#99999959] p-2 rounded-[10px] border-l-4 border-green-500"
                        >
                          <span className="text-sm text-green-700 font-semibold">
                            {data.replyData.isOur ? "You" : userData.name}
                          </span>
                          <span>{data.replyData.msg}</span>
                        </div>
                      ) : (
                        ""
                      )}
                      <span className="px-3 w-full font-medium">
                        {data.msg}
                      </span>
                      <span className="px-3 text-[12px] flex items-center gap-2">
                        {format(new Date(data.timeSent), "h:mm a")}
                        {data.seen && data.isOur ? (
                          <IoCheckmarkDoneOutline color="blue" size={15} />
                        ) : (
                          ""
                        )}
                      </span>
                    </div>
                  </div>
                </>
              );
            })
          ) : (
            "No Message"
          )}
        </div>
        <div className="bg-[#ffffff29] absolute bottom-0 left-0 z-10 px-[10px] py-[10px] w-full flex justify-between items-center gap-[10px] border-t-[1px] backdrop-blur-md rounded-b-3xl">
          <div
            ref={chatInputBoxRef}
            className="flex flex-col gap-2 text-black bg-[#F5F5F5] border-solid border-gray-200  border-[1px] py-2 px-2 rounded-[15px] w-full h-auto"
          >
            {isReplying && replyData ? (
              <div className="flex items-center justify-between gap-2 bg-gray-200 p-2 rounded-[10px] border-l-4 border-green-500">
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
              <MdAttachFile />
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
