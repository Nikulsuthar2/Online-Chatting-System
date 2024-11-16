import React, { useEffect } from "react";
import { decodeJWT, isLoggedIn, logoutUser } from "../utils/userApis";
import { Outlet, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import Navbar from "../components/Navbar";
import { setUserStatus } from "../utils/userDataApi";
import { decode } from "punycode";
import UserProvider from "../Context/UserContext";

const HomeMaster = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const decoded = decodeJWT(token);
    const isLogin = async () => {
      const res = await isLoggedIn(token);
      if (!res) {
        navigate("/login");
      }
    };
    isLogin();
  }, []);

  /*
  const handleUserStatus = async () => {
    const token = localStorage.getItem('accessToken');
    if(token){
      const decoded = decodeJWT(token);
      if(decoded){
        if(document.visibilityState === 'hidden') {
          const res = await setUserStatus(decoded.UserInfo.id, false);
        } else if (document.visibilityState === 'visible'){
          const res = await setUserStatus(decoded.UserInfo.id, true);
        }
      }
    }
  }

  document.addEventListener("visibilitychange", handleUserStatus);
*/
  return (
    <UserProvider>
    <div className="h-screen w-full flex justify-center items-center bg-[#F5F5F5]">
      <div className="relative w-full h-full border-solid bg-white border-gray-200 md:border-[1px] shadow-lg md:rounded-3xl md:min-w-[400px] md:max-w-[400px] md:h-[90%]">
        <Navbar />
        <Outlet />
      </div>
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
    </UserProvider>
  );
};

export default HomeMaster;
