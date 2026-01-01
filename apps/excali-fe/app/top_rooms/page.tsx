"use client";

import axios from "axios";
import { BE_URL } from "../config";
import { useEffect, useState } from "react";
import { Room } from "../components/RoomCard";
import RoomsCarousel from "../components/RoomsCarousel";
import Loader from "../components/Loader";

export default function TopRooms() {
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const resp = await axios.get<Room[]>(`${BE_URL}/allrooms`);
        //@ts-ignore
        const data = resp.data.allrooms;
        setAllRooms(data);
      } catch (error) {
        console.error("Failed to fetch top rooms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  if (loading) {
    return <Loader title="Trending Rooms" />;
  }

  return <RoomsCarousel rooms={allRooms} title="Trending Rooms" />;
}
