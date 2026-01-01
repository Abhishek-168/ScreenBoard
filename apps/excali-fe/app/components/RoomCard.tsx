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
      className="min-w-[340px] max-w-[340px] shrink-0 group relative overflow-hidden cursor-pointer"
      onClick={navigateToRoom}
    >
      {/* Gradient Background with Glow Effect */}
      <div className="absolute inset-0 bg-linear-to-br from-violet-600/20 via-fuchsia-500/10 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Main Card */}
      <div className="relative bg-linear-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30 group-hover:border-violet-500/40 transition-all duration-300 shadow-2xl">
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-5">
          <div className="flex-1">
            <h4 className="text-2xl font-bold bg-linear-to-br from-violet-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent mb-1 truncate max-w-[200px]">
              {room.name}
            </h4>
            <p className="text-xs text-slate-500 font-mono">ID: {String(room.id).slice(0, 8)}</p>
          </div>
          
          {/* Live Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-br from-emerald-500/20 to-green-500/20 rounded-full border border-emerald-500/30 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-300">LIVE</span>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 bg-slate-800/60 rounded-xl p-3 border border-slate-700/40 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="text-xs font-medium text-slate-400">Capacity</span>
            </div>
            <p className="text-lg font-bold text-white">12 <span className="text-sm text-slate-500">/ 50</span></p>
          </div>
          
          <div className="flex-1 bg-slate-800/60 rounded-xl p-3 border border-slate-700/40 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-slate-400">Active</span>
            </div>
            <p className="text-lg font-bold text-white">5 <span className="text-sm text-slate-500">drawing</span></p>
          </div>
        </div>

        {/* Join Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigateToRoom();
          }}
          className="w-full py-3.5 rounded-xl bg-linear-to-br from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-sm uppercase tracking-wide transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
        >
          <span>Join Room</span>
          <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
