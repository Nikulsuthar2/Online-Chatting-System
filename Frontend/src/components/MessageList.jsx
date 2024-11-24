import React, { useEffect, useRef, useState } from "react";
import { MdBlock, MdEmojiEmotions } from "react-icons/md";
import { format } from "date-fns";
import ChatReactionBubble from "./ChatReactionBubble";
import { sendReaction } from "../utils/userChatApi";
import { FaReply } from "react-icons/fa6";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import ReactMarkdowm from "react-markdown";
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import 'highlight.js/styles/atom-one-dark.css'

const MessageList = ({ userData, currentUserMsgs, handleReply }) => {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [reactionMsg, setReactionMsg] = useState(null);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [currentUserMsgs]);

  const onReact = async (id, emoji) => {
    console.log(id, emoji);
    const res = await sendReaction(id, emoji);
    console.log(res);
    setReactionMsg(null);
  };

  const handleReplyScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      let previousSection =
        section.previousElementSibling.previousElementSibling;
      // Scroll smoothly to the section
      //section.scrollIntoView({ behavior: 'smooth' });

      if (previousSection != null)
        previousSection.scrollIntoView({ behavior: "smooth" });
      else if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          section.getBoundingClientRect().top;
      }

      setIsHighlighted(id);

      // Remove the highlight after 2 seconds
      setTimeout(() => {
        setIsHighlighted(null);
      }, 2000);
    }
  };

  let prevDiff;
  let prevCount = 0;

  return (
    <div ref={chatContainerRef} className="flex flex-col gap-2">
      {userData && userData.iBlockedHim ? (
        <div className="h-full flex justify-center items-center font-bold flex-col text-xl">
          <MdBlock size={100} color="red" />
          You blocked this user
        </div>
      ) : userData && userData.heBlockedMe ? (
        <div className="h-full flex justify-center items-center font-bold flex-col text-xl">
          <MdBlock size={100} color="red" />
          You are blocked by this user
        </div>
      ) : currentUserMsgs ? (
        currentUserMsgs.map((data, idx) => {
          //console.log(data.msg)
          const today = new Date();
          const msgDate = new Date(data.timeSent);
          const diff = Math.floor((today - msgDate) / (1000 * 60 * 60 * 24));
          if (prevDiff != diff) {
            prevDiff = diff;
            prevCount = 0;
          } else {
            prevCount++;
          }
          return (
            <>
              <div className="flex justify-center">
                {prevCount == 0 ? (
                  <span className="bg-blue-200 dark:bg-blue-900 font-bold rounded-xl py-1 px-3">
                    {diff == 0
                      ? "Today"
                      : diff > 0 && diff < 7
                      ? format(new Date(data.timeSent), "EEEE")
                      : format(new Date(data.timeSent), "dd MMMM yyyy")}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div
                key={idx}
                id={data._id}
                className={`flex justify-end gap-2 items-center ${
                  data.isOur ? "flex-row pr-2" : "flex-row-reverse pl-2"
                } ${
                  isHighlighted == data._id
                    ? "bg-gray-200 dark:bg-[#3f3f3f]"
                    : "bg-inherit"
                }`}
              >
                <button className="relative bg-gray-400 dark:bg-gray-800 text-sm text-white rounded-full p-1">
                  <MdEmojiEmotions
                    onClick={() =>
                      setReactionMsg(reactionMsg == data._id ? null : data._id)
                    }
                  />
                  {reactionMsg && reactionMsg == data._id ? (
                    <ChatReactionBubble id={data._id} onReact={onReact} />
                  ) : (
                    ""
                  )}
                </button>
                <button
                  className="bg-gray-400 dark:bg-gray-800 text-sm text-white rounded-full p-1"
                  onClick={() => handleReply(data)}
                >
                  <FaReply />
                </button>
                <div
                  className={`relative max-w-[70%] p-1 rounded-xl flex flex-col items-end ${
                    data.isOur
                      ? "bg-green-200 dark:bg-gray-800"
                      : "bg-gray-100 dark:bg-[#1f1f1f]"
                  } ${
                    data.reactions && data.reactions.length > 0 ? "mb-4" : ""
                  }`}
                >
                  {data.isReply ? (
                    <div
                      onClick={() => handleReplyScroll(data.replyData._id)}
                      className="w-full cursor-pointer mb-1 flex flex-col gap-0 bg-[#99999959] p-2 rounded-[10px] border-l-4 border-green-500"
                    >
                      <span className="text-sm text-green-700 dark:text-green-300 font-semibold">
                        {data.replyData.isOur ? "You" : userData.name}
                      </span>
                      <span>{data.replyData.msg}</span>
                    </div>
                  ) : (
                    ""
                  )}
                  <span className="scrollbar-hide w-full text-black dark:text-white prose dark:prose-invert prose-headings:px-2 prose-headings:mb-2 prose-p:px-2 prose-p:my-2  prose-blockquote:px-2 prose-blockquote:border-black dark:prose-blockquote:border-white prose-pre:mt-0 prose-pre:p-0 prose-pre:bg-black">
                    <ReactMarkdowm rehypePlugins={[rehypeRaw,rehypeHighlight]}>{data.msg}</ReactMarkdowm>
                  </span>
                  <span className="px-2 text-[12px] flex items-center gap-2">
                    {format(new Date(data.timeSent), "h:mm a")}
                    {data.seen && data.isOur ? (
                      <IoCheckmarkDoneOutline
                        className="text-blue-600 dark:text-blue-400"
                        size={15}
                      />
                    ) : (
                      ""
                    )}
                  </span>
                  {data.reactions && data.reactions.length > 0 ? (
                    <div
                      className={`cursor-pointer px-2 flex items-center border-[1px] dark:border-[#3f3f3f] z-10 absolute -bottom-5 ${
                        data.isOur ? "right-3" : "left-3"
                      } bg-[#ffffff] dark:bg-[#1f1f1f] rounded-full`}
                    >
                      {data.reactions.map((data1, idx) => {
                        return (
                          <span className="flex items-center">
                            {data.isOur ? (
                              data.senderid == data1.userId ? (
                                <span className="text-xs font-semibold">
                                  You
                                </span>
                              ) : (
                                ""
                              )
                            ) : data.receiverid == data1.userId ? (
                              <span className="text-xs font-semibold">You</span>
                            ) : (
                              ""
                            )}
                            {data1.emoji}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </>
          );
        })
      ) : (
        "No Message"
      )}
    </div>
  );
};

export default MessageList;
