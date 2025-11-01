import axios from "axios";
import { BE_URL } from "../config";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      x: number;
      y: number;
      radius: number;
    }
  | {
      type: "square";
      x: number;
      y: number;
      length: number;
    };

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) {
  const ctx = canvas.getContext("2d");
  let existingShapes: Shape[] = await getExistingShapes(roomId);

  if (!ctx) return;

  clearCanvas(ctx, existingShapes, canvas);

  socket.onmessage = (event) => {
    console.log("raw event data: " + event.data);
    const mssg = JSON.parse(event.data);
    if (mssg.type == "chat") {
      const message = JSON.parse(mssg.message);
      console.log("message : " + message);
      existingShapes.push(message.shape);
      clearCanvas(ctx, existingShapes, canvas);
    }
  };

  let startX = 0;
  let startY = 0;
  let width = 0;
  let height = 0;

  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  // ctx.strokeRect(0, 0, 600, 60)
  let clicked = false;
  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
    console.log(startX);
    console.log(startY);
  });

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    width = e.clientX - startX;
    height = e.clientY - startY;
    const shape: Shape = { type: "rect", x: startX, y: startY, width, height };
    existingShapes.push(shape);
    socket.send(
      JSON.stringify({
        type: "chat",
        roomId: Number(roomId),
        message: JSON.stringify({
          shape,
        }),
      })
    );
    clearCanvas(ctx, existingShapes, canvas);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      clearCanvas(ctx, existingShapes, canvas);
      //   ctx.clearRect(0, 0, canvas.width, canvas.height);
      width = e.clientX - startX;
      height = e.clientY - startY;
      ctx.strokeRect(startX, startY, width, height);
    }
  });
}

function clearCanvas(
  ctx: CanvasRenderingContext2D,
  existingShapes: Shape[],
  canvas: HTMLCanvasElement
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  existingShapes.map((shape) => {
    if (shape.type == "rect") {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  });
}

async function getExistingShapes(roomId: string) {
  const res = await axios.get(`${BE_URL}/chat/${roomId}`);
  const messages = res.data.allMessages;

  const shapes = messages.map((x: { message: string }) => {
    const parsedShape = JSON.parse(x.message);
    console.log("PS: " + parsedShape.shape);
    return parsedShape.shape;
  });
  return shapes;
}
