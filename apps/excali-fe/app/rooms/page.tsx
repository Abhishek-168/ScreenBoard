"use client";
import React, { use, useEffect } from "react";
import { useState } from "react";
import TopRooms from "../top_rooms/page";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BE_URL } from "../config";
import LeftBar from "../components/LeftBar";
import NavBar from "../components/NavBar";
import RoomsCarousel from "../components/RoomsCarousel";
import YourRooms from "../components/YourRooms";
import Loader from "../components/Loader";
import RightBar from "../components/RightBar";

type SearchResult = {
  id: string;
  name: string;
} | null;

export default function Room() {
  const [topRooms, setTopRooms] = useState<boolean>(true);
  const [roomName, setRoomName] = useState<string>("");
  const [searchResult, setSearchResult] = useState<SearchResult[]>([null]);
  const [loader, setLoader] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!roomName) {
      setTopRooms(true);
      setSearchResult([null]);
      return;
    }

    setLoader(true);
    const timeout = setTimeout(async () => {
      try {
        const resp = await axios.get(`${BE_URL}/room/${roomName}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("response is ", resp.data);
        const data = resp.data;

        if (!data) {
          console.log("Room " + roomName + " not found");
          return;
        } else {
          setTopRooms(false);
          setLoader(false);
          setSearchResult(
            data.map((room: any) => ({
              id: String(room.id),
              name: room.name,
            }))
          );
          console.log("search result is ", data.id);
        }
      } catch (err) {
        console.error("Search failed", err);
        setLoader(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [roomName]);

  const handleSearch = async () => {
    if (!roomName) return;
    setTopRooms(false);
    setLoader(true);
    try {
      const resp = await axios.get(`${BE_URL}/room/${roomName}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = resp.data;
      console.log("data is ", data);
      if (!data) {
        console.log("Room " + roomName + " not found");
        return;
      } else {
        // ensure id is a string (convert if needed)
        setLoader(false);
        setSearchResult(
          data.map((room: any) => ({
            id: String(room.id),
            name: room.name,
          }))
        );
        console.log("search result is ", data.id);
      }
    } catch (err) {
      console.error("Search failed", err);
      setLoader(false);
    }
    console.log("search result is ", searchResult);
  };

  const handleRoomCreate = () => {
    router.push("/create-room");
  };

  return (
    <>
      <div className="flex">
        <LeftBar />
        <div className="flex-1 ml-[5vw]">
          <NavBar />
          <div className="flex">
            <MainHeroSection
              roomName={roomName}
              setRoomName={setRoomName}
              handleSearch={handleSearch}
              handleRoomCreate={handleRoomCreate}
              topRooms={topRooms}
              searchResult={searchResult}
              router={router}
              loader={loader}
            />
            <RightBar />
          </div>
        </div>
      </div>
    </>
  );
}

interface MainHeroSectionProps {
  roomName: string;
  setRoomName: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => Promise<void> | void;
  handleRoomCreate: () => void;
  topRooms: boolean;
  searchResult: SearchResult[];
  router: any; // use `any` if AppRouterInstance isn't available
  loader: boolean;
}

function MainHeroSection({
  roomName,
  setRoomName,
  handleSearch,
  handleRoomCreate,
  topRooms,
  searchResult,
  router,
  loader,
}: MainHeroSectionProps) {
  return (
    <div className="pl-8 max-w-[70vw] ">
      <div className="flex border-b-blue-700 h-[4vw] mb-6 mt-8">
        <div className="flex">
          <input
            type="text"
            placeholder="Search by room name or room id..."
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className=" max-w-[35vw] w-[35vw] p-4 rounded-3xl focus:outline-none bg-[#0c0c0c] border-2 border-gray-600 text-white"
          />
          <img
            src="./search.svg"
            onClick={() => handleSearch()}
            alt=""
            className="w-[1.6vw] relative -left-[3vw]"
          />
        </div>
        <div className="group relative w-[14vw] cursor-pointer">
          <div className="absolute -inset-0.5 bg-linear-to-r from-violet-600 to-fuchsia-600 rounded-3xl blur-sm opacity-75 group-hover:opacity-100 transition duration-300"></div>
          <div
            className="relative bg-[#181717] flex items-center rounded-3xl justify-center h-full"
            onClick={() => handleRoomCreate()}
          >
            <img src="./plus-solid-full.svg" alt="" className="w-[2vw] mr-4" />
            <span>Create Room</span>
          </div>
        </div>
      </div>

      {loader && !topRooms && <Loader title="Search Results" />}

      {!topRooms && !loader && (
        <RoomsCarousel
          rooms={searchResult.filter(
            (room): room is NonNullable<SearchResult> => room !== null
          )}
          title="Search Results"
        />
      )}
      {topRooms && <TopRooms />}
      {topRooms && <YourRooms />}
    </div>
  );
}
