import React from 'react'
import {Link} from 'react-router-dom'

const Landing = () => {
  return (
    <div className='h-screen bg-gray-100 flex justify-center items-center'>
        <div className='flex flex-col items-center gap-10'>
            <label className='text-6xl w-[70%] font-bold text-center leading-[80px]'>Connect with your 🧑‍🤝‍🧑friends and 👨‍👩‍👧‍👦 family 😊 🙌</label>
            <Link to={'/signin'} className='bg-black hover:bg-gray-600 text-white text-2xl shadow-md font-bold py-2 px-8 rounded-md'>Get Started</Link>
        </div>
    </div>
  )
}

export default Landing