import React from "react";
import { MdBlock } from "react-icons/md";

const BlockedUserWarning = ({ userData, handleBlockUser }) => {
  return (
    <>
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
    </>
  );
};

export default BlockedUserWarning;
