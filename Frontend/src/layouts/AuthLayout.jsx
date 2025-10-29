import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <>
    <div>Auth</div>
    <div>
        <Outlet/>
    </div>
    </>
  )
}

export default AuthLayout