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
import Community from "../components/Community";
import CreateRoomModal from "../components/create-modal";

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
  const [open, setOpen] = useState(false);

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
            })),
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
        
        setLoader(false);
        setSearchResult(
          data.map((room: any) => ({
            id: String(room.id),
            name: room.name,
          })),
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
    setOpen(true);
  };

  return (
    <>
      <div className="flex">
        <LeftBar />
        <div className="flex-1 ml-[12vw] sm:ml-[6vw] md:ml-[5vw]">
          <NavBar />
          <div className="flex mt-8 sm:mt-12 md:mt-16">
            <MainHeroSection
              roomName={roomName}
              setRoomName={setRoomName}
              handleSearch={handleSearch}
              handleRoomCreate={handleRoomCreate}
              topRooms={topRooms}
              searchResult={searchResult}
              router={router}
              loader={loader}
              open={open}
              setOpen={setOpen}
            />
            <div className="hidden md:flex fixed right-0 flex-col">
              <RightBar />
              <Community />
            </div>
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
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  open,
  setOpen,
}: MainHeroSectionProps) {
  return (
    <div className="px-3 sm:px-5 md:pl-8 md:pr-4 w-full md:w-[74vw]">

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-3 md:gap-4 mb-6 mt-6 sm:mt-8 p-2 pl-0 rounded-3xl backdrop-blur-sm sm:w-fit">
      
        <div className="flex items-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by room name or room id..."
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full sm:w-[50vw] md:w-[35vw] px-4 py-3 sm:px-5 sm:py-3.5 md:py-3.5 rounded-2xl sm:rounded-3xl text-sm sm:text-base focus:outline-none bg-slate-800/60 border border-slate-700/40 text-white placeholder:text-slate-500"
          />
          <img
            src="./search.svg"
            onClick={() => handleSearch()}
            alt="Search"
            className="w-5 h-5 sm:w-5 sm:h-5 md:w-[1.6vw] md:h-[1.6vw] relative -left-9 sm:-left-10 cursor-pointer"
          />
        </div>

      
        <div
          className="cursor-pointer bg-amber-300 hover:bg-amber-400 w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 sm:py-3.5 rounded-2xl sm:rounded-3xl transition-all duration-300"
          onClick={() => handleRoomCreate()}
        >
          <img
            src="./plus-solid-full.svg"
            alt=""
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-[1.5vw] md:h-[1.5vw] brightness-0"
          />
          <span className="text-slate-900 font-medium text-sm sm:text-base">Create Room</span>
        </div>
      </div>

      {loader && !topRooms && <Loader title="Search Results" />}

      {!topRooms && !loader && (
        <RoomsCarousel
          rooms={searchResult.filter(
            (room): room is NonNullable<SearchResult> => room !== null,
          )}
          title="Search Results"
        />
      )}
      {topRooms && <TopRooms />}
      {topRooms && <YourRooms />}

       {open && (
        <CreateRoomModal onClose={() => setOpen(false)} />
      )}

    </div>
    
  );
}
