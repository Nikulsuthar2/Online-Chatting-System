import React from "react";
import {format} from 'date-fns'
import UserStatusDot from './UserStatusDot';
import { IoCheckmarkDoneOutline } from 'react-icons/io5';

const ChatUserButton = ({idx, data, onChatUserClick}) => {
  return (
    <div
      //to={"/home?id=" + data.chatUid._id}
      onClick={(e) => onChatUserClick(data.chatUid._id)}
      className="box-border p-2 flex justify-between gap-2 bg-white hover:bg-slate-50 cursor-pointer overflow-x-hidden"
    >
      <div className="w-[80%] flex gap-2">
        <img
          src={import.meta.env.VITE_BACKEND_URL + data.chatUid.profileimg}
          className="w-[45px] h-[45px] object-cover rounded-xl"
        />
        <div className="w-[80%] flex flex-col justify-center">
          <span className="flex items-center gap-2 leading-none font-bold">
            <UserStatusDot status={data.chatUid.status} />
            {data.chatUid.name}
          </span>
          <span className="flex gap-2 items-center justify-between font-semibold w-full">
            <span className="truncate overflow-hidden">
              {data.messages[data.messages.length - 1].isOurMsg ? "You: " : ""}
              {data.messages[data.messages.length - 1].msg}
            </span>
          </span>
        </div>
      </div>
      <div className="w-[15%] flex flex-col items-center gap-1">
        <span className="text-sm">
          {format(
            new Date(data.messages[data.messages.length - 1].timeSent),
            "h:mma"
          )}
        </span>
        <span>
          {data.messages[data.messages.length - 1].seen == false ? (
            <IoCheckmarkDoneOutline color="blue" />
          ) : (
            ""
          )}
        </span>
      </div>
    </div>
  );
};

export default ChatUserButton;
