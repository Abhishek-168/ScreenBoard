"use client";
import React from "react";
import { useState } from "react";
import TopRooms from "../top_rooms/page";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BE_URL } from "../config";
import LeftBar from "../components/LeftBar";
import NavBar from "../components/NavBar";
import { RoomCard } from "../components/RoomCard";

export default function Room() {
  const [topRooms, setTopRooms] = useState<boolean>(true);
  const [roomName, setRoomName] = useState<string>("");
  const [searchResult, setSearchResult] = useState<{ id: string; name: string } | null>(null);
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
        setSearchResult({ id: String(data.id), name: data.name });
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
        <div className="flex-1 ml-[7vw]">
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
  searchResult: { id: string; name: string } | null;
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
    <div className="pl-8 max-w-[65vw] ">
      <div className="flex border-b-blue-700 h-[4vw] mb-6 mt-8">
        <div className="flex">
          <input
            type="text"
            placeholder="Enter room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="border-2 border-gray-600 max-w-[40vw] w-[32vw] p-4 rounded-3xl focus:outline-none bg-[#181717]"
          />
          <img src="./search.svg" onClick={() => handleSearch()} alt="" className="w-[1.6vw] relative -left-[3vw]"/>
        </div>
        <div className=" w-[4vw] bg-[#181717] flex items-center rounded-[50%] justify-center cursor-pointer">
          <img src="./plus-solid-full.svg" onClick={() => handleRoomCreate()} alt="" className="w-[2vw]"/>
        </div>
      </div>

      {topRooms && <TopRooms />}

      {searchResult && (
        <RoomCard room={searchResult} />
      )}
    </div>
  );
}
