"use client";
import React from "react";
import { useState } from "react";
import TopRooms from "../top_rooms/page";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BE_URL } from "../config";
import LeftBar from "../components/LeftBar";
import NavBar from "../components/NavBar";

export default function Room() {
  const [topRooms, setTopRooms] = useState<boolean>(true);
  const [roomName, setRoomName] = useState<string>("");
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async () => {
    setTopRooms(false);
    try {
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
        // ensure id is a string (convert if needed)
        setSearchResult(String(data.id));
        console.log("search result is " + data.id);
      }
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const handleRoomCreate = () => {
    router.push("/create-room");
  };

  return (
    <>
      <div className="flex">
        <LeftBar />
        <div className="flex-1 ml-[8vw]">
          <NavBar />
          <MainHeroSection
            roomName={roomName}
            setRoomName={setRoomName}
            handleSearch={handleSearch}
            handleRoomCreate={handleRoomCreate}
            topRooms={topRooms}
            searchResult={searchResult}
            router={router}
          />
        </div>
      </div>
    </>
  );
}

/* ===== MainHeroSection component (typed props) ===== */

interface MainHeroSectionProps {
  roomName: string;
  setRoomName: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => Promise<void> | void;
  handleRoomCreate: () => void;
  topRooms: boolean;
  searchResult: string | null;
  router:  any; // use `any` if AppRouterInstance isn't available
}

function MainHeroSection({
  roomName,
  setRoomName,
  handleSearch,
  handleRoomCreate,
  topRooms,
  searchResult,
  router,
}: MainHeroSectionProps) {
  return (
    <div>
      <div className="flex justify-around border-b-blue-700">
        <input
          type="text"
          placeholder="Enter room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="border px-2 py-1"
        />
        <button className="cursor-pointer" onClick={() => handleSearch()}>
          Search
        </button>
        <button onClick={() => handleRoomCreate()}>Create Room</button>
      </div>

      {topRooms && <TopRooms />}

      {searchResult && (
        <div className="border-amber-600 max-w-[90vw] h-[12vw] p-[2vw] flex justify-between">
          <span>{roomName}</span>
          <button onClick={() => router.push(`/canvas/${searchResult}`)}>
            Enter
          </button>
        </div>
      )}
    </div>
  );
}
