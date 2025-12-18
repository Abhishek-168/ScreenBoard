"use client";

import { useRouter } from "next/navigation";

export type Room = {
  name: string;
  id: string;
};

type RoomCardProps = {
  room: Room;
};

export function RoomCard({ room }: RoomCardProps) {
  const router = useRouter();

  const navigateToRoom = () => router.push(`/canvas/${room.id}`);

  return (
    <div
      key={room.id}
      className="min-w-[320px] shrink-0 bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl p-6 flex flex-col gap-4 shadow-xl border border-slate-700/50 hover:border-amber-500/70 transition-all duration-300 hover:shadow-amber-500/10 group cursor-pointer"
      onClick={navigateToRoom}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h4 className="text-xl font-bold text-white truncate max-w-[180px] ">
            {room.name}
          </h4>
          <span className="text-xs text-slate-500">Room #{String(room.id).slice(0, 6)}</span>
        </div>
        <span className="px-3 py-1.5 bg-emerald-500/15 text-emerald-400 text-xs font-medium rounded-full flex items-center gap-1.5 backdrop-blur-sm">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></span>
          Live
        </span>
      </div>

      <div className="flex gap-4 text-sm text-slate-400">
        <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg">
          <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
          <span>12/50</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg">
          <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
          <span>5 active</span>
        </div>
      </div>

      <div className="h-px bg-linear-to-br from-transparent via-slate-700 to-transparent my-1"></div>

      <div className="flex justify-between items-center">
        <div className="flex -space-x-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-9 h-9 rounded-full bg-linear-to-br from-amber-400 to-orange-500 border-2 border-slate-800 flex items-center justify-center text-xs font-bold text-white shadow-md hover:z-10 hover:scale-110 transition-transform"
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
          <div className="w-9 h-9 rounded-full bg-slate-700/80 border-2 border-slate-800 flex items-center justify-center text-xs font-medium text-slate-300 shadow-md">
            +8
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigateToRoom();
          }}
          className="px-5 py-2.5 rounded-xl bg-linear-to-br from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-400 hover:to-orange-400 transition-all duration-200 shadow-lg hover:shadow-amber-500/40 hover:scale-105 active:scale-95"
        >
          Join →
        </button>
      </div>
    </div>
  );
}
