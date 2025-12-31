import React, { useContext, useEffect, useState } from 'react'
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import UserLeft from './UserLeft';
import { AuthContext } from '../../Context/AuthContext';
import Loader from './Loader';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

function LeftContainer({ selected, setSelected }) {
  const [visible, setvisible] = useState(false);
  const { setToken, setAuthUser, axios } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUsers = async () => {
    setLoading(true);
    const backendurl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token");

    const res = await axios.post(`${backendurl}/api/auth/getUsers`, { token });

    if (res.data.success) {
      setUsers(res.data.users);
      setAllUsers(res.data.users); 
    }

    setLoading(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleSearch = (val) => {
    if (!val.trim()) {
      setUsers(allUsers); 
      return;
    }

    const filtered = allUsers.filter(user =>
      user.fullname.toLowerCase().includes(val.toLowerCase())
    );

    setUsers(filtered);
    if(filtered.length === 0){ 
   
    }
  };


  return (
    <div className='h-full flex flex-col w-full'>
      
      
      <div className="header flex items-center justify-between p-4 h-16 border-b border-white/10">
        <div className='flex gap-3 items-center'>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_iT-fCTP6oUN9eDQXy9zYAT3ESyYU63o_5g&s"
            className='h-10 w-10 rounded-full'
            alt="img"
          />
          <p className='font-semibold text-lg'>InstaChat</p>
        </div>
          <button className='text-red-500 md:hidden' onClick={()=>{  setToken(null);
              setAuthUser(null);
              localStorage.clear();}} >Logout</button>
     
      </div>

     

  
      <div className="searchbar w-full p-3">
        <div className="flex items-center w-full">
            <input
            type="text"
            onChange={(e) => handleSearch(e.target.value)}
            className='outline-none shadow-md text-black w-full rounded-l-full h-10 bg-white pl-4'
            placeholder='Search User'
            />
            <button type='submit' className='h-10 w-12 bg-white rounded-r-full flex items-center justify-center border-l'>
            <CiSearch className='text-black text-xl' />
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className='flex justify-center mt-10'><Loader /></div>
        ) : (
          <div className="flex flex-col">
            {users?.length > 0 &&
              users.map((elem) => (
                <UserLeft
                  key={elem._id}
                  elem={elem}
                  selected={selected}
                  setSelected={setSelected}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LeftContainer;