// Allows user to create a room from UI
"use client";
import { useState } from "react";
import { BE_URL } from "../config";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CreateRoom() {
  const [roomName, setRoomName] = useState("");
  const router = useRouter();

  const handleRoomCreate = async () => {
    const token = localStorage.getItem("token");
    const resp = await axios.post(
      `${BE_URL}/create-room`,
      { name: roomName }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!resp.data.roomId) {
      console.log("Room creation failed");
    } else {
      router.push(`/canvas/${resp.data.roomId}`);
    }
  };

  return (
    <>
      <input
        type="text"
        value={roomName}
        placeholder="Enter room name"
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button onClick={() => handleRoomCreate()}> Create </button>
    </>
  );
}
