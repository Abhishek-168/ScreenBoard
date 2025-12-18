"use client";

const partners = [
  { id: 1, name: "NextJS" },
  { id: 2, name: "WebSocket" },
  { id: 3, name: "NodeJS" },
  { id: 4, name: "ExpressJS" },
  { id: 5, name: "TypeScript" },
  { id: 6, name: "TailwindCSS" },
  { id: 7, name: "JWT" },
  { id: 8, name: "AWS" },
  { id: 9, name: "Docker" },
  { id: 10, name: "PostgreSQL" },
  { id: 11, name: "Redis" },
  { id: 12, name: "Prisma" },
  { id: 13, name: "Zod" },
  { id: 14, name: "Monorepo" },
];

const duplicatedPartners = [...partners, ...partners];

export default function TechCarousel() {
  return (
    <div className="relative w-[60vw] overflow-hidden py-14 -ml-20">
        <div className="ml-20">
          {" "}
          <img
            src="./uni-shape.png"
            alt=""
            className="inline-block w-[2vw] pr-3"
          />{" "}
          <span className="text-xl"> BUILT UPON </span>{" "}
        </div>
      <div className="flex gap-8 pt-2 w-max animate-scroll hover:[animation-play-state:paused]">
        
        {duplicatedPartners.map((partner, index) => (
          <div
            key={`${partner.id}-${index}`}
            className="shrink-0 px-6 py-4 flex items-center gap-3 text-white/80 text-xl transition-transform hover:scale-105"
          >
            <img src="./uni-shape.png" className="w-5" />
            {partner.name}
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
