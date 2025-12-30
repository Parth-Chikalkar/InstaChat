import React, { useContext, useEffect, useState } from 'react';
import LeftContainer from '../Components/LeftContainer';
import ChatContainer from '../Components/ChatContainer';
import RightContainer from '../Components/RightContainer';
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [selected, setSelected] = useState(false);
  const { token } = useContext(AuthContext);
  const nav = useNavigate();

  useEffect(() => {
    if (!token) {
      nav("/login");
    }
  }, [token, nav]);

  return (
  
    <div className='h-screen w-full bg-black/90 md:px-10 lg:px-40 md:py-16 text-white'>
      <div className={`
        w-full h-full 
        rounded-xl overflow-hidden
        bg-white/5 backdrop-blur-[20px] border border-white/10
        ${selected 
            ? "grid grid-cols-1 md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_2fr_1fr]" 
            : "grid grid-cols-1 md:grid-cols-[1fr_2fr]" 
        }
      `}>
        
      
        <div className={`${selected ? "hidden md:block" : "block"} h-full`}>
            <LeftContainer setSelected={setSelected} selected={selected} />
        </div>

        <div className={`${!selected ? "hidden md:block" : "block"} h-full bg-black/20`}>
             <ChatContainer setSelected={setSelected} selected={selected} />
        </div>

        <div className={`${selected ? "hidden lg:block" : "hidden"} h-full border-l border-white/10`}>
            <RightContainer setSelected={setSelected} selected={selected} />
        </div>

      </div>
    </div>
  );
}

export default HomePage;