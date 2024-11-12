import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="h-screen overflow-hidden bg-gray-10 flex justify-center items-center">
      <div className="relative w-full md:w-fit h-full md:h-fit">
        <div className="h-full relative z-20 flex flex-col justify-center items-center bg-[#ffffff55] p-12 gap-6 backdrop-blur-md rounded-none md:rounded-3xl border-none md:border-[1px] border-gray-150">
          <label className="text-2xl text-center">😂😍😎😘👍👌🙌</label>
          <label className="text-5xl font-bold text-center">
            Welcome To Chat App
          </label>
          <div className="flex gap-2">
            <Link
              to={"/signin"}
              className="border-black flex justify-center items-center text-center border-[1px] hover:bg-gray-150 text-black text-md font-bold py-2 px-8 rounded-xl"
            >
              Create Account
            </Link>
            <Link
              to={"/login"}
              className="bg-black flex justify-center items-center hover:bg-gray-600 text-white text-md font-bold py-2 px-8 rounded-xl"
            >
              Login
            </Link>
          </div>
        </div>
        <span className="absolute -right-24 -top-32 rotate-45 z-0 text-[150px]">
          👌
        </span>
        <span className="absolute -left-28 -bottom-16 z-0 text-[150px]">
          🤣
        </span>
      </div>
    </div>
  );
};

export default Landing;
