import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../Context/AuthContext'
import toast from 'react-hot-toast';

function SignupPage() {
  const [fullname, setname] = useState();
  const [email, setemail] = useState();
  const [bio, setbio] = useState();
  const [password, setpass] = useState();
  const { axios, setToken, setAuthUser } = useContext(AuthContext);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const backendurl = import.meta.env.VITE_BACKEND_URL;

    try {
      const res = await axios.post(`${backendurl}/api/auth/signup`, { fullname, email, bio, password });
      if (res.data.success) {
        setToken(res.data.token);
        setAuthUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        toast.success(res.data.message);
        nav('/');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className='w-full min-h-screen bg-black/90 flex flex-col md:flex-row justify-center items-center gap-10 md:gap-32 px-4 py-10 text-white'>
      
      <Link to="/" className='flex flex-col items-center gap-4 hover:opacity-90 transition-opacity'>
        <img className='rounded-full h-32 w-32 object-cover border-4 border-white/10' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_iT-fCTP6oUN9eDQXy9zYAT3ESyYU63o_5g&s" alt="logo" />
        <h1 className='text-4xl font-semibold'>InstaChat</h1>
      </Link>

      <div className='bg-white/5 backdrop-blur-[20px] border border-white/10 p-8 rounded-xl w-full max-w-sm shadow-xl'>
        <p className='text-2xl font-medium mb-6 text-center'>Create Account</p>
        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4'>
          <input 
            type="text" 
            onChange={(e) => setname(e.target.value)} 
            placeholder='Full Name' 
            required 
            className='w-full rounded-lg px-4 h-12 bg-white/10 outline-none border border-transparent focus:border-white/20 text-white placeholder-gray-400 transition-all' 
          />
          <input 
            type="email" 
            onChange={(e) => setemail(e.target.value)} 
            placeholder='Email Address' 
            required 
            className='w-full rounded-lg px-4 h-12 bg-white/10 outline-none border border-transparent focus:border-white/20 text-white placeholder-gray-400 transition-all' 
          />
          <textarea 
            onChange={(e) => setbio(e.target.value)} 
            placeholder='A Short Bio' 
            className='w-full rounded-lg p-4 h-24 bg-white/10 outline-none border border-transparent focus:border-white/20 text-white placeholder-gray-400 resize-none transition-all' 
          ></textarea>
          <input 
            onChange={(e) => setpass(e.target.value)} 
            type="password" 
            placeholder='Password' 
            required 
            className='w-full rounded-lg px-4 h-12 bg-white/10 outline-none border border-transparent focus:border-white/20 text-white placeholder-gray-400 transition-all' 
          />
          <button className='w-full h-12 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors mt-2'>
            Sign Up
          </button>
        </form>
        <p className='text-sm text-white/50 mt-6 text-center'>
          Already have an account? <Link to="/login" className='text-purple-400 hover:text-purple-300 font-semibold ml-1'>Login</Link>
        </p>
      </div>

    </div>
  )
}

export default SignupPage