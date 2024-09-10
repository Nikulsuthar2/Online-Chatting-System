import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  getAllFriendRequests,
  getAllFriends,
  removeFriend,
} from "../utils/userDataApi";
import { FaUserPlus, FaUserMinus, FaUserXmark } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import UserStatusDot from "../components/UserStatusDot";
import { MdChat } from "react-icons/md";
import '../assets/myCustomStyle.css';

const FriendsPage = () => {
  const { val } = useParams();
  const [requestData, setrequestData] = useState([]);
  const [friendsData, setfriendsData] = useState([]);
  const [friendCount, setfriendCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const data1 = await getAllFriends();
      if (data1) {
        //console.log("friend",data1);
        setfriendsData(data1);
        setfriendCount(data1.length);
      }
      const data2 = await getAllFriendRequests();
      if (data2) {
        //console.log("request",data2);
        setrequestData(data2);
        setRequestCount(data2.length);
      }
    };
    //fetch();
    const intervalReq = setInterval(fetch, 3000);

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
    console.log(fid)
    const res = await cancelFriendRequest(fid,true);
    console.log(res)
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
        className="w-full px-[15px] py-[10px] text-md font-semibold"
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
              <div className="rounded-full bg-red-500 px-[5px] text-sm text-white">
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
              "text-md w-full rounded-[10px] py-1 font-bold hover:bg-white flex justify-center items-center gap-2"
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
        </div>
      </div>
      <div id="list" className="w-full h-full flex flex-col gap-2 px-[10px]">
        {val == 0
          ? friendsData.length == 0 ? <div className="flex justify-center items-center h-full">No Friends</div> : friendsData.map((data, index) => (
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
                      <UserStatusDot status={data.status} isDot={true}/>
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
          : requestData.length == 0 ? <div className="flex justify-center items-center h-full">No Requests</div> : requestData.map((data, index) => (
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
                    <FaUserPlus color="black" size={"25px"}/> 
                  </button>
                  <button
                    onClick={(e) => handleCancelFriendRequest(data._id)}
                    className="rounded-[10px] w-[50px] h-[50px] bg-[#F1F1F1] hover:bg-[#dbdbdb] flex justify-center items-center"
                  >
                    <FaUserXmark color="black" size={"25px"}/>
                  </button>
                </div>
              </div>
            ))}
      </div>
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
};

export default FriendsPage;
