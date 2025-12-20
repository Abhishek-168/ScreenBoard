"use client";

export default function VideoPlayer() {
  return (
    <div className="relative">
      <video
        src="./demoVid.mp4"
        autoPlay
        muted
        loop
        playsInline
        className={`border-2 border-amber-300 rounded-4xl relative z-10 `}
      />
    </div>
  );
}
