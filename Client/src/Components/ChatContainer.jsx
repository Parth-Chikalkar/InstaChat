import React, { useContext, useEffect, useState, useRef } from "react";
import { IoIosSend, IoMdArrowBack } from "react-icons/io";
import Messages from "./Messages";
import { AuthContext } from "../../Context/AuthContext";
import Loader from "./Loader";
import toast from "react-hot-toast";
import { IoIosCall } from "react-icons/io";
import { createVideoClient } from "../Utils/videoClient";

import {
  StreamVideo,
  StreamCall,
  SpeakerLayout,
  CallControls,
} from "@stream-io/video-react-sdk";

function ChatContainer({ selected, setSelected }) {
  const { selectedUser, axios, socket, onlineusers, authUser } =
    useContext(AuthContext);

  const isOnline = onlineusers?.includes(selectedUser?._id);

  // ✅ ALL STATES AT TOP
  const [loading, setloading] = useState(false);
  const [id, setid] = useState();
  const [messages, setmessages] = useState([]);
  const [msg, setmsg] = useState("");
  const [call, setCall] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [clearChat, setclearChat] = useState(false);
  const [butt, setbutt] = useState(false);
  const callRef = useRef(null);
  // ================= HOOKS =================

  useEffect(() => {
  callRef.current = call;
}, [call]);
  useEffect(() => {
    if (!socket) return;

    socket.on("incoming-call", (data) => {
      setIncomingCall(data);
    });

    return () => socket.off("incoming-call");
  }, [socket]);

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

  useEffect(() => {
    if (selectedUser) getmessages();
  }, [selectedUser]);

  useEffect(() => {
    if (!selectedUser && call) {
      call.leave();
      setCall(null);
    }
  }, [selectedUser]);
  useEffect(() => {
  if (!socket) return;

  socket.on("call-accepted", async ({ callId }) => {
    try {
      const client = await createVideoClient(authUser);

      const callInstance = client.call("default", callId);

      await callInstance.join();

      setCall(callInstance);
    } catch (err) {
      console.log(err);
      toast.error("Call failed");
    }
  });

  return () => socket.off("call-accepted");
}, [socket]);

useEffect(() => {
  if (!socket) return;

  socket.on("call-ended", async () => {
  try {
    if (callRef.current) {
      await callRef.current.leave();
    }
  } catch (e) {}

  setCall(null);
});

  return () => socket.off("call-ended");
}, [socket, call]);

  // ================= FUNCTIONS =================

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

  const handleNewMessage = async (e) => {
    e.preventDefault();
    if (!msg.trim() || call) return;

    const backendurl = import.meta.env.VITE_BACKEND_URL;

    const res = await axios.post(`${backendurl}/api/messages/send`, {
      tok: localStorage.getItem("token"),
      text: msg,
      recieverId: selectedUser._id,
    });

    setmessages((prev) => [...prev, res.data.new_message]);
    setmsg("");
  };

const handleStartCall = async () => {
  if (!selectedUser) return;

  const callId = [authUser._id, selectedUser._id].sort().join("-");

  try {
    // ✅ CREATE CALL FIRST (with userId)
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/create-call`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        callId,
        userId: authUser._id, // 🔥 REQUIRED FIX
      }),
    });

    // ✅ THEN notify
    socket.emit("incoming-call", {
      to: selectedUser._id,
      from: authUser,
      callId,
    });

    toast.success("Calling...");
  } catch (err) {
    console.log(err);
    toast.error("Call failed");
  }
};

 const handleAcceptCall = async () => {
  try {
    // 🔔 notify caller
    socket.emit("call-accepted", {
      to: incomingCall.from._id,
      callId: incomingCall.callId,
    });

    const client = await createVideoClient(authUser);

    const callInstance = client.call("default", incomingCall.callId);

    await callInstance.join();

    setCall(callInstance);
    setIncomingCall(null);
  } catch (err) {
    console.log(err);
    toast.error("Failed to join call");
  }
};

  const handleRejectCall = () => {
    setIncomingCall(null);
  };

const handleEndCall = async () => {
  try {
    if (callRef.current) {
      await callRef.current.leave();
    }
  } catch (e) {
    console.log("Error leaving call:", e);
  }

  // 🔔 always notify other user (even if leave fails)
  socket.emit("end-call", {
    to: selectedUser?._id,
  });

  // ✅ always clear state
  setCall(null);
};

  const handleClearChat = () => {
    toast(() => (
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
    ));
  };

  const handelYes = async () => {
    toast.dismiss();
    setbutt(true);

    const backendurl = import.meta.env.VITE_BACKEND_URL;

    const res = await axios.post(
      `${backendurl}/api/messages/deletemessages`,
      { myid: authUser._id, recieverId: selectedUser._id }
    );

    if (res.data.success) {
      toast.success(res.data.message);
      setmessages([]);
    } else {
      toast.error(res.data.message);
    }

    setbutt(false);
  };

  // ================= RETURN =================

  if (!selectedUser) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center h-full w-full text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/10337/10337609.png"
          className="h-24 w-24 opacity-50 mb-4"
        />
        <h1 className="text-xl">Select a user to start chatting</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:h-[530px] h-screen w-full relative">
      {/* HEADER */}
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
        />

        <div>
          <h1 className="text-sm">{selectedUser?.fullname}</h1>
          <span className={`text-xs ${isOnline ? "text-green-500" : "text-gray-400"}`}>
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>

        <button
          onClick={handleStartCall}
          disabled={butt}
          className="text-blue-400 flex items-center gap-2 border py-1 px-2 border-blue-500 rounded-full absolute right-25 text-sm"
        >
          <IoIosCall /> Video Call
        </button>

        <button
          onClick={handleClearChat}
          disabled={butt}
          className="text-blue-400 absolute right-5 text-sm"
        >
          Clear Chat
        </button>
      </div>

      {/* MESSAGES */}
      <div className="md:h-[400px] h-full overflow-scroll p-4 w-full flex flex-col gap-2">
        {loading ? <Loader /> : <Messages messages={messages} id={id} />}
      </div>

      {/* VIDEO */}
     {call && (
  <div className="fixed inset-0 z-50 bg-black flex flex-col">

    <StreamVideo client={call.client}>
      <StreamCall call={call}>

        {/* 🔝 TOP BAR */}
        <div className="absolute top-0 left-0 w-full flex items-center justify-between p-4 z-10">

          <div className="text-white">
            <h2 className="text-lg font-semibold">
              {selectedUser?.fullname}
            </h2>
            <p className="text-xs text-gray-300">
              Video call
            </p>
          </div>

          {/* optional end button top */}
          <button
            onClick={handleEndCall}
            className="md:h-fit px-3 py-1 rounded-full text-white px-2 py-3  rounded-full bg-red-600 text-sm"
          >
            End
          </button>

        </div>

        {/* 🎥 MAIN VIDEO */}
        <div className="flex-1 relative">

          {/* Speaker layout = WhatsApp style */}
          <SpeakerLayout />

          {/* 📱 SELF PREVIEW (small box) */}
          <div className="absolute bottom-24 right-4 w-24 h-32 md:w-32 md:h-40 rounded-xl overflow-hidden border border-white/20 shadow-lg">
            <SpeakerLayout />
          </div>

        </div>

        {/* 🎛️ CONTROLS */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent">

          <div className="flex justify-center items-center gap-6">

            {/* Stream built-in controls */}
            <CallControls />

          </div>

        </div>

      </StreamCall>
    </StreamVideo>

  </div>
)}

      {/* INCOMING CALL */}
      {incomingCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white text-black rounded-2xl p-6 w-[90%] max-w-sm text-center">
            <h2>Incoming Call</h2>
            <p>{incomingCall.from.fullname} is calling...</p>

            <div className="w-full flex justify-center gap-5 mt-3">
              <button onClick={handleRejectCall} className="px-2 py-1 hover:cursor-pointer rounded-lg bg-red-600 text-white">Reject</button>
            <button onClick={handleAcceptCall} className="px-2 py-1 hover:cursor-pointer
             rounded-lg bg-green-600 text-white">Accept</button>
            </div>
          </div>
        </div>
      )}

      {/* INPUT */}
      <div className="px-3 h-5 absolute bottom-10  w-full">
        <form className="flex gap-2" onSubmit={handleNewMessage}>
          <input
            disabled={!!call}
            value={msg}
            onChange={(e) => setmsg(e.target.value)}
            placeholder="Message"
            className="flex-1 h-10 bg-white/10 outline-none px-3 rounded-full"
          />
          <button type="submit" disabled={!!call}>
            <IoIosSend className="text-xl hover:cursor-pointer bg-blue-400 rounded-full h-10 w-10 p-2" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatContainer;