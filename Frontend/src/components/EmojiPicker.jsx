import React, { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { MdEmojiEmotions, MdOutlineEmojiEmotions } from "react-icons/md";

const EmojiPicker = ({ onEmojiSelect, showPick = false }) => {
  const [showPicker, setShowPicker] = useState(showPick);

  const handleEmojiClick = (emoji) => {
    onEmojiSelect(emoji.native);
    //setShowPicker(false);
  };

  return (
    <div className="">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="text-2xl dark:text-white flex justify-center items-center"
      >
        {showPicker ? <MdEmojiEmotions /> : <MdOutlineEmojiEmotions />}
      </button>
      {showPicker && (
          <div className="absolute z-50 bottom-[70px] left-[15px] shadow-2xl">
            <Picker
              data={data}
              onEmojiSelect={handleEmojiClick}
              theme={
                window.matchMedia("(prefers-color-scheme: dark)").matches
                  ? "dark"
                  : "light"
              }
              navPosition="bottom"
              perLine="8"
            />
          </div>
      )}
    </div>
  );
};

export default EmojiPicker;
