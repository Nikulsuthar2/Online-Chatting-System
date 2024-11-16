import React, { useState } from "react";
import { FaUserMinus, FaUserPlus } from "react-icons/fa6";
import { getSearchUsers } from "../utils/userDataApi";
import { Link } from "react-router-dom";
import { cancelFriendRequest, sendFriendRequest } from "../utils/userDataApi";
import { toast, ToastContainer } from "react-toastify";
import { MdChatBubble } from "react-icons/md";

const SearchPage = () => {
  const [searchbar, setsearchbar] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [getSearchData, setGetSearchData] = useState([]);

  const fetchSearchResults = async (query) => {
    const res = await getSearchUsers(query);
    if (
      res.status === 200 &&
      res.data.length > 0 &&
      getSearchData != res.data
    ) {
      //setLoginData(decodeJWT(token).UserInfo);
      setGetSearchData(res.data);
      console.log(getSearchData);
    } else {
      setGetSearchData([]);
    }
  };

  const handleSearchBar = async (e) => {
    const token = localStorage.getItem("accessToken");
    setsearchbar(e.target.value);
    if (e.target.value == "") {
      setIsSearching(false);
    } else {
      setIsSearching(true);
      await fetchSearchResults(e.target.value);
    }
  };

  const handleSendFriendRequest = async (uid) => {
    const res = await sendFriendRequest(uid);
    if (res.result) {
      toast.success("Friend Request Sent");
      await fetchSearchResults(searchbar);
    }
  };

  const handleCancelFriendRequest = async (uid) => {
    const res = await cancelFriendRequest(uid, false);
    if (res.result) {
      toast.success("Friend Request Cancel");
      await fetchSearchResults(searchbar);
    }
  };

  return (
    <div className="relative pt-[60px] flex flex-col h-full">
      <div
        id="header"
        className="bg-white px-[15px] py-[10px] text-md font-semibold"
      >
        <input
          type="search"
          onChange={handleSearchBar}
          //   onBlur={() => setIsSearching(false)}
          //   onFocus={(e) => {
          //     if (e.target.value !== "") setIsSearching(true);
          //   }}
          value={searchbar}
          placeholder="Search User"
          className="text-black bg-[#F5F5F5] border-solid border-gray-200 outline-none border-[1px] py-2 px-2 rounded-[10px] w-full"
        />
      </div>
      <div className="h-full">
        {isSearching ? (
          <div id="search-result" className="flex flex-col gap-[5px]">
            {getSearchData.length == 0 ? (
              <div className="flex p-4 font-bold gap-2 justify-center items-center h-full">
                No User Found
              </div>
            ) : (
              getSearchData
                .filter((el) => el.isCurrentUser !== true)
                .map((data) => (
                  <div
                    key={data._id}
                    className="flex items-center gap-2 justify-between mx-[10px] p-[5px] rounded-[20px] bg-white hover:bg-slate-50 border-[1px]"
                  >
                    <Link
                      to={"/chat/" + data._id}
                      onClick={() => setIsSearching(false)}
                      className="flex items-center gap-2 cursor-pointer overflow-x-hidden"
                    >
                      <div className="w-[50px] rounded-[15px]">
                        <img
                          className="w-[50px] h-[50px] object-cover rounded-[15px]"
                          src={
                            import.meta.env.VITE_BACKEND_URL + data.profileimg
                          }
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex gap-2 items-center">
                          <span className="font-bold text-lg truncate">
                            {data.name}
                          </span>
                        </div>
                        <span className="text-sm">@{data.username}</span>
                      </div>
                    </Link>
                    {data.isFriend ? (
                      ""
                    ) : (
                      <div className="w-[50px] h-[50px] p-2 bg-[#F1F1F1] hover:bg-slate-200 rounded-[15px] flex justify-center items-center">
                        {data.isRequested ? (
                          <FaUserMinus
                            color="#ff2121"
                            className="cursor-pointer"
                            size={25}
                            onClick={() => handleCancelFriendRequest(data._id)}
                          />
                        ) : (
                          <FaUserPlus
                            color="#00df00"
                            className="cursor-pointer"
                            size={25}
                            onClick={() => handleSendFriendRequest(data._id)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>
        ) : (
          <div className="h-full flex justify-center items-center">
            No Search
          </div>
        )}
      </div>
      {/* <ToastContainer position="bottom-right" theme="colored" /> */}
    </div>
  );
};

export default SearchPage;
