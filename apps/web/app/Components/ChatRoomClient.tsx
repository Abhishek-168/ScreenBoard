"use client";

import { useEffect, useState } from "react";
import useSocket from "../hooks/useSocket";

export default function ChatRoomClient({
  messages,
  id,
}: {
  messages: { message: string }[];
  id: string;
}) {
  const [socket, loading] = useSocket();
  const [chat, setChat] = useState(messages);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: id,
        })
      );

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type == "chat") {
          setChat((c) => [...c, { message: parsedData.message }]);
        }
      };
    }
  }, [socket, loading, id]);

  return (
    <>
      {chat.map((m) => (
        <div>{m.message}</div>
      ))}
      <input
        type="text"
        placeholder="Enter message"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />
      <button
        onClick={() => {
          socket?.send(
            JSON.stringify({
              type: "chat",
              roomId: id,
              message: currentMessage,
            })
          );
          setCurrentMessage("");
        }}
      >
        {" "}
        Send{" "}
      </button>
    </>
  );
}
