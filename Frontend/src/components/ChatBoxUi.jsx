import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { FaShare } from "react-icons/fa6";
import UserStatusDot from "../components/UserStatusDot";
import { sendTextMsg } from "../utils/userChatApi";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

const ChatBoxUi = ({ userData, currentUserMsgs }) => {
  const [txtMsg, setTxtMsg] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [currentUserMsgs]);

  const handleSendMessage = async () => {
    if (txtMsg != "") {
      const res = await sendTextMsg(userData._id, txtMsg);
      console.log(res);
      setTxtMsg("");
    }
  };

  return (
    <>
      <div className="bg-slate-50 w-full h-[10%] flex items-center gap-2 px-2">
        <img
          src={import.meta.env.VITE_BACKEND_URL + userData.profileimg}
          className="w-10 aspect-square object-cover rounded-full"
          alt="profile"
        />
        <div className="flex flex-col gap-1">
          <span className="font-bold leading-none text-lg flex gap-2 items-center">
            <UserStatusDot status={userData.status} />
            {userData.name}
          </span>
          <span className="text-sm leading-none">@{userData.username}</span>
        </div>
      </div>
      <div
        ref={chatContainerRef}
        className="bg-gray-600 w-full h-[80%] flex flex-col gap-1 pt-2 pb-2 overflow-auto"
      >
        {currentUserMsgs != null
          ? currentUserMsgs.map((data, idx) => {
              return (
                <div
                  key={idx}
                  className={
                    data.isOurMsg
                      ? "flex justify-end pr-2"
                      : "flex justify-start pl-2"
                  }
                >
                  <div
                    className={`max-w-[70%] p-1 px-3 rounded-xl flex flex-col items-end ${
                      data.isOurMsg ? "bg-green-200" : "bg-white"
                    }`}
                  >
                    <span className="w-full font-medium">{data.msg}</span>
                    <span className="text-[12px] flex items-center gap-2">
                      {format(new Date(data.timeSent), "h:mm a")}
                      {data.seen == false && data.isOurMsg ? (
                        <IoCheckmarkDoneOutline color="blue" size={15}/>
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                </div>
              );
            })
          : ""}
      </div>
      <div className="bg-slate-50 w-full h-[10%] px-2 gap-2 flex justify-between items-center">
        <input
          type="text"
          value={txtMsg}
          onChange={(e) => setTxtMsg(e.target.value)}
          placeholder="Type Here.."
          className="w-full h-[40px] bg-white rounded-full outline-none border-solid border-2 px-4"
        />
        <button
          onClick={handleSendMessage}
          className="p-2 rounded-full bg-green-500 text-white shadow-md shadow-green-400"
        >
          <FaShare />
        </button>
      </div>
    </>
  );
};

export default ChatBoxUi;
