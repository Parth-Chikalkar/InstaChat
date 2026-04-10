import React, { useContext, useState } from 'react'
import { AuthContext } from '../../Context/AuthContext'

function RightContainer({ selected }) {
  const { selectedUser, authUser, setAuthUser, setToken } = useContext(AuthContext);




  if (selected && selectedUser) {
    return (
      <div className='h-full flex flex-col items-center pt-10 px-4'>

        {/* USER INFO */}
        <div className='flex flex-col items-center text-center gap-3'>
          <img 
            src="https://cdn-icons-png.flaticon.com/512/10337/10337609.png" 
            className='h-32 w-32 rounded-full border-4 border-white/10' 
            alt="" 
          />
          <div>
            <p className='text-2xl font-semibold'>{selectedUser.fullname}</p>
            <p className='text-sm text-white/70 mt-1'>
              {selectedUser.bio || "No bio available"}
            </p>
          </div>
        </div>

        
       

       
    

        {/* LOGOUT */}
        <div className='mt-auto mb-10'>
          <button
            onClick={() => {
              setToken(null);
              setAuthUser(null);
              localStorage.clear();
            }}
            className='text-red-500 hover:bg-red-500/10 px-6 py-2 rounded-full'
          >
            Logout
          </button>
        </div>

      </div>
    )
  }

  return (
    <div className='w-full h-full flex flex-col items-center justify-center text-center p-5'>
      <h2 className='text-xl'>
        Welcome to <span className='text-purple-400 font-bold'>ChatBot!</span>
      </h2>
      <p className='text-white/60 mt-2'>Select a user to start chatting</p>
    </div>
  )
}

export default RightContainer;