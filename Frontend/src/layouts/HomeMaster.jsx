import React, { useEffect } from "react";
import { decodeJWT, isLoggedIn, logoutUser } from "../utils/userApis";
import { Outlet, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import Navbar from "../components/Navbar";
import { setUserStatus } from "../utils/userDataApi";
import { decode } from "punycode";

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
    <div className="h-screen w-full flex justify-center items-center bg-[#F5F5F5]">
      <div className="relative border-solid bg-white border-gray-200 border-[1px] shadow-lg rounded-3xl min-w-[400px] max-w-[400px] h-[90%]">
        <Navbar />
        <Outlet />
      </div>
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
};

export default HomeMaster;
