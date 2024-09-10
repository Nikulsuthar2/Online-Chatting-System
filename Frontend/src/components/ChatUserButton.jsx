import React from "react";
import { format } from "date-fns";
import UserStatusDot from "./UserStatusDot";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

const ChatUserButton = ({ idx, data, onChatUserClick }) => {
  return (
    <div
      //to={"/home?id=" + data.chatUid._id}
      onClick={(e) => onChatUserClick(data.userid)}
      className="p-[10px] flex justify-between items-center bg-white hover:bg-slate-50 border-[1px] rounded-[20px] cursor-pointer"
    >
      <div className="w-[80%] flex gap-2">
        <img
          src={import.meta.env.VITE_BACKEND_URL + data.profileimg}
          className="w-[50px] h-[50px] object-cover rounded-[15px]"
        />
        <div className="w-[80%] flex flex-col justify-center">
          <span className="flex items-center gap-2 leading-none font-bold">
            <UserStatusDot status={data.status} isDot={true} />
            {data.name}
          </span>
          <span className="flex gap-2 items-center justify-between font-semibold w-full">
            <span className="truncate overflow-hidden">
              {data.isOur ? "You: " : ""}
              {data.latestMessage}
            </span>
          </span>
        </div>
      </div>
      <div className="w-[15%] flex flex-col items-center gap-1">
        <span className="text-sm font-semibold">
          {format(new Date(data.latestMsgTimeSent), "h:mma")}
        </span>
        {data.newMsg > 0 ? (
          <span className="bg-red-500 rounded-full aspect-square flex justify-center items-center text-white font-bold text-sm">
            {data.newMsg}
          </span>
        ) : (
          <span className="h-3">
            {data.latestMsgSeen && data.isOur ? <IoCheckmarkDoneOutline color="blue" /> : ""}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatUserButton;
