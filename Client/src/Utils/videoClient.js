import { StreamVideoClient } from "@stream-io/video-react-sdk";

export const createVideoClient = async (currentUser) => {
  const bvkurl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const res = await fetch(`${bvkurl}/video-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: currentUser._id,
    }),
  });

  const { token } = await res.json();

  const client = new StreamVideoClient({
    apiKey: import.meta.env.VITE_STREAM_API_KEY,
    user: {
      id: currentUser._id,
      name: currentUser.username,
    },
    token,
  });

  return client;
};