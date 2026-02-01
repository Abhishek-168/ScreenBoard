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
      className="
        min-w-[340px] max-w-[340px] shrink-0 
        rounded-2xl p-5
        bg-slate-800/40
        border border-white/5
        transition-all duration-300
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="min-w-0">
          <h4 className="text-lg font-semibold text-white truncate">
            {room.name}
          </h4>
          <p className="text-xs text-white/40 font-mono">
            #{String(room.id).slice(0, 8)}
          </p>
        </div>

        {/* LIVE (no background) */}
        <div className="flex items-center pr-1 gap-1.5 text-[13px] font-medium text-emerald-400 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          LIVE
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-6 mb-6 text-sm">
        <div>
          <p className="text-white/40">Capacity</p>
          <p className="text-white font-medium">
            12 <span className="text-white/40">/ 50</span>
          </p>
        </div>

        <div>
          <p className="text-white/40">Active</p>
          <p className="text-white font-medium">
            5 <span className="text-white/40">drawing</span>
          </p>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigateToRoom();
        }}
        className="
          w-full py-2.5 rounded-xl
          bg-white/5 hover:bg-white/10
          text-[#ffed00] text-sm font-semibold
          transition-colors
          flex items-center justify-center gap-2
          cursor-pointer
        "
      >
        Join room →
      </button>
    </div>
  );
}
