import axios from "axios";
import { BE_URL } from "../../config";
import ChatRoomServer from "../../Components/ChatRoomServer";

export default async function ChatRoom({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const slug = (await params).slug;
  const response = await axios.get(`${BE_URL}/room/${slug}`);
  const roomId = response.data.room.id;
  console.log("Room id from Chat Room is " + roomId);

  return <ChatRoomServer roomId={roomId} />;
}
