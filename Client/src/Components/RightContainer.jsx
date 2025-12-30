import React, { useContext } from 'react'
import { AuthContext } from '../../Context/AuthContext'

function RightContainer({ selected, setSelected }) {
  const { selectedUser, setAuthUser, setToken } = useContext(AuthContext);


  if (selected && selectedUser) {
    return (
      <div className='h-full flex flex-col items-center pt-10 px-4'>
        <div className='flex flex-col items-center text-center gap-3'>
          <img 
            src="https://cdn-icons-png.flaticon.com/512/10337/10337609.png" 
            className='h-32 w-32 md:h-40 md:w-40 rounded-full object-cover border-4 border-white/10' 
            alt="" 
          />
          <div>
            <p className='text-2xl font-semibold'>{selectedUser.fullname}</p>
            <p className='text-sm font-light text-white/70 mt-1'>{selectedUser.bio || "No bio available"}</p>
          </div>
        </div>

   
        <div className='mt-auto mb-10'>
          <button
            onClick={() => {
              setToken(null);
              setAuthUser(null);
              localStorage.clear();
            }}
            className='text-red-500 hover:text-red-400 hover:bg-red-500/10 px-6 py-2 rounded-full transition-all duration-300'
          >
            Logout
          </button>
        </div>
      </div>
    )
  }


  return (
    <div className='w-full h-full flex flex-col items-center justify-center text-center p-5'>
      <img 
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_iT-fCTP6oUN9eDQXy9zYAT3ESyYU63o_5g&s" 
        className='rounded-full shadow-lg h-24 w-24 md:h-28 md:w-28 shadow-purple-500/20 mb-5' 
        alt="" 
      />
      <h2 className='text-xl md:text-2xl'>
        Welcome to <span className='text-purple-400 font-bold'>ChatBot!</span>
      </h2>
      <p className='text-white/60 mt-2'>Select a user to start chatting</p>
    </div>
  )
}

export default RightContainer;