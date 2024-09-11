import React, { useEffect, useState } from "react";
import { getUserData } from "../utils/userDataApi";
import { PulseLoader } from "react-spinners";
import defaultImg from "../assets/default_img/profiledef.png";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setisLoading] = useState(true);
  const [name, setName] = useState("")

  const handleUserData = async (id) => {
    const data = await getUserData();
    setUserData(data.user[0]);
    setName(data.user[0].name);
    console.log(data.user[0]);
  };

  useEffect(() => {
    setisLoading(true);
    handleUserData();
    setisLoading(false);
  }, []);

  return (
    <>
      {isLoading ? (
        <div>
          <PulseLoader color="white" size={10} />
        </div>
      ) : (
        <div className="pt-14 px-[10px] pb-[10px] flex flex-col w-full justify-between h-full">
          <div className="flex justify-center items-center">
            <img
              src={
                userData
                  ? import.meta.env.VITE_BACKEND_URL + userData.profileimg
                  : defaultImg
              }
              alt="profile image"
              className="mt-10 w-[150px] aspect-square object-cover rounded-full"
            />
          </div>
          <div className="flex gap-[10px] flex-col">
          <label>Username</label>
            <input
              type="text"
              value={userData ? "@ " + userData.username : ""}
              className="bg-gray-200 py-2 px-2 rounded-md border-[1px]"
              disabled
            />
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="bg-gray-100 outline-none py-2 px-2 rounded-md border-[1px]"
            />
          </div>
          <button
            type="submit"
            className="bg-black hover:bg-gray-600 text-white shadow-md font-bold py-2 px-4 rounded-xl active:translate-y-1"
          >
            Update
          </button>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
