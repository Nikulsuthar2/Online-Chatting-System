import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div>
        <nav className='bg-white text-white py-3 px-32 fixed w-full flex justify-between items-center shadow-md'>
            <Link to={'/'} className='font-bold text-black'>Chat App</Link>
            <div className='flex gap-2'>
                <Link to={'/login'} className='bg-black hover:bg-gray-600 text-white shadow-md font-bold py-1 px-4 rounded-md'>Login</Link>
                <Link to={'/signin'} className='bg-blue-500 hover:bg-blue-300 text-white shadow-md font-bold py-1 px-4 rounded-md'>Create Account</Link>
            </div>
        </nav>
        <Outlet/>
    </div>
  )
}

export default AuthLayout