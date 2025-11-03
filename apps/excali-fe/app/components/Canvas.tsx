import { useEffect, useRef, useState } from "react";
// import { initDraw } from "../draw";
import { Game } from "../draw/Game";
export type Tool = "circle" | "rect" | "sqaure" | "line";

export default function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("circle");
  const [game, setGame] = useState<Game>();

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const g = new Game(canvas, roomId, socket);
      setGame(g);

      return () => {
        g.destroy();
      };
    }
  }, [canvasRef]);

  return (
    <>
      <div className="h-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          width={window.innerWidth}
          height={window.innerHeight}
          className="bg-black"
        ></canvas>
        <div className="fixed top-[3vw] left-[3vw] gap-2 text-white z-10 bg-gray-600 p-2 rounded-md">
          <button
            className="mr-2 cursor-pointer p-2 hover:bg-gray-500 rounded-md"
            onClick={() => setSelectedTool("rect")}
          >
            {" "}
            Rect{" "}
          </button>
          <button
            className="mr-2 cursor-pointer p-2 hover:bg-gray-500 rounded-md"
            onClick={() => setSelectedTool("circle")}
          >
            {" "}
            Circle{" "}
          </button>
          <button
            className="cursor-pointer p-2 hover:bg-gray-500 rounded-md"
            onClick={() => setSelectedTool("sqaure")}
          >
            {" "}
            Square{" "}
          </button>
          <button
            className="cursor-pointer p-2 hover:bg-gray-500 rounded-md"
            onClick={() => setSelectedTool("line")}
          >
            {" "}
            Line{" "}
          </button>
        </div>
      </div>
    </>
  );
}
