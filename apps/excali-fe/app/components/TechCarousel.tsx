"use client";

const partners = [
  { id: 1, name: "NextJS" },
  { id: 2, name: "TypeScript" },
  { id: 3, name: "TailwindCSS" },
  { id: 4, name: "NodeJS" },
  { id: 5, name: "ExpressJS" },
  { id: 6, name: "WebSocket" },
  { id: 7, name: "PostgreSQL" },
  { id: 8, name: "Prisma" },
  { id: 9, name: "Redis" },
  { id: 10, name: "Zod" },
  { id: 11, name: "JWT" },
  { id: 12, name: "AWS" },
  { id: 13, name: "Docker" },
  { id: 14, name: "Monorepo" },
];

const duplicatedPartners = [...partners, ...partners];

export default function TechCarousel() {
  return (
    <div className="relative w-[60vw] overflow-hidden py-14 -ml-20">
        <div className="ml-20 flex items-center gap-3 text-white text-2xl mb-4">
          {" "}
          <span className="inline-block w-[1vw] h-[1vw] bg-amber-400 ml-2"></span>
          <span className="text-xl font-mono"> BUILT WITH </span>{" "}
        </div>
      <div className="flex gap-8 pt-2 w-max animate-scroll hover:[animation-play-state:paused]">
        
        {duplicatedPartners.map((partner, index) => (
          <div
            key={`${partner.id}-${index}`}
            className="shrink-0 px-6 py-4 flex items-center gap-3 text-white/80 text-xl transition-transform hover:scale-105"
          >
            <img src="./uni-shape.png" className="w-5" />
            <span className="font-mono">{partner.name}</span>
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
