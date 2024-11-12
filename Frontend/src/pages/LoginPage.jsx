import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { FaArrowLeft } from "react-icons/fa6";

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
    <div className="h-screen overflow-hidden bg-gray-100 flex flex-col md:flex-row md:justify-center items-center gap-2">
      <Link
        to={"/"}
        className="absolute hidden md:block bg-nikblue top-0 left-0 hover:bg-nikblue-light text-white text-md font-bold py-2 px-8 mt-4 ml-4 rounded-xl"
      >
        Back to home
      </Link>
      <form
        onSubmit={handleLogin}
        className="h-full w-full overflow-auto md:w-fit md:h-fit bg-white flex flex-col gap-3 border-solid border-gray-200 border-2 shadow-lg rounded-none md:rounded-3xl p-3 md:min-w-[300px]"
      >
        <label className="text-center font-bold text-3xl md:text-5xl py-6 flex items-center gap-6">
          <Link to={"/"} className="block md:hidden bg-black text-white p-2 rounded-md text-xl"><FaArrowLeft/></Link>
          Login
        </label>
        <div className="w-full flex flex-col gap-2">
          <label>Email Address</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            autoComplete="username"
            className="bg-gray-100 py-2 px-2 rounded-md border-[1px]"
            type="email"
            required
            placeholder="Enter your email address"
          />
          <label>Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            minLength={8}
            autoComplete="current-password"
            className="bg-gray-100 py-2 px-2 rounded-md border-[1px]"
            type="password"
            required
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-black hover:bg-gray-600 text-white shadow-md font-bold py-2 px-4 rounded-xl active:translate-y-1"
        >
          {isSubmitting ? <PulseLoader color="white" size={10} /> : "Login"}
        </button>
        <Link to={"/signin"} className="text-center font-bold text-nikblue hover:text-nikblue-light">Don't have an account?</Link>
      </form>
      {alreadyLoggedIn ? (
        <div className="w-full md:w-fit flex flex-row md:flex-col justify-between items-center gap-2 bg-white border-solid border-gray-200 border-2 shadow-lg  rounded-3xl p-3">
          <img
            src={
              import.meta.env.VITE_BACKEND_URL +
              alreadyloginData.profileimg
            }
            alt=""
            className="object-cover rounded-full aspect-square w-[50px] md:w-[100px] mt-0 md:mt-4"
          />
          <label className="text-xl font-semibold">
            {alreadyloginData.username}
          </label>
          <button
            onClick={() => navigate("/home")}
            className="bg-blue-600 hover:bg-blue-400 text-white shadow-md font-bold py-2 px-4 rounded-xl active:translate-y-1"
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
