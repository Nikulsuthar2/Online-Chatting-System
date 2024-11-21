import React, { useState } from "react";

const ChatReactionBubble = ({id,onReact}) => {
  const reaction = ["👍💖💗😂❤️😂😅🥲😮😱🙏🤝👏"];
  const [emoji, setEmoji] = useState(["👍", "❤️", "😂", "😮", "😢", "🙏"]);
  return <div className="absolute z-20 -top-14 -left-28  rounded-full bg-white dark:bg-[#1f1f1f] dark:border-[#3f3f3f] border-[1px] shadow-lg p-2 gap-1 flex items-start ">
    {emoji.map((data,idx)=> <button onClick={()=>onReact(id,data)} className="hover:text-2xl hover:p-0 aspect-square text-lg rounded-full p-1 active:-translate-y-3 transition-all duration-200" key={idx}>{data}</button>)}
  </div>;
};

export default ChatReactionBubble;
