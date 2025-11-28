import Link from "next/link";
import VideoPlayer from "./videoPlayer";

export default function Home() {
  return (
    <>
      <img
        src="./glow-ctr.png"
        alt="backgorund-img"
        className="absolute -z-10 w-screen opacity-99"
      />
      <img
        src="./glow-footer.png"
        alt=""
        className="w-screen absolute -z-10 top-[150vh]"
      />
      <NavBar />
      <HeroSection />
      <CoreFeatures />
      <Footer />
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
        <span className="text-white text-[4.6em] leading-[1.2] mt-5 mb-5 tracking-tight overflow-clip font-boldonse 
                drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] 
                hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.5)] transition-all duration-300">
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
      <div className="absolute right-[19vw] top-[10vw] w-[18vw] h-[18vw]">
        <VideoPlayer glow={true}/>
      </div>
      <div className="absolute right-[10vw] top-[19vw] w-[18vw] h-[18vw]">
        <VideoPlayer />
      </div>
    </>
  );
}

function CoreFeatures() {
  return (
    <>
      <div className="w-[70vw] h-full bg-black text-white rounded-4xl ml-[15vw] mr-[15vw] mt-[20vw]">
        <span className="relative flex justify-self-center p-4 text-4xl font-bold feat-class">
          {" "}
          Our Core Features{" "}
        </span>
        <div>
          <Feature title="Modern Drawing Canvas" />
        </div>
        <div>
          <Feature title="Synched Collaborative Canvas" />
        </div>
        <div>
          <Feature title="Create Rooms Public or Private" />
        </div>
      </div>
    </>
  );
}

function Feature({ title }: { title: string }) {
  return (
    <>
      <div className="flex items-center p-8 w-[70vw] mx-auto rounded-xl gap-10 pl-[4vw] mt-[1.6vw]">
        <div className="flex items-center gap-10">
          <div className="w-[3px] h-[9vw] bg-orange-400" />

          <div className="w-[13vw]">
            <VideoPlayer glow={true} white={true}/>
          </div>
        </div>

        <div className="flex flex-col max-w-[37vw] ml-[4vw]">
          <h2 className="text-3xl font-boldonse text-white">{title}</h2>
          <p className="text-white mt-2 text-sm leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe
            temporibus, doloremque accusantium amet animi provident. Quos quasi
            nulla, doloremque quae! A eaque quos tempora adipisci, excepturi rem
            laudantium assumenda dolores sed quis esse praesentium at quia
            inventore dolor consequuntur!
          </p>
        </div>
      </div>
    </>
  );
}

function Footer() {
  return (
    <>
      <footer className="mt-28 w-full backdrop-blur-6xl bg-white/10 border-t border-white/20 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
          <div>
            <h2 className="text-xl font-semibold mb-4">Pages</h2>
            <ul className="space-y-2">
              <li>
                <a href="/home" className="hover:text-gray-300 transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-gray-300 transition">
                  About
                </a>
              </li>
              <li>
                <a href="/canvas" className="hover:text-gray-300 transition">
                  Canvas
                </a>
              </li>
              <li>
                <a href="/rooms" className="hover:text-gray-300 transition">
                  Rooms
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Contact</h2>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.linkedin.com/in/abhishek-jain-71879030b/"
                  target="_blank"
                  className="hover:text-gray-300 transition"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Abhishek-168"
                  target="_blank"
                  className="hover:text-gray-300 transition"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center text-white/60 py-4 text-sm border-t border-white/10">
          © 2025 SLATE. All rights reserved.
        </div>
      </footer>
    </>
  );
}
