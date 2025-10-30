import React from "react";
import { Link } from "react-router-dom";
import chatIcon from '../assets/icons8-chat-96.png';

const Landing = () => {
  return (
    <div className="h-full overflow-hidden dark:bg-[#1a1a1a] bg-gray-10 flex justify-center items-center">
      <div className="relative w-full md:w-fit h-full md:h-fit">
        <div className="h-full relative z-20 flex flex-col justify-center items-center bg-[#ffffff55] dark:bg-[#3b3b3b55] p-12 gap-6 backdrop-blur-md rounded-none md:rounded-3xl border-[0px] md:border-[1px] border-[#e5e5e5] dark:border-[#373636] dark:text-white">
          <img src={chatIcon} alt="logo"/>
          <label className="text-2xl text-center">😂😍😎😘👍👌🙌</label>
          <label className="text-5xl font-bold text-center">
            Welcome To Chat App
          </label>
          <div className="flex gap-2">
            <Link
              to={"/signin"}
              className="border-black dark:border-white dark:text-white flex justify-center items-center text-center border-[1px] hover:bg-gray-150 dark:hover:bg-gray-900 text-black text-md font-bold py-2 px-8 rounded-xl"
            >
              Create Account
            </Link>
            <Link
              to={"/login"}
              className="bg-black dark:bg-white flex justify-center items-center hover:bg-gray-600 dark:hover:bg-gray-300 text-white dark:text-black text-md font-bold py-2 px-8 rounded-xl"
            >
              Login
            </Link>
          </div>
        </div>
        <span className="absolute -right-16 -top-16 md:-right-36 md:-top-40 rotate-45 z-0 text-[200px]">
          👌
        </span>
        <span className="absolute -left-32 md:-left-28 -bottom-16 z-0 text-[250px] md:text-[150px]">
          🤣
        </span>
      </div>
    </div>
  );
};

export default Landing;
