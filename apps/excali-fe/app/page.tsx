import Link from "next/link";
import VideoPlayer from "./videoPlayer";

export default function Home() {
  return (
    <>
      <img
        src="./finalbg.jpg"
        alt="backgorund-img"
        className="absolute -z-10 "
      />
      <NavBar />
      <HeroSection />
      <CoreFeatures />
    </>
  );
}

function NavBar() {
  return (
    <nav className="flex justify-between items-center h-[6vw] w-full p-4 pl-[10vw] pr-[10vw]">
      <div>
        <span className="text-3xl text-white font-mono">SLATE</span>
      </div>
      <div>
        <Link
          href="/signin"
          className="p-2 ml-2 rounded-xl text-white cursor-pointer "
        >
          {" "}
          Sign in{" "}
        </Link>
        <Link
          href="/signup"
          className=" p-2 ml-2 mr-2 rounded-xl text-white cursor-pointer"
        >
          {" "}
          Sign up{" "}
        </Link>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <>
      <div className="flex flex-col justify-between relative left-[10vw] top-[5vw] w-[35vw] h-[22vw]">
        <span className="text-white text-[4.5em] leading-[1.15] tracking-tight overflow-clip font-boldonse text-shadow-amber-50">
          {" "}
          Real Time Collaborative Drawing Canvas{" "}
        </span>
        <div className="flex">
          <button className="bg-cyan-600 text-white p-3 pl-4 pr-4 border-0 rounded-xl m-2 cursor-pointer">
            {" "}
            Get Started{" "}
          </button>
          <button className="bg-black text-white p-3 pl-4 pr-4 border-0 rounded-xl m-2 cursor-pointer">
            {" "}
            Guest Canvas{" "}
          </button>
        </div>
      </div>
      <div className="absolute right-[19vw] top-[11vw] w-[16vw] h-[16vw]">
        <VideoPlayer />
      </div>
      <div className="absolute right-[10vw] top-[20vw] w-[16vw] h-[16vw]">
        <VideoPlayer />
      </div>
    </>
  );
}

function CoreFeatures() {
  return(
    <>
      <div className="w-[70vw] h-[40vw] bg-black text-white rounded-4xl ml-[15vw] mr-[15vw] mt-[20vw]">
        <span className="relative flex justify-self-center p-4 text-4xl font-bold feat-class"> Our Core Features </span>
        <div>Feature.1</div>
        <div>Feature.2</div>
        <div>Feature.3</div>
      </div>
    </>
  )
}
