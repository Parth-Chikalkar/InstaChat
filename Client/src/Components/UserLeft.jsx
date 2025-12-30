import React, { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

function UserLeft({ selected, setSelected, elem }) {
  const { selectedUser, setSelectedUser, onlineusers } =
    useContext(AuthContext);


  const isOnline = onlineusers?.includes(elem._id);
  

  return (
    <div
      onClick={() => {
        setSelected(true);
        setSelectedUser(elem);
      }}
      className="hover:cursor-pointer flex mb-0.5 px-2 w-full h-16 bg-white/5 rounded-md items-center"
    >

      <div className="relative">
        <img
          src="https://cdn-icons-png.flaticon.com/512/10337/10337609.png"
          className="rounded-full h-10 w-10"
          alt=""
        />

      
      </div>

      <div className="ml-3">
        <h1 className="font-light text-sm leading-tight">
          {elem.fullname}
        </h1>

        <span
          className={`text-xs font-extralight text-shadow-green-500 ${
            isOnline ? "text-green-500" : "text-gray-400"
          }`}
        >
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>
    </div>
  );
}

export default UserLeft;
