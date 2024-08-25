import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { decodeJWT, isLoggedIn, logoutUser } from "../utils/userApis";
import {
  cancelFriendRequest,
  getSearchUsers,
  getTotalFriendRequests,
  getUserStatus,
  sendFriendRequest,
} from "../utils/userDataApi";
import { FaUserMinus, FaUserPlus, FaUsers } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { FaUserFriends } from "react-icons/fa";

const Navbar = () => {
  const [loginData, setLoginData] = useState(null);
  const [searchbar, setsearchbar] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [getSearchData, setGetSearchData] = useState([]);
  const [friendRequestCount, setFriendRequestCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const decoded = decodeJWT(token).UserInfo;
    const isLogin = async () => {
      const res = await isLoggedIn(token);
      if (res) {
        setLoginData(decoded);
        const status = await getUserStatus(decoded.id);
      } else {
        setLoginData(null);
      }
    };
    isLogin();

    const getTotalFriendReqs = async () => {
      const res = await getTotalFriendRequests();
      if (res && res.result) {
        //console.log(res.msg, friendRequestCount);
        setFriendRequestCount(res.msg);
      }
    };
    const intervalReq = setInterval(getTotalFriendReqs, 3000);

    return () => clearInterval(intervalReq);
  }, []);

  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await logoutUser();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const handleSearchBar = async (e) => {
    const token = localStorage.getItem("accessToken");
    setsearchbar(e.target.value);
    if (e.target.value == "") {
      setIsSearching(false);
    } else {
      setIsSearching(true);
      const res = await getSearchUsers(e.target.value);
      if (
        res.status === 200 &&
        res.data.length > 0 &&
        getSearchData != res.data
      ) {
        setLoginData(decodeJWT(token).UserInfo);
        setGetSearchData(res.data);
        //console.log(getSearchData);
      } else {
        setGetSearchData([]);
      }
    }
  };

  const handleSendFriendRequest = async (uid) => {
    const res = await sendFriendRequest(uid);
    setIsSearching(false);
    setsearchbar("");
    //console.log(res);
    if (res.result) {
      toast.success("Friend Request Sent");
    }
  };

  const handleCancelFriendRequest = async (uid) => {
    const res = await cancelFriendRequest(uid);
    setIsSearching(false);
    setsearchbar("");
    //console.log(res);
    if (res.result) {
      toast.success("Friend Request Cancel");
    }
  };

  return (
    <nav className="bg-white text-white py-2 px-32 fixed w-full flex justify-between items-center shadow-md backdrop-blur-md">
      <Link to={"/home"} className="font-bold text-black">
        Chat App
      </Link>
      <div>
        <input
          type="search"
          onChange={handleSearchBar}
          onBlur={()=>setIsSearching(false)}
          onFocus={(e)=> {if(e.target.value !== "") setIsSearching(true)}}
          placeholder="Search User"
          className="text-black bg-gray-100 border-solid border-gray-400 outline-none rounded-md border-2 px-3 py-1"
        />
        {isSearching ? (
          <div
            id="search-result"
            className="absolute w-[250px] p-1 top-[70px] bg-white text-black border-gray-200 border-2 rounded-2xl z-10 shadow-lg"
          >
            {getSearchData.length == 0 ? (
              <div className="flex p-4 font-bold gap-2 justify-center">
                No User Found
              </div>
            ) : (
              getSearchData
                .filter((el) => el.isCurrentUser !== true)
                .map((data) => (
                  <div
                    key={data._id}
                    className="flex items-center gap-2 justify-between"
                  >
                    <Link
                      to={"/home/profile/" + data._id}
                      onClick={() => setIsSearching(false)}
                      className="flex p-1 gap-2 w-full justify-between items-center hover:bg-gray-100 rounded-xl"
                    >
                      <div className="w-14 rounded-xl">
                        <img
                          className="w-14 rounded-xl aspect-square object-cover"
                          src={
                            import.meta.env.VITE_BACKEND_URL + data.profileimg
                          }
                        />
                      </div>
                      <div className="flex flex-col w-[70%]">
                        <div className="flex gap-2 items-center">
                          {data.status ? (
                            <div className="rounded-full w-[15px] h-[15px] bg-green-400 shadow-lg shadow-green-400"></div>
                          ) : (
                            <div className="rounded-full w-[15px] h-[15px] bg-red-400 shadow-lg shadow-red-400"></div>
                          )}
                          <span className="font-bold text-lg truncate">
                            @{data.username}
                          </span>
                        </div>
                        <span className="text-sm">{data.name}</span>
                      </div>
                    </Link>
                    <div className="pr-2 hover:bg-slate-100 rounded">
                      {data.isRequested ? (
                        <FaUserMinus
                          color="red"
                          className="cursor-pointer"
                          size={30}
                          onClick={() => handleCancelFriendRequest(data._id)}
                        />
                      ) : (
                        <FaUserPlus
                          color="green"
                          className="cursor-pointer"
                          size={30}
                          onClick={() => handleSendFriendRequest(data._id)}
                        />
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="flex gap-4 items-center">
        <Link
          to={friendRequestCount > 0 ? "/home/friends/1" : "/home/friends/0"}
          className="cursor-pointer relative hover:bg-slate-100 rounded-full p-2"
        >
          <FaUserFriends color="black" size={25} />
          {friendRequestCount > 0 ? (
            <div className="w-5 h-5 text-[10px] bg-red-500 absolute top-0 right-0 rounded-full border-white border-2 flex justify-center items-center">
              {friendRequestCount}
            </div>
          ) : (
            ""
          )}
        </Link>
        <Link to={"/home/profile"}>
          {loginData ? (
            <img
              src={import.meta.env.VITE_BACKEND_URL + loginData.profileimg}
              alt=""
              className="w-[40px] rounded-xl aspect-square object-cover"
            />
          ) : (
            "hello"
          )}
        </Link>
        <button
          onClick={handleLogout}
          className="bg-blue-600 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
