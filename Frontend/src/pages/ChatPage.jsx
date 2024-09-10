import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { decodeJWT, isLoggedIn } from "../utils/userApis";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { getUserData, setUserStatus } from "../utils/userDataApi";
import { MdArrowBack } from "react-icons/md";
import { getAllMsgs, sendSeenStatus, sendTextMsg } from "../utils/userChatApi";
import { FaPaperPlane } from "react-icons/fa6";
import '../assets/myCustomStyle.css';
import { format } from "date-fns";
import UserStatusDot from "../components/UserStatusDot";
import { IoCheckmarkDoneOutline } from "react-icons/io5";


const ChatPage = () => {
  const { id } = useParams();
  const [txtMsg, setTxtMsg] = useState("");
  const [userData, setUserData] = useState(null);
  const [currentUserMsgs, setCurrentUserMsgs] = useState(null);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  const fetchUserData = async (uid) => {
    //console.log("val:"+uid);
    const res = await getUserData(uid);
    if (res) {
      setUserData(res.user);
      fetchMessages(uid);
    }
  };

  const fetchMessages = async (uid) => {
    const res = await getAllMsgs(uid);
    //console.log(res)
    if (res) {
      if (JSON.stringify(res) !== sessionStorage.getItem("msgs")) {
        await sendSeenStatus(uid);

        console.log("ya its diffrent");
        setCurrentUserMsgs(res);
        sessionStorage.setItem("msgs", JSON.stringify(res));
      }
    }
  };

  const handleSendMessage = async () => {
    if (txtMsg != "") {
      const res = await sendTextMsg(userData._id, txtMsg);
      //console.log(res);
      setTxtMsg("");
    }
  };

  useEffect(() => {
    sessionStorage.removeItem("msgs")
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
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [currentUserMsgs]);

  return (
    <div className="h-screen w-full flex justify-center items-center bg-[#F5F5F5]">
      <div className="relative border-solid bg-white border-gray-200 border-[1px] shadow-lg rounded-3xl min-w-[400px] max-w-[400px] h-[90%]">
        {userData ? (
          <nav className="bg-[#ffffffa6] absolute top-0 left-0 z-10 px-[15px] py-[10px] w-full flex justify-between items-center border-b-[1px] backdrop-blur-md rounded-t-3xl">
            <div className="flex gap-[10px] items-center">
              <button
                onClick={() => history.back()}
                className="h-[40px] w-[40px] text-white bg-black hover:bg-slate-700 rounded-[15px] flex justify-center items-center cursor-pointer active:translate-y-1"
              >
                <MdArrowBack size={25} />
              </button>
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}${
                  userData.profileimg
                }`}
                alt=""
                className="h-[40px] w-[40px] rounded-[15px] aspect-square object-cover"
              />
              <div className="flex flex-col leading-none">
                <span className="font-bold">{userData.name}</span>
                <span className="text-sm flex gap-1">@{userData.username}
                  <span><UserStatusDot status={userData.status} isDot={false}/></span>
                </span>
              </div>
            </div>
          </nav>
        ) : (
          ""
        )}
        <div ref={chatContainerRef} className="h-full rounded-3xl overflow-scroll flex flex-col gap-2 pt-[70px] pb-[70px] scrollbar-hide ">
          {currentUserMsgs
            ? currentUserMsgs.map((data, idx) => {
              return (
                <div
                  key={idx}
                  className={
                    data.isOur
                      ? "flex justify-end pr-2"
                      : "flex justify-start pl-2"
                  }
                >
                  <div
                    className={`max-w-[70%] p-1 px-3 rounded-xl flex flex-col items-end ${
                      data.isOur ? "bg-green-200" : "bg-gray-100"
                    }`}
                  >
                    <span className="w-full font-medium">{data.msg}</span>
                    <span className="text-[12px] flex items-center gap-2">
                      {format(new Date(data.timeSent), "h:mm a")}
                      {data.seen && data.isOur ? (
                        <IoCheckmarkDoneOutline color="blue" size={15}/>
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                </div>
              );
            })
            : "No Message"}
        </div>
        <div className="bg-[#ffffff29] absolute bottom-0 left-0 z-10 px-[15px] py-[10px] w-full flex justify-between items-center gap-[10px] border-t-[1px] backdrop-blur-md rounded-b-3xl">
          <input
            type="text"
            value={txtMsg}
            onChange={(e) => setTxtMsg(e.target.value)}
            placeholder="Enter Your Messages..."
            className="text-black bg-[#F5F5F5] border-solid border-gray-200 outline-none border-[1px] py-2 px-2 rounded-[10px] w-full"
          />
          <button
            onClick={handleSendMessage}
            className="h-[40px] text-white bg-black px-4 hover:bg-slate-700 rounded-[15px] flex justify-center items-center cursor-pointer active:translate-y-1"
          >
            <FaPaperPlane size={20} />
          </button>
        </div>
      </div>
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
};

export default ChatPage;
