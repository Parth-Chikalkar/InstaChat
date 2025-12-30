import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const backendurl = import.meta.env.VITE_BACKEND_URL;
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineusers, setonlineusers] = useState([]);

  useEffect(() => {
    const getUserOnRefresh = async () => {
      try {
        const res = await axios.post(`${backendurl}/api/auth/me`, { token });
        if (res.data.success) {
          setAuthUser(res.data.user);
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    if (token) getUserOnRefresh();
  }, [token]);


  useEffect(() => {
    if (!authUser) return;

    const newSocket = io(backendurl, {
      withCredentials: true,
      query: { userId: authUser._id },
    });

    // listener first
    newSocket.on("getOnlineUsers", (users) => {
      setonlineusers(users);
    });

    // ask backend
    newSocket.emit("requestOnlineUsers");

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [authUser]);



  const value = {
    axios,
    authUser,
    setAuthUser,
    socket,
    token,
    setToken,
    selectedUser,
    setSelectedUser,
    onlineusers,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
