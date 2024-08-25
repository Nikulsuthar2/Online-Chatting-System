import React from "react";
import { format } from "date-fns";
import UserStatusDot from "./UserStatusDot";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import ChatUserButton from "./ChatUserButton";

const AllChatList = ({
  width = "w-[30%]",
  height = "h-full",
  chatUsers,
  onChatClick,
}) => {
  return (
    <div className={`${width} ${height}`}>
      <div className="p-3 font-bold box-border h-[10%]">
        <p>All Chats</p>
      </div>

      {chatUsers !== null && chatUsers.length > 0 ? (
        <div className="flex flex-col h-[90%] overflow-auto">
          {chatUsers.map((data, idx) => {
            return (
              <ChatUserButton
                key={idx}
                data={data}
                onChatUserClick={onChatClick}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex justify-center items-center gap-1 h-[90%] text-xl">
          No Chats
        </div>
      )}
    </div>
  );
};

export default AllChatList;
