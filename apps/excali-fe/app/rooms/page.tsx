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
        <div className="flex-1 ml-[5vw]">
          <NavBar />
          <div className="flex mt-16">
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
            <div className="fixed right-0 flex-col">
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
    <div className="pl-8 sm:w-full md:w-[74vw] pr-4">

      <div className="flex items-center sm:gap-1 gap-4 mb-6 mt-8 p-2 pl-0 rounded-3xl backdrop-blur-sm w-fit">
      
        <div className="flex md:items-center">
          <input
            type="text"
            placeholder="Search by room name or room id..."
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="sm:w-[56vw] sm:px-5 sm:py-4 sm:rounded-3xl md:w-[35vw] md:px-5 md:py-3.5 md:rounded-3xl focus:outline-none bg-slate-800/60 border border-slate-700/40 text-white placeholder:text-slate-500"
          />
          <img
            src="./search.svg"
            onClick={() => handleSearch()}
            alt=""
            className="sm:w-[3vw] md:w-[1.6vw] relative sm:-left-[4vw] -left-[3vw] cursor-pointer"
          />
        </div>

      
        <div
          className="sm:w-[20vw] sm:px-2 sm:py-4 sm:gap-2 md:gap-0 cursor-pointer bg-amber-300 hover:bg-amber-400 md:w-[11.3vw] flex justify-center px-5 py-3.5 rounded-3xl transition-all duration-300"
          onClick={() => handleRoomCreate()}
        >
          <img
            src="./plus-solid-full.svg"
            alt=""
            className="sm:w-[3vw] md:w-[1.5vw] md:mr-3 brightness-0"
          />
          <span className="text-slate-900 font-medium">Create Room</span>
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
