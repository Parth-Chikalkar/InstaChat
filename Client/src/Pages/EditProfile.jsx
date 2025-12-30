import React from "react";

function EditProfile() {
  return (
    <div className="w-full h-screen gap-32 flex justify-center items-center">

      {/* LEFT BRAND SECTION */}
      <div className="flex items-center flex-col gap-2">
        <img
          className="rounded-full w-28 h-28"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_iT-fCTP6oUN9eDQXy9zYAT3ESyYU63o_5g&s"
          alt="logo"
        />
        <h1 className="text-4xl">ChatBot !</h1>
      </div>

      {/* RIGHT EDIT PROFILE CARD */}
      <div className="bg-white/10 backdrop-blur-md border p-5 rounded-lg w-72">
        <p className="text-xl mb-4">Edit Profile</p>

        <form className="w-full flex flex-col gap-3">
          <input
            type="text"
            placeholder="Full Name"
            className="focus:outline-none p-2 placeholder:text-sm border rounded-sm"
          />

          <input
            type="email"
            placeholder="Email Address"
            disabled
            className="focus:outline-none p-2 placeholder:text-sm border rounded-sm bg-gray-200/30 cursor-not-allowed"
          />

          <textarea
            placeholder="Bio"
            rows="3"
            className="focus:outline-none p-2 placeholder:text-sm border rounded-sm resize-none"
          />

          <button className="bg-gradient-to-r from-purple-600 to-purple-800 p-2 rounded-sm hover:cursor-pointer">
            Save Changes
          </button>
        </form>
      </div>

    </div>
  );
}

export default EditProfile;
