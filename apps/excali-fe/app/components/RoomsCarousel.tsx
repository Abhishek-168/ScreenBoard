"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { RoomCard, Room } from "./RoomCard";

interface RoomsCarouselProps {
  rooms: Room[];
  title?: string;
}

export default function RoomsCarousel({ rooms, title = "Rooms" }: RoomsCarouselProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateScrollButtons = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      );
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      updateScrollButtons();
      container.addEventListener("scroll", updateScrollButtons);
      window.addEventListener("resize", updateScrollButtons);
      return () => {
        container.removeEventListener("scroll", updateScrollButtons);
        window.removeEventListener("resize", updateScrollButtons);
      };
    }
  }, [rooms, updateScrollButtons]);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -550,
        behavior: "smooth"
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 550,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="mt-10 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>
      <div className="relative group">
        <button
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full shadow-lg transition-all duration-300 ${
            canScrollLeft
              ? "bg-slate-800 hover:bg-slate-700 cursor-pointer opacity-0 group-hover:opacity-100"
              : "bg-slate-800/50 opacity-0 cursor-not-allowed"
          }`}
          title="Scroll left"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={scrollRight}
          disabled={!canScrollRight}
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full shadow-lg transition-all duration-300 ${
            canScrollRight
              ? "bg-slate-800 hover:bg-slate-700 cursor-pointer opacity-0 group-hover:opacity-100"
              : "bg-slate-800/50 opacity-0 cursor-not-allowed"
          }`}
          title="Scroll right"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
        <div
          ref={containerRef}
          className="flex flex-row gap-8 overflow-x-hidden overflow-y-hidden pb-4"
        >
          {rooms.map((room: Room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>
    </section>
  );
}
