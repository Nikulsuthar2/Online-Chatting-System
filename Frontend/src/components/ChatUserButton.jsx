import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import UserStatusDot from "./UserStatusDot";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

const ChatUserButton = ({ idx, data, onChatUserClick }) => {
  const [timeOfMsg, setTimeOfMsg] = useState("")
  useEffect(() => {
    const today = new Date();
    const msgDate = new Date(data.latestMsgTimeSent);
    const diff = Math.floor(
      (today - msgDate) / (1000 * 60 * 60 * 24)
    );
    if(diff == 0){
      setTimeOfMsg(format(msgDate, "h:mma"));
    } else if (diff > 0 && diff < 7){
      setTimeOfMsg(format(msgDate, "EEEE"));
    } else {
      setTimeOfMsg(format(msgDate, "dd/MM/yy"));
    }
  },[])
  
  return (
    <div key={idx}
      title={data.name}
      onClick={(e) => onChatUserClick(data.userid)}
      className="p-[5px] flex justify-between items-center bg-white hover:bg-slate-100 md:border-[1px] border-b-[1px] md:rounded-[15px] cursor-pointer"
    >
      <div className="w-[80%] flex gap-2">
        <img
          src={import.meta.env.VITE_BACKEND_URL + data.profileimg}
          className="w-[50px] h-[50px] object-cover rounded-[10px]"
        />
        <div className="w-[80%] flex flex-col justify-center gap-1">
          <span className="flex items-center gap-2 leading-none font-bold">
            <UserStatusDot status={data.status} isDot={true} />
            {data.name}
          </span>
          <span className="flex gap-2 items-center text-sm md:text-base justify-between font-semibold w-full">
            {data.typing ? (
              <span className="font-semibold text-green-400">Typing...</span>
            ) : (
              <span className="truncate overflow-hidden">
                {data.isOur ? "You: " : ""}
                {data.latestMessage}
              </span>
            )}
          </span>
        </div>
      </div>
      <div className="w-[15%] flex flex-col items-end gap-1">
        <span className="text-xs text-center font-semibold">
          {timeOfMsg}
        </span>
        {data.newMsg > 0 ? (
          <span className="bg-red-500 rounded-full aspect-square flex justify-center items-center text-white font-bold text-sm">
            {data.newMsg}
          </span>
        ) : (
          <span className="h-3 w-full flex justify-end">
            {data.latestMsgSeen && data.isOur ? (
              <IoCheckmarkDoneOutline color="blue" />
            ) : (
              ""
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatUserButton;
