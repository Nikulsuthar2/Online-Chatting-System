import React from "react";
import { format } from "date-fns";
import UserStatusDot from "./UserStatusDot";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import ChatUserButton from "./ChatUserButton";

const AllChatList = ({
  width = "w-full",
  height = "h-[90%]",
  chatUsers,
  onChatClick,
}) => {
  return (
    <div className={`${width} ${height} rounded-b-3xl`}>
      {chatUsers !== null && chatUsers.length > 0 ? (
        <div className="flex flex-col gap-2 h-full px-[10px]">
          {chatUsers.map((data, idx) => {
            
            return (
              <div key={idx}>
              <ChatUserButton
                data={data}
                onChatUserClick={onChatClick}
              />
              {idx == chatUsers.length-1 ? <div key={idx+1} className="text-center">. . .</div> : ""}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex justify-center items-center gap-1 h-full text-3xl font-semibold">
          No Chats
        </div>
      )}
    </div>
  );
};

export default AllChatList;
