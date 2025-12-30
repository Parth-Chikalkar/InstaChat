import React from 'react'

function Loader() {
  return (
    <div className='flex items-center justify-center h-full w-full gap-1'>
      <div className='h-2 w-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
      <div className='h-2 w-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
      <div className='h-2 w-2 bg-purple-500 rounded-full animate-bounce'></div>
    </div>
  )
}

export default Loader