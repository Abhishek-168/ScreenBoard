import axios from "axios";
import { BE_URL } from "../config";


export async function getExistingShapes(roomId : string) {
    const res = await axios.get(`${BE_URL}/chat/${roomId}`);
    const messages = res.data.allMessages;

    const shapes = messages.map((x: { message: string }) => {
      const parsedShape = JSON.parse(x.message);
      console.log("PS: " + parsedShape.shape);
      return parsedShape.shape;
    });
    return shapes;
  }