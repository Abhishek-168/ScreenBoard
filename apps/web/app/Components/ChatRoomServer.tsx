import axios from "axios";
import { BE_URL } from "../config";
import ChatRoomClient from "./ChatRoomClient";

export default async function ChatRoomServer({ roomId }: { roomId: string }) {
  const response = await axios.get(`${BE_URL}/chat/${roomId}`);
  const allmessages = response.data.allMessages;
  return <ChatRoomClient messages={allmessages} id={roomId} />;
}
