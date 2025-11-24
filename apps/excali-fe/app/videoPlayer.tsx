"use client";

export default function VideoPlayer() {
  return (
    <video src="./demoVid.mp4" autoPlay muted loop playsInline
        className="border-2 rounded-xl"
    ></video>
  );
}
