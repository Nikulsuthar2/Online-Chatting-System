import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaRegCircleCheck, FaRegCircleXmark } from "react-icons/fa6";
import { createUser, isLoggedIn, isUsernameExist } from "../utils/userApis";
import { validate } from "email-validator";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { PulseLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import DefaultImg from "../assets/default_img/profiledef.png";

const SigninPage = () => {
  const [username, setusername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [name, setName] = useState("");

  const [isUsernameAvailable, setisUsernameAvailable] = useState(false);
  const [usernameResultMsg, setusernameResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkUsername = async (e) => {
    if (e.target.value != 0) {
      const [success, res] = await isUsernameExist(
        e.target.value.toLowerCase()
      );
      if (success) {
        setisUsernameAvailable(res.result);
        document.getElementById("username-result").hidden = false;
        setusernameResult(res.msg);
      } else {
        setisUsernameAvailable(false);
        setusernameResult("");
      }
    } else {
      setisUsernameAvailable(false);
      setusernameResult("");
    }
  };

  const handleProfileImg = (e) => {
    setSelectedProfile(e.target.files[0]);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById("proimg").src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    const isNameAvailable = await isUsernameExist(username.toLowerCase());
    if (!isNameAvailable[1].result) {
      toast.error(isNameAvailable[1].msg);
      return;
    }
    if (!validate(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (password !== cpassword) {
      toast.error("Passwords are not matching");
      return;
    }

    const form = new FormData();
    form.append("profile", selectedProfile);
    form.append("username", username);
    form.append("email", email);
    form.append("pswd", password);
    form.append("name", name ?? "User");

    setIsSubmitting(true);
    const res = await createUser(form);
    setIsSubmitting(false);

    if (res.data.success) {
      console.log(res);
      toast.success(res.data.msg);
      const token = res.data.token;
      localStorage.setItem("accessToken", res.data.token);
      navigate("/home");
      /*console.log(token);
      console.log(decodeJWT(token));
      console.log(isTokenExpired(token));*/
    } else {
      toast.error(res.data.msg);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const isLogin = async () => {
      const res = await isLoggedIn(token);
      if (res) {
        //navigate("/home");
      }
    };
    isLogin();
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-gray-100 flex justify-center items-center">
      <Link
        to={"/"}
        className="absolute hidden md:block bg-nikblue top-0 left-0 hover:bg-nikblue-light text-white text-md font-bold py-2 px-8 mt-4 ml-4 rounded-xl"
      >
        Back to home
      </Link>
      <form
        onSubmit={handleSignin}
        className="h-full w-full overflow-auto md:w-fit md:h-fit bg-white flex flex-col gap-3 border-solid border-gray-200 md:border-2 shadow-lg md:rounded-3xl p-3  md:min-w-[400px] md:max-w-[500px]"
      >
        <label className="text-center font-bold text-3xl md:text-5xl py-6 flex items-center gap-6">
          <Link to={"/"} className="block md:hidden bg-black text-white p-2 rounded-md text-xl"><FaArrowLeft/></Link>
          Create Account
        </label>
        <div className="flex flex-col-reverse md:flex-row gap-2 items-stretch md:items-end">
          <div className="w-full md:w-[50%] flex flex-col gap-1">
            <label>Email Address</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-gray-100 py-2 px-2 rounded-md border-[1px]"
              type="email"
              name="email"
              autoComplete="true"
              required
              placeholder="Enter your email address"
            />
            <label>Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              minLength={8}
              className="bg-gray-100 py-2 px-2 rounded-md border-[1px]"
              type="password"
              name="pswd"
              required
              placeholder="Enter your password"
            />
            <label>Confirm Password</label>
            <input
              onChange={(e) => setCpassword(e.target.value)}
              value={cpassword}
              minLength={8}
              className="bg-gray-100 py-2 px-2 rounded-md border-[1px]"
              type="password"
              name="cpswd"
              required
              placeholder="Enter your password"
            />
          </div>
          <div className="w-full md:w-[50%] flex flex-col gap-1">
            <div className="w-full flex justify-center ">
              <label
                htmlFor="profileimg"
                className="aspect-square w-[30%] rounded-full md:rounded-3xl"
              >
                <img
                  src={DefaultImg}
                  id="proimg"
                  alt="profile image"
                  className="aspect-square rounded-full md:rounded-3xl object-cover"
                  loading="lazy"
                />
              </label>
              <input
                onChange={handleProfileImg}
                hidden
                id="profileimg"
                type="file"
                name="profileimg"
                accept=".png, .jpg"
              />
            </div>
            <label>username</label>
            <div className="flex gap-2 items-center bg-gray-100 py-2 px-2 rounded-md border-[1px]">
              <input
                className="w-full bg-transparent outline-none"
                value={username}
                onChange={(e) => setusername(e.target.value.toLowerCase())}
                onKeyUp={checkUsername}
                onBlur={() => {
                  if (document.getElementById("username-result"))
                    document.getElementById("username-result").hidden = true;
                }}
                type="text"
                name="username"
                autoComplete="true"
                placeholder="Enter username"
                required
              />
              {username.length > 0 ? (
                isUsernameAvailable ? (
                  <FaRegCircleCheck color="green" />
                ) : (
                  <FaRegCircleXmark color="red" />
                )
              ) : (
                ""
              )}
            </div>
            {username.length > 0 ? (
              <label
                id="username-result"
                className={
                  isUsernameAvailable
                    ? "text-green-500 text-sm"
                    : "text-red-500 text-sm"
                }
              >
                {usernameResultMsg}
              </label>
            ) : (
              ""
            )}

            <label>Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="bg-gray-100 py-2 px-2 rounded-md border-[1px]"
              type="text"
              name="name"
              autoComplete="true"
              required
              placeholder="Enter your name"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-black hover:bg-slate-900 text-white shadow-md font-bold py-2 px-4 rounded-xl active:translate-y-1"
        >
          {isSubmitting ? <PulseLoader color="white" size={10} /> : "Signin"}
        </button>
        <Link to={"/login"} className="text-center font-bold text-nikblue hover:text-nikblue-light">Already have an account?</Link>
      </form>
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
};

export default SigninPage;
