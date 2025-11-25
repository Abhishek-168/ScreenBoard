"use client";

export default function VideoPlayer() {
  return (
    <video src="./demoVid.mp4" autoPlay muted loop playsInline
        className="border-0 rounded-4xl"
    ></video>
  );
}
