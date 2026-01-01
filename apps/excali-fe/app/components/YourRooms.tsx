"use client";
import { useEffect, useState } from "react";
import RoomsCarousel from "./RoomsCarousel";
import { BE_URL } from "../config";
import axios from "axios";
import { Room } from "./RoomCard";

export default  function YourRooms() {
  const [userRooms, setUserRooms] = useState<
    Array<{ id: string; name: string }>
  >([]);
  useEffect(() => {
    const fetchUserRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const resp =  await axios.get<Room[]>(`${BE_URL}/your-rooms`, {
          headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        const data = resp.data;
        setUserRooms(data);
      } catch (error) {
        console.error("Failed to fetch user rooms:", error);
        }
    };
    fetchUserRooms();
  }, []);


  return (
    <div className="mt-10">
      <RoomsCarousel rooms={userRooms} title="Your Rooms" />
    </div>
  );
}
