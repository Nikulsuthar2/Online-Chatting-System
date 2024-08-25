import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getUserData } from '../utils/userDataApi';
import { PulseLoader } from 'react-spinners';
import defaultImg from '../assets/default_img/profiledef.png';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

const ProfilePage = () => {
    const [isCurrentUser, setisCurrentUser] = useState(true);
    const [userData, setUserData] = useState(null);
    const [isLoading, setisLoading] = useState(true);
    const param = useParams();

    const handleUserData = async (id) => {
        const data = await getUserData(id);
        setUserData(data.user);
        console.log(data.user);
    }

    useEffect(()=>{
        setisLoading(true);
        if(param.id){
            setisCurrentUser(false);
           
        }
        console.log(isCurrentUser);
        handleUserData(param.id);
        setisLoading(false);
    },[])
  return (
    <>
        {
            isLoading ? 
            <div>
                <PulseLoader color='white' size={10} />
            </div>  :
            <div className='pt-14 flex flex-col w-full items-center'>
            <img 
                src={userData ? import.meta.env.VITE_BACKEND_URL + userData.profileimg : defaultImg } 
                alt='profile image' 
                className='mt-10 w-[200px] aspect-square object-cover rounded-full' 
            />
            <p className='text-3xl font-bold'>{userData ? userData.name : "User's Name"}</p>
            <p className='text-xl'>{userData ? "@"+userData.username : "User's username"}</p>
            <ToastContainer position="bottom-right" theme="colored" />
            </div>

        }
    </>
  )
}

export default ProfilePage