// Allow user find a room and enter it
// handle create new room button

"use client";
import { useState } from "react";
import TopRooms from "../top_rooms/page";
import axios from "axios";
import  { useRouter } from "next/navigation";
import { BE_URL } from "../config";

export default function Room() {
  const [topRooms, setTopRooms] = useState<Boolean>(true);
  const [roomName, setRoomName] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const router = useRouter();

  const handleSearch = async () => {
    setTopRooms(false);
    const resp = await axios.get(`${BE_URL}/room/${roomName}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = resp.data.room;
    console.log("data is ", data);
    if (!data) {
      console.log("Room " + roomName + " not found");
      return;
    } else {
      setSearchResult(data.id);
      console.log("search result is " + data.id);
    }
  };
  const handleRoomCreate = () => {
    router.push("/create-room")
  };
  return (
    <>
      <div className="flex justify-around w-[80vw] m-[5vw] border-b-blue-700">
        <input
          type="text"
          placeholder="Enter room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button className="cursor-pointer" onClick={() => handleSearch()}>
          {" "}
          Search{" "}
        </button>
        <button onClick={() => handleRoomCreate()}> Create Room </button>
      </div>
      {topRooms && <TopRooms />}
      {searchResult && (
        <div className=" border-amber-600 w-[90vw] h-[12vw] ml-[5vw] mr-[5vw] p-[2vw] flex justify-between">
          <span> {roomName}</span>
          <button onClick={() => router.push(`/canvas/${searchResult}`)}>
            {" "}
            Enter{" "}
          </button>
        </div>
      )}
    </>
  );
}

{
  /* <input type="text" placeholder="Enter room name" />
            <select name="visibility" id="vis"> 
                <option value="public">Public</option>
                <option value="private">Private</option>
            </select> */
}
