import React from "react";

const UserStatusDot = ({status, isDot}) => {
  return (
    <>{
      isDot ? status ? 
        <div className="rounded-full w-[12px] h-[12px] bg-green-400 shadow-lg shadow-green-400"></div>
       : 
        <div className="rounded-full w-[12px] h-[12px] bg-red-400 shadow-lg shadow-red-400"></div>
      : status ? 
      <div className="text-green-400">online</div>
     : 
      <div className="text-red-400">offline</div>
      }
    </>
  );
};

export default UserStatusDot;
