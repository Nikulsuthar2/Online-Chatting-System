import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  getAllFriendRequests,
  getAllFriends,
  removeFriend,
} from "../utils/userDataApi";
import { FaUserPlus, FaUserMinus, FaUserXmark} from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { IoChatbubblesOutline } from "react-icons/io5";

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
          setfriendCount(data1.length)
        }
        const data2 = await getAllFriendRequests();
        if (data2) {
          //console.log("request",data2);
          setrequestData(data2);
          setRequestCount(data2.length);
        }
    };
    fetch();
  }, [val]);

  const handleAddFriend = async (fid) => {
    const res = await acceptFriendRequest(fid);
    const requestd = requestData.filter(req => req._id !== fid);
    setrequestData(requestd);
    setRequestCount(requestd.length);
    //console.log(res);
  };

  const handleCancelFriendRequest = async (fid) => {
    const res = await cancelFriendRequest(fid);
    const requestd = requestData.filter(req => req._id !== fid);
    setrequestData(requestd);
    setRequestCount(requestd.length);
  }

  const handleRemoveFriend = async (fid) => {
    const res = await removeFriend(fid);
    const friendd = friendsData.filter(req => req._id !== fid);
    setfriendsData(friendd);
    setfriendCount(friendd.length);
    //console.log(res);
  };

  return (
    <div className="pt-14 w-full px-32">
      <div className="mt-6 flex justify-between items-center">
        <div className="flex gap-2 bg-slate-100 p-2 rounded-md">
          <Link
            to="/home/friends/0"
            className={
              (val == 0 ? "bg-slate-300 " : "") +
              "rounded-md px-4 py-2 text-xl font-bold hover:bg-slate-200 flex items-center gap-2"
            }
          >
            Friends
            {friendCount > 0 ? <div className="rounded-full bg-red-500 p-1 px-2 text-sm text-white">{friendCount}</div> : ""}
          </Link>
          <Link
            to="/home/friends/1"
            className={
              (val == 1 ? "bg-slate-300 " : "") +
              "rounded-md px-4 py-2 text-xl font-bold hover:bg-slate-200 flex items-center gap-2"
            }
          >
            Friend Request
            {requestCount > 0 ? <div className="rounded-full bg-blue-500 p-1 px-2 text-sm text-white">{requestCount}</div> : ""}
          </Link>
        </div>
        <button onClick={() => history.back()}>Back</button>
      </div>
      <div id="list" className="w-full mt-4 flex flex-col gap-2">
        {val == 0
          ? friendsData.map((data, index) => (
              <div key={data._id} className="flex items-center gap-2">
                <p className="bg-slate-200 p-3 mr-2 rounded-xl">{index + 1}</p>
                <img
                  src={import.meta.env.VITE_BACKEND_URL + data.profileimg}
                  className="w-[50px]  rounded-xl aspect-square object-cover"
                />
                <div>
                  <div className="flex gap-2 items-center">
                    {data.status ? (
                      <div className="rounded-full w-[15px] h-[15px] bg-green-400 shadow-lg shadow-green-400"></div>
                    ) : (
                      <div className="rounded-full w-[15px] h-[15px] bg-red-400 shadow-lg shadow-red-400"></div>
                    )}
                    <p className="font-bold text-xl">{data.name}</p>
                  </div>
                  <p className="text-sm text-gray-500">@{data.username}</p>
                </div>
                <Link to={"/home?id="+data._id}
                  className="rounded-full ml-4 px-2 py-2 bg-blue-500"
                >
                  <IoChatbubblesOutline color="white" size={"25px"}/>
                </Link>
                <button
                  onClick={(e) => handleRemoveFriend(data._id)}
                  className="flex items-center gap-2 border-2 border-solid rounded-lg px-4 py-2 hover:bg-slate-200"
                >
                  <FaUserMinus color="black" /> Remove Friend
                </button>
              </div>
            ))
          : requestData.map((data, index) => (
              <div key={data._id} className="flex items-center gap-2">
                <p className="bg-slate-200 p-3 mr-2 rounded-xl">{index + 1}</p>
                <img
                  src={import.meta.env.VITE_BACKEND_URL + data.profileimg}
                  className="w-[50px]  rounded-xl aspect-square object-cover"
                />
                <div>
                  <div className="flex gap-2 items-center">
                    {data.status ? (
                      <div className="rounded-full w-[15px] h-[15px] bg-green-400 shadow-lg shadow-green-400"></div>
                    ) : (
                      <div className="rounded-full w-[15px] h-[15px] bg-red-400 shadow-lg shadow-red-400"></div>
                    )}
                    <p className="font-bold text-xl">{data.name}</p>
                  </div>
                  <p className="text-sm text-gray-500">@{data.username}</p>
                </div>
                <button
                  onClick={(e) => handleAddFriend(data._id)}
                  className="flex items-center gap-2 border-2 border-solid rounded-lg ml-4 px-4 py-2 hover:bg-slate-200"
                >
                  <FaUserPlus color="black" /> Add Friend
                </button>
                <button
                  onClick={(e) => handleCancelFriendRequest(data._id)}
                  className="flex items-center gap-2 border-2 border-solid rounded-lg px-4 py-2 hover:bg-slate-200"
                >
                  <FaUserXmark color="black" /> Remove
                </button>
              </div>
            ))}
      </div>
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
};

export default FriendsPage;
