import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  getAllBlockedUser,
  getAllFriendRequests,
  getAllFriends,
  removeFriend,
} from "../utils/userDataApi";
import { FaUserPlus, FaUserMinus, FaUserXmark } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import UserStatusDot from "../components/UserStatusDot";
import { MdBlock, MdChat } from "react-icons/md";
import "../assets/myCustomStyle.css";
import { PulseLoader } from "react-spinners";

const FriendsPage = () => {
  const { val } = useParams();
  const [requestData, setrequestData] = useState([]);
  const [friendsData, setfriendsData] = useState([]);
  const [friendCount, setfriendCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [blockedData, setBlockedData] = useState([]);
  const [isloadingData, setIsloadingData] = useState(true);

  useEffect(() => {
    setIsloadingData(true);
    const fetch = async () => {
      const data1 = await getAllFriends();
      if (data1) {
        setfriendsData(data1);
        setfriendCount(data1.length);
      }
      const data2 = await getAllFriendRequests();
      if (data2) {
        setrequestData(data2);
        setRequestCount(data2.length);
      }
      const data3 = await getAllBlockedUser();
      if (data3) {
        setBlockedData(data3);
      }
      setIsloadingData(false);
    };
    //fetch();
    const intervalReq = setInterval(fetch, 1500);

    return () => clearInterval(intervalReq);
  }, [val]);

  const handleAddFriend = async (fid) => {
    const res = await acceptFriendRequest(fid);
    const requestd = requestData.filter((req) => req._id !== fid);
    setrequestData(requestd);
    setRequestCount(requestd.length);
    //console.log(res);
  };

  const handleCancelFriendRequest = async (fid) => {
    console.log(fid);
    const res = await cancelFriendRequest(fid, true);
    console.log(res);
    const requestd = requestData.filter((req) => req._id !== fid);
    setrequestData(requestd);
    setRequestCount(requestd.length);
  };

  const handleRemoveFriend = async (fid) => {
    const res = await removeFriend(fid);
    const friendd = friendsData.filter((req) => req._id !== fid);
    setfriendsData(friendd);
    setfriendCount(friendd.length);
    //console.log(res);
  };

  return (
    <div className="relative pt-[60px] flex flex-col h-full overflow-y-auto overflow-x-hidden scrollbar-hide rounded-t-3xl">
      <div
        id="header"
        className="w-full px-[10px] py-[10px] text-md font-semibold"
      >
        <div className="flex justify-between gap-[5px] bg-[#F3F3F3] p-[5px] rounded-[15px]">
          <Link
            to="/home/friends/0"
            className={
              (val == 0 ? "bg-white " : "") +
              "text-md w-full rounded-[10px] py-1 font-bold hover:bg-white flex justify-center items-center gap-2"
            }
          >
            Friends
            {friendCount > 0 ? (
              <div className="rounded-full bg-green-500 px-[5px] text-sm text-white">
                {friendCount}
              </div>
            ) : (
              ""
            )}
          </Link>
          <Link
            to="/home/friends/1"
            className={
              (val == 1 ? "bg-white " : "") +
              "whitespace-nowrap text-md w-full rounded-[10px] px-2 py-1 font-bold hover:bg-white flex justify-center items-center gap-2"
            }
          >
            Friend Request
            {requestCount > 0 ? (
              <div className="rounded-full bg-blue-500 px-[5px] text-sm text-white">
                {requestCount}
              </div>
            ) : (
              ""
            )}
          </Link>
          <Link
            to="/home/friends/2"
            className={
              (val == 2 ? "bg-white " : "") +
              "text-md w-full rounded-[10px] py-1 font-bold hover:bg-white flex justify-center items-center gap-2"
            }
          >
            Blocked
            {blockedData && blockedData.length > 0 ? (
              <div className="rounded-full bg-red-500 px-[5px] text-sm text-white">
                {blockedData.length}
              </div>
            ) : (
              ""
            )}
          </Link>
        </div>
      </div>
      <div id="list" className="w-full h-full flex flex-col gap-2 px-[10px]">
        {val == 0 ? (
          isloadingData ? (
            <div className="flex justify-center items-center h-full">
              <PulseLoader color="black" size={10} />
            </div>
          ) : friendsData.length == 0 ? (
            <div className="flex justify-center items-center h-full">
              No Friends
            </div>
          ) : (
            friendsData.map((data, index) => (
              <div
                key={data._id}
                className="flex justify-between items-center gap-2 p-[5px] border-[1px] rounded-[15px] hover:bg-slate-50"
              >
                <div className="flex gap-2 items-center">
                  <img
                    src={import.meta.env.VITE_BACKEND_URL + data.profileimg}
                    className="w-[50px]  rounded-xl aspect-square object-cover"
                  />
                  <div>
                    <div className="flex gap-2 items-center">
                      <UserStatusDot status={data.status} isDot={true} />
                      <p className="font-bold text-lg">{data.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">@{data.username}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleRemoveFriend(data._id)}
                    className="rounded-[10px] w-[50px] h-[50px] bg-[#F1F1F1] flex justify-center items-center"
                  >
                    <FaUserMinus color="black" size={"25px"} />
                  </button>
                  <Link
                    to={"/chat/" + data._id}
                    className="rounded-[10px] w-[50px] h-[50px] bg-blue-500 flex justify-center items-center"
                  >
                    <MdChat color="white" size={"25px"} />
                  </Link>
                </div>
              </div>
            ))
          )
        ) : val == 1 ? (
          isloadingData ? (
            <div className="flex justify-center items-center h-full">
              <PulseLoader color="black" size={10} />
            </div>
          ) : requestData.length == 0 ? (
            <div className="flex justify-center items-center h-full">
              No Requests
            </div>
          ) : (
            requestData.map((data, index) => (
              <div
                key={data._id}
                className="flex justify-between items-center gap-2 p-[5px] border-[1px] rounded-[15px] hover:bg-slate-50"
              >
                <div className="flex gap-2 items-center">
                  <img
                    src={import.meta.env.VITE_BACKEND_URL + data.profileimg}
                    className="w-[50px]  rounded-xl aspect-square object-cover"
                  />
                  <div>
                    <div className="flex gap-2 items-center">
                      <p className="font-bold text-lg">{data.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">@{data.username}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleAddFriend(data._id)}
                    className="rounded-[10px] w-[50px] h-[50px] bg-[#F1F1F1] hover:bg-[#dbdbdb] flex justify-center items-center"
                  >
                    <FaUserPlus color="black" size={"25px"} />
                  </button>
                  <button
                    onClick={(e) => handleCancelFriendRequest(data._id)}
                    className="rounded-[10px] w-[50px] h-[50px] bg-[#F1F1F1] hover:bg-[#dbdbdb] flex justify-center items-center"
                  >
                    <FaUserXmark color="black" size={"25px"} />
                  </button>
                </div>
              </div>
            ))
          )
        ) : isloadingData ? (
          <div className="flex justify-center items-center h-full">
            <PulseLoader color="black" size={10} />
          </div>
        ) : blockedData.length == 0 ? (
          <div className="flex justify-center items-center h-full">
            No Blocked USers
          </div>
        ) : (
          blockedData.map((data, index) => (
            <div
              key={data._id}
              className="flex justify-between items-center gap-2 p-[5px] border-[1px] rounded-[15px] hover:bg-slate-50"
            >
              <div className="flex gap-2 items-center">
                <img
                  src={import.meta.env.VITE_BACKEND_URL + data.profileimg}
                  className="w-[50px]  rounded-xl aspect-square object-cover"
                />
                <div>
                  <div className="flex gap-2 items-center">
                    <p className="font-bold text-lg">{data.name}</p>
                  </div>
                  <p className="text-sm text-gray-500">@{data.username}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBlockUser(userData._id)}
                  className="h-full px-2 py-1 text-sm w-full rounded-full bg-white font-bold text-red-500 flex gap-1 items-center justify-center active:translate-y-1"
                >
                  <MdBlock size={15} /> UnBlock
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
};

export default FriendsPage;
