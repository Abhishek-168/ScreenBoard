import { useEffect, useRef } from "react";
import { initDraw } from "../draw";

export default function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      initDraw(canvas, roomId, socket);
    }
  }, [canvasRef]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={1536}
        height={701}
        className="bg-black"
      ></canvas>
    </>
  );
}
