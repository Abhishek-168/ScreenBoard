import { useEffect, useRef, useState } from "react";
import { Game } from "../draw/Game";
export type Tool = "circle" | "rect" | "square" | "line" | "select" | "text" | "hand";

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
  const [zoomPercent, setZoomPercent] = useState(100);

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const g = new Game(canvas, roomId, socket);
      g.setOnZoomChange((scale) => setZoomPercent(Math.round(scale * 100)));
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
          className="bg-[#121212] block"
        ></canvas>
          <div className="fixed top-[2vw] left-[3vw] text-white z-10 bg-gray-900 p-2 rounded-md h-[5vh] flex justify-center items-center">
          <button
            className="cursor-pointer p-2"
            onClick={() => setSelectedTool("rect")}
          >
            <div className="p-2 w-9 hover:bg-white/10 rounded-2xl flex items-center justify-center">
              <img src="/recticon.png" alt="" />
            </div>
          </button>
          <button
            className="cursor-pointer p-2"
            onClick={() => setSelectedTool("square")}
          >
            <div className="p-2 w-9 hover:bg-white/10 rounded-2xl flex items-center justify-center">
              <img src="/square-regular-full.svg" alt="" />
            </div>
          </button>
          <button
            className="cursor-pointer p-2"
            onClick={() => setSelectedTool("circle")}
          >
            <div className="p-2 w-9 hover:bg-white/10 rounded-2xl flex items-center justify-center">
              <img src="/circle-regular-full.svg" alt="" />
            </div>
          </button>
          <button
            className="cursor-pointer p-2"
            onClick={() => setSelectedTool("line")}
          >
            <div className="p-2 w-9 hover:bg-white/10 rounded-2xl flex items-center justify-center">
              <img src="/linedash.png" alt="" />
            </div>
          </button>
          <button
            className="cursor-pointer p-2"
            onClick={() => setSelectedTool("select")}
          >
            <div className="p-2 w-8 hover:bg-white/10 rounded-2xl flex items-center justify-center">
              <img src="/arrow-pointer-solid-full.svg" alt="" />
            </div>
          </button>
          <button
            className="cursor-pointer p-2"
            onClick={() => setSelectedTool("text")}
          >
            <div className="p-2 w-8 hover:bg-white/10 rounded-2xl flex items-center justify-center">
              <span className="text-xl font-bold">A</span>
            </div>
          </button>
          <button
            className="cursor-pointer p-2"
            onClick={() => setSelectedTool("hand")}
          >
            <div className="p-2 w-8 hover:bg-white/10 rounded-2xl flex items-center justify-center">
              <span className="text-xl">✋</span>
            </div>
          </button>
        </div>

        <div className="fixed bottom-4 left-4 z-10 flex items-center gap-1 bg-gray-900 rounded-md p-1">
          <button
            className="cursor-pointer px-2 py-1 text-white hover:bg-white/10 rounded"
            onClick={() => game?.zoomOut()}
            title="Zoom out"
          >
            <span className="text-lg font-bold">−</span>
          </button>
          <button
            className="cursor-pointer px-3 py-1 text-white hover:bg-white/10 rounded text-sm min-w-[52px] text-center"
            onClick={() => game?.zoomReset()}
            title="Reset zoom"
          >
            {zoomPercent}%
          </button>
          <button
            className="cursor-pointer px-2 py-1 text-white hover:bg-white/10 rounded"
            onClick={() => game?.zoomIn()}
            title="Zoom in"
          >
            <span className="text-lg font-bold">+</span>
          </button>
        </div>
      </div>
    </>
  );
}
