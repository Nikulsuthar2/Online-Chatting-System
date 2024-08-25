import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validate } from "email-validator";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { PulseLoader } from "react-spinners";
import {
  decodeJWT,
  isLoggedIn,
  loginUser,
  refreshAccessToken,
} from "../utils/userApis";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadyLoggedIn, setalreadyLoggedIn] = useState(false);
  const [alreadyloginData, setAlreadyloginData] = useState({});

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    const user = {
      email: email,
      pswd: password,
    };

    setIsSubmitting(true);
    const res = await loginUser(user);
    setIsSubmitting(false);

    if (res.data.success) {
      toast.success(res.data.msg);
      const token = res.data.token;
      localStorage.setItem("accessToken", res.data.token);
      localStorage.setItem("userInfo", decodeJWT(token).UserInfo);
      navigate("/home");
    } else {
      toast.error(res.data.msg);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const isLogin = async () => {
      const res = await isLoggedIn(token);
      if (res) {
        //console.log(decodeJWT(token).UserInfo);
        setalreadyLoggedIn(true);
        setAlreadyloginData(decodeJWT(token).UserInfo);
      } else {
        setalreadyLoggedIn(false);
        setAlreadyloginData({});
      }
    };
    isLogin();
  }, []);

  return (
    <div className="h-screen bg-gray-100 flex justify-center items-center gap-2">
      <form
        onSubmit={handleLogin}
        className="bg-white flex flex-col gap-2 border-solid border-gray-200 border-2 shadow-lg  rounded-lg p-3 min-w-[300px]"
      >
        <label className="text-center font-bold text-3xl py-4">Login</label>
        <div className="w-full flex flex-col">
          <label>Email Address</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            autoComplete="username"
            className="bg-gray-100 py-1 px-2 rounded-md"
            type="email"
            required
            placeholder="Enter your email address"
          />
        </div>
        <div className="w-full flex flex-col">
          <label>Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            minLength={8}
            autoComplete="current-password"
            className="bg-gray-100 py-1 px-2 rounded-md"
            type="password"
            required
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-black hover:bg-gray-600 text-white shadow-md font-bold py-2 px-4 mt-4 rounded-md"
        >
          {isSubmitting ? <PulseLoader color="white" size={10} /> : "Login"}
        </button>
      </form>
      {alreadyLoggedIn ? (
        <div className="flex flex-col items-center gap-2 bg-white border-solid border-gray-200 border-2 shadow-lg  rounded-lg p-4">
          <img
            src={
              import.meta.env.VITE_BACKEND_URL +
              alreadyloginData.profileimg
            }
            alt=""
            className="object-cover rounded-full aspect-square w-[100px]"
          />
          <label className="text-2xl font-bold">
            {alreadyloginData.username}
          </label>
          <button
            onClick={() => navigate("/home")}
            className="bg-blue-600 hover:bg-blue-400 text-white shadow-md font-bold py-2 px-4 mt-4 rounded-md"
          >
            Continue as {alreadyloginData.username}
          </button>
        </div>
      ) : (
        ""
      )}
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
};

export default LoginPage;
