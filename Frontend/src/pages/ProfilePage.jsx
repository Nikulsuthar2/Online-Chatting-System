import React, { useContext, useEffect, useState } from "react";
import { getUserData, updateProfile } from "../utils/userDataApi";
import { MdCancel } from "react-icons/md";
import { PulseLoader } from "react-spinners";
import defaultImg from "../assets/default_img/profiledef.png";
import { UserContext } from "../Context/UserContext";

const ProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [isLoading, setisLoading] = useState(true);
  const [isUpdating, setIsUpdating ] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Generate a URL for the image preview
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setSelectedFile(file);
    }
  };

  const cancelImageUpload = () => {
    setImagePreview(null);
    setSelectedFile(null);
  };

  const handleProfileUpdate = async () => {
    if(userData.name == name && userData.bio == bio && !selectedFile){
      return;
    }
    setIsUpdating(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);

    // Append the image only if it exists
    if (selectedFile) {
      formData.append('profileimg', selectedFile);
    }

    const res = await updateProfile(formData);

    if(res){
      //console.log(res);
      handleUserData();
      cancelImageUpload();
    }
    setIsUpdating(false);
  };

  const handleUserData = async (id) => {
    const data = await getUserData();
    setUserData(data.user[0]);
    setName(data.user[0].name);
    setBio(data.user[0].bio);
    //console.log(data.user[0]);
    setUser(data.user[0]);
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
          <PulseLoader color={window.matchMedia('(prefers-color-scheme: dark)').matches ? "white" : "black"} size={10} />
        </div>
      ) : (
        <div className="pt-14 px-[10px] pb-[10px] flex flex-col gap-2 w-full justify-between h-full dark:bg-black">
          <div className="scrollbar-hide overflow-auto">
            <div className="my-6 flex justify-center items-center">
              {!imagePreview ? (
                <label htmlFor="profileimg">
                  <img
                    src={
                      userData
                        ? import.meta.env.VITE_BACKEND_URL + userData.profileimg
                        : defaultImg
                    }
                    alt="profile image"
                    className="w-[100px] aspect-square object-cover rounded-full dark:border-2"
                  />
                </label>
              ) : (
                <div className="relative">
                  <label htmlFor="profileimg">
                    <img
                      src={imagePreview}
                      alt="profile image"
                      className="w-[100px] aspect-square object-cover border-[3px] border-[#000000] p-1 rounded-full"
                    />
                  </label>
                  <button
                    className="absolute top-0 right-0 bg-white rounded-full text-red-500 text-[30px]"
                    onClick={cancelImageUpload}
                  >
                    <MdCancel />
                  </button>
                </div>
              )}
              <input
                hidden
                type="file"
                id="profileimg"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="flex gap-[10px] flex-col dark:text-white">
              <label>Username</label>
              <input
                type="text"
                value={userData ? "@ " + userData.username : ""}
                className="bg-gray-200 dark:bg-[#131313] py-2 px-2 rounded-md border-[1px] dark:border-[#3f3f3f]"
                disabled
              />
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-100 dark:bg-[#2f2f2f] outline-none py-2 px-2 rounded-md border-[1px] dark:border-[#3f3f3f]"
              />
              <label>Bio</label>
              <textarea
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="bg-gray-100 dark:bg-[#2f2f2f] outline-none py-2 px-2 rounded-md border-[1px] dark:border-[#3f3f3f]"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleProfileUpdate}
            disabled={userData?.name == name && userData?.bio == bio && !selectedFile ? true : false}
            className="bg-black dark:bg-white dark:text-black disabled:bg-gray-400 dark:disabled:bg-gray-900 hover:bg-gray-600 dark:hover:bg-gray-400 text-white shadow-md font-bold py-2 px-4 rounded-xl active:translate-y-1"
          >
            {isUpdating ? <PulseLoader color="white" size={10} /> : "Update Profile"}
          </button>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
