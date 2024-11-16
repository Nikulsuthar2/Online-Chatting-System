import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { decodeJWT, isLoggedIn, logoutUser } from "../utils/userApis";
import { getTotalFriendRequests, getUserStatus } from "../utils/userDataApi";
import "react-toastify/ReactToastify.css";
import { MdExitToApp, MdSearch, MdSupervisorAccount } from "react-icons/md";
import { UserContext } from "../Context/UserContext";

const Navbar = () => {
  const { user } = useContext(UserContext);
  const [loginData, setLoginData] = useState(null);
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

  return (
    <nav className="bg-[#ffffff29] text-white absolute top-0 left-0 z-10 px-[10px] py-[10px] w-full flex justify-between items-center border-b-[1px] backdrop-blur-md rounded-t-3xl">
      <Link title="Home" to={"/home"} className="h-[40px] px-[20px] font-semibold text-black bg-[#F1F1F1] hover:bg-slate-200 rounded-[15px] flex justify-center items-center cursor-pointer active:translate-y-1 relative">
        {loginData ? loginData.username : "Chat App"}
      </Link>
      <div className="flex gap-[10px]">
        <Link
          to={"/home/search"}
          className="h-[40px] w-[40px] text-black bg-[#F1F1F1] hover:bg-slate-200 rounded-[15px] flex justify-center items-center cursor-pointer active:translate-y-1"
        >
          <MdSearch size={25} />
        </Link>
        <Link
          to={friendRequestCount > 0 ? "/home/friends/1" : "/home/friends/0"}
          className="h-[40px] w-[40px] text-black bg-[#F1F1F1] hover:bg-slate-200 rounded-[15px] flex justify-center items-center cursor-pointer active:translate-y-1 relative"
        >
          <MdSupervisorAccount size={25} />
          {friendRequestCount > 0 ? (
            <div className="w-5 h-5 text-[10px] text-white bg-red-500 absolute -top-1 -right-1 rounded-full border-white border-2 flex justify-center items-center">
              {friendRequestCount}
            </div>
          ) : (
            ""
          )}
        </Link>
        <Link to={"/home/profile"}>
          {loginData ? (
            <img
              src={import.meta.env.VITE_BACKEND_URL + user.profileimg}
              alt=""
              className="h-[40px] w-[40px] rounded-[15px] aspect-square object-cover"
            />
          ) : (
            "No"
          )}
        </Link>
        <button
          onClick={handleLogout}
          className="h-[40px] w-[40px] bg-black hover:bg-slate-700 rounded-[15px] flex justify-center items-center cursor-pointer active:translate-y-1"
        >
          <MdExitToApp size={25} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
