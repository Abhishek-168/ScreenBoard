"use client"

import axios from "axios";
import { BE_URL } from "../config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Room = {
  name: string;
  id: string;
};

export default function TopRooms() {
  const [allRooms, setAllRooms] = useState<Room[]>([])


  useEffect(() => {
    const fetchRooms = async () => {
      const resp = (await axios.get<Room[]>(`${BE_URL}/allrooms`));
      //@ts-ignore
      const data = resp.data.allrooms;
      setAllRooms(data);
    };
    fetchRooms();
  }, [])
  const router = useRouter();

  return (
    <>
      <section>
      <h3 className="text-2xl">Trending Rooms</h3>
      <div className="bg-green-500">
        {allRooms.map((room: Room) => (
          <div
            key={room.id}
            className="border-amber-600 max-w-[90vw] h-[12vw] p-[2vw] flex justify-between items-center"
          >
            <span>{room.name}</span>
            <button
              onClick={() => router.push(`/canvas/${room.id}`)}
              className="px-3 py-1 rounded bg-amber-400"
            >
              Enter
            </button>
          </div>
        ))}
      </div>
    </section>
    </>
  );
}
