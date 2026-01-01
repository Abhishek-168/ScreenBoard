"use client";
import { useEffect, useState } from "react";
import RoomsCarousel from "./RoomsCarousel";
import { BE_URL } from "../config";
import axios from "axios";
import { Room } from "./RoomCard";
import Loader from "./Loader";

export default  function YourRooms() {
  const [userRooms, setUserRooms] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserRooms = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };
    fetchUserRooms();
  }, []);

  if (loading) {
    return (
      <div className="mt-10">
        <Loader title="Your Rooms" />
      </div>
    );
  }

  return (
    <div className="">
      <RoomsCarousel rooms={userRooms} title="Your Rooms" />
    </div>
  );
}
