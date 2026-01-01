"use client";

import axios from "axios";
import { BE_URL } from "../config";
import { useEffect, useState } from "react";
import { Room } from "../components/RoomCard";
import RoomsCarousel from "../components/RoomsCarousel";

export default function TopRooms() {
  const [allRooms, setAllRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const resp = await axios.get<Room[]>(`${BE_URL}/allrooms`);
      //@ts-ignore
      const data = resp.data.allrooms;
      setAllRooms(data);
    };
    fetchRooms();
  }, []);

  return <RoomsCarousel rooms={allRooms} title="Trending Rooms" />;
}
