import React, { useContext, useEffect, useState, useRef } from "react";
import { IoIosSend, IoMdArrowBack } from "react-icons/io"; 
import Messages from "./Messages";
import { AuthContext } from "../../Context/AuthContext";
import Loader from "./Loader";
import toast from 'react-hot-toast';


function ChatContainer({ selected, setSelected }) {
  const { selectedUser, axios, socket, onlineusers , authUser } = useContext(AuthContext);
  const isOnline = onlineusers?.includes(selectedUser?._id);
  const [loading, setloading] = useState(false);
  const [id, setid] = useState();
  const [messages, setmessages] = useState([]);
  const [msg, setmsg] = useState("");
  


  const getmessages = async () => {
    setloading(true);
    const backendurl = import.meta.env.VITE_BACKEND_URL;
    const tok = localStorage.getItem("token");

    try {
        const res = await axios.post(
        `${backendurl}/api/messages/getallmessaage`,
        { recieverId: selectedUser._id, tok }
        );

        setid(res.data.my_id);
        setmessages(res.data.messages);
    } catch (error) {
        console.log(error);
    }
    setloading(false);
  };

  useEffect(() => {
    if (selectedUser) getmessages();
  }, [selectedUser]);

  useEffect(() => {
    if (!socket) return;
    const handleIncomingMessage = (newMessage) => {
      if (
        newMessage.senderId === selectedUser?._id ||
        newMessage.recieverId === selectedUser?._id
      ) {
        setmessages((prev) => [...prev, newMessage]);
      }
    };
    socket.on("NewMessage", handleIncomingMessage);
    return () => socket.off("NewMessage", handleIncomingMessage);
  }, [socket, selectedUser]);



  const handleNewMessage = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;

    const backendurl = import.meta.env.VITE_BACKEND_URL;
    
    const res = await axios.post(`${backendurl}/api/messages/send`, {
      tok: localStorage.getItem("token"),
      text: msg,
      recieverId: selectedUser._id,
    });

    setmessages((prev) => [...prev, res.data.new_message]);
    setmsg("");
  };
   
  
   const [clearChat , setclearChat] = useState(false);
   const [butt,setbutt] = useState(false);

  const handleClearChat = async ()=>{
   
     toast(
    () => (
      <div className="bg-white/5">
        <p className="text-red-600 font-medium mb-3">
         ⚠️ Are you sure you want to clear the chats
        </p>

        <div className="w-full flex items-center justify-between">
          <button
            className="px-3 py-1 bg-red-500 text-white rounded"
            onClick={handelYes}
          >
            Yes
          </button>

          <button
            className="px-3 py-1 bg-gray-300 text-black rounded"
            onClick={() => {
              setclearChat(false);
              toast.dismiss();
            }}
          >
            No
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeButton: false,
      closeOnClick: false,
    }
  );
  
 
  }

  const handelYes = async ()=>{
    toast.dismiss();
    setclearChat(true);
  setbutt(true);
  const backendurl = import.meta.env.VITE_BACKEND_URL;
  const res = await axios.post(`${backendurl}/api/messages/deletemessages`,{myid : authUser._id , recieverId : selectedUser._id });

  if(res.data.success){
    toast.success(res.data.message);
    setmessages([]);
     setclearChat(false);
  setbutt(false);
  }
  else{
    toast.error(res.data.message);
  }
  setclearChat(false);
  setbutt(false);

  }


  if (!selectedUser) {
      return (
          <div className="hidden md:flex flex-col items-center justify-center h-full w-full text-center">
              <img src="https://cdn-icons-png.flaticon.com/512/10337/10337609.png" className="h-24 w-24 opacity-50 mb-4" />
              <h1 className="text-xl">Select a user to start chatting</h1>
          </div>
      )
  }

  return (
    <div className="flex flex-col h-full w-full relative">
      
 
      <div className="header flex items-center gap-3 h-16 px-4 bg-white/5 shrink-0">
     
        <button 
            onClick={() => setSelected(false)} 
            className="md:hidden p-2 -ml-2 hover:bg-white/10 rounded-full"
        >
            <IoMdArrowBack className="text-xl" />
        </button>

        <img
          src="https://cdn-icons-png.flaticon.com/512/10337/10337609.png"
          className="rounded-full h-10 w-10 object-cover"
          alt=""
        />
        <div className="flex flex-col">
            <h1 className="font-medium text-sm leading-tight">
            {selectedUser?.fullname}
            </h1>
            <span className={`text-xs ${isOnline ? "text-green-500" : "text-gray-400"}`}>
            {isOnline ? "Online" : "Offline"}
            </span>
        </div>

         <button onClick={handleClearChat} disabled={butt}  className="text-blue-400 disabled:opacity-50
    disabled:cursor-not-allowed absolute right-5 hover:cursor-pointer text-sm">
        Clear Chat
        </button>
       
      </div>

      

   
      <div className="md:h-100   overflow-auto p-4 w-full flex flex-col gap-2">
        {loading ? <Loader /> : <Messages messages={messages} id={id} />}
        
      </div>

      <div className="p-3 w-full absolute bottom-3   bg-transparent shrink-0">
        <form
            className="flex items-center w-full gap-2"
            onSubmit={handleNewMessage}
        >
            <input
            value={msg}
            onChange={(e) => setmsg(e.target.value)}
            placeholder="Type a message"
            className="flex-1 rounded-full px-4 h-12 bg-white/10 outline-none border border-transparent focus:border-white/20 text-white"
            />
            <button type="submit" className="rounded-full h-12 w-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white">
            <IoIosSend size={20}/>
            </button>
        </form>
      </div>
    </div>
  );
}

export default ChatContainer;