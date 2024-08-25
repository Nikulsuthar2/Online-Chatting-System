import React from "react";

const UserStatusDot = (props) => {
  return (
    <>
      {props.status ? (
        <div className="rounded-full w-[12px] h-[12px] bg-green-400 shadow-lg shadow-green-400"></div>
      ) : (
        <div className="rounded-full w-[12px] h-[12px] bg-red-400 shadow-lg shadow-red-400"></div>
      )}
    </>
  );
};

export default UserStatusDot;
