import React, { useState } from 'react'
import AuthLayout from './layouts/AuthLayout'
import HomeMaster from './layouts/HomeMaster'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Landing from './pages/Landing'
import SigninPage from './pages/SigninPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import FriendsPage from './pages/FriendsPage'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      <Route path='/' element={<AuthLayout/>}>
        <Route index element={<Landing/>}></Route>
        <Route path='/login' element={<LoginPage/>}></Route>
        <Route path='/signin' element={<SigninPage/>}></Route>
      </Route>
      <Route path='/home' element={<HomeMaster/>}>
        <Route index element={<HomePage/>}/>
        <Route path='/home/profile' element={<ProfilePage/>}/>
        <Route path='/home/profile/:id' element={<ProfilePage/>}/>
        <Route path='/home/friends/:val' element={<FriendsPage/>}/>
      </Route>
      </>
    )
  )

  return <RouterProvider router={router}/>;
}

export default App