"use client";

import { useEffect, useRef, useState } from "react";
// import { initDraw } from "../draw";
import { WS_URL } from "../config";
import Canvas from "./Canvas";

export default function RoomCanvas({ roomId }: { roomId: string }) {
  console.log(roomId);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    const ws = new WebSocket(`${WS_URL}?token=${token}`);
    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId: Number(roomId),
        })
      );
    };
  }, []);

  if (!socket) {
    return (
      <>
        <span> Canvas is loading .........</span>
      </>
    );
  }

  return <Canvas roomId={roomId} socket={socket} />;
}
