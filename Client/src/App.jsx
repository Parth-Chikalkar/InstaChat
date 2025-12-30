import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import LoginPage from './Pages/LoginPage'
import ProfilePage from './Pages/ProfilePage'
import SignupPage from './Pages/SignupPage'
import EditProfile from './Pages/EditProfile'
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className='bg-gradient-to-tl h-screen w-full text-white/90 from-[#220135] to-zinc-900'>
     <Toaster position='top-center' reverseOrder={false} />
    <Routes>
       <Route path='/' element={<HomePage/>}/>
       <Route path='/login' element={<LoginPage/>}/>
       <Route path='/profile' element={<ProfilePage/>}/>
       <Route path='/signup' element={<SignupPage/>}/>
       <Route path='/editprofile' element={<EditProfile/>}/>
    </Routes>
    </div>
  )
}

export default App