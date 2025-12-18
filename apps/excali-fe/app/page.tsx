import Link from "next/link";
import VideoPlayer from "./videoPlayer";
import "./globals.css";

export default function Home() {
  return (
    <>
      <img src="./testbg7.png" alt="" className="w-screen fixed -z-10" />
      <div className="p-6 pl-20 pr-20">
        <NavBar />
        <HeroSection />
        <CoreFeatures />
        <Footer />
      </div>
    </>
  );
}

function NavBar() {
  return (
    <nav className="flex justify-between items-center h-[2.5vw] w-full ">
      <div>
        <span className="text-3xl text-white metal-mania-regular">
          ScreenBoard
        </span>
      </div>
      <div className="flex items-center justify-between w-[29vw]">
        <Link href="/github.com" className=" text-white cursor-pointer">
          Github
        </Link>
        <Link href="/docs" className=" text-white cursor-pointer">
          Docs
        </Link>
        <Link href="/trending" className=" text-white cursor-pointer">
          Trending
        </Link>
        <Link
          href="/signup"
          className="inline-block cursor-pointer bg-amber-300 px-6 py-2 text-black font-bold
             skew-x-[-20deg] shadow-md hover:bg-amber-400 transition"
        >
          <span className="block skew-x-20">Get Started</span>
        </Link>

        <Link href="/signin" className=" text-white cursor-pointer">
          Log in
        </Link>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <>
      <div className="flex flex-col justify-between w-[43vw] h-[22vw] mt-[18vh] gap-2">
        <span className="text-white text-[4em] leading-18 font-boldonse">
          A Real-time canvas, <br />
          built for collaboration
          <span className="inline-block w-[1vw] h-[1vw] bg-amber-400 ml-2"></span>
          {/* <img src="./uni-shape.png" alt="" className="inline-block w-[2.2vw] ml-2 -mt-2"/> */}
        </span>
        <span className="text-gray-400 text-[1.5em]">
          Multiplayer drawing with live cursors, conflict-free updates, and
          low-latency sync — ready for teams, classrooms, and creators.
        </span>
        <div className="flex pl-2">
          <Link
            href="/signup"
            className="inline-block cursor-pointer bg-amber-300 px-6 py-2 text-black font-bold
             skew-x-[-20deg] shadow-md hover:bg-amber-400 transition"
          >
            <span className="block skew-x-20">Get Started</span>
          </Link>
          <Link
            href="/"
            className="inline-block cursor-pointer px-6 py-2 text-amber-300 border border-amber-300 ml-6
             skew-x-[-20deg] shadow-md"
          >
            <span className="block skew-x-20">Guest Canvas</span>
          </Link>
        </div>
        <div className="absolute top-[5vw] -right-[4vw] ">
          <img src="./dia-bg.png" alt="" className="w-[50vw]" />
        </div>
        <div className="absolute top-[4vw] right-[4vw] -rotate-45">
          <img
            src="./grid3.svg"
            alt=""
            className="w-[40vw]"
            style={{
              WebkitMaskImage:
                "radial-gradient(circle, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 75%)",
              maskImage:
                "radial-gradient(circle, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 75%)",
            }}
          />
        </div>
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
            <VideoPlayer glow={true} white={true} />
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
      <footer className="mt-28 w-full backdrop-blur-2xl bg-white/10 border-t border-white/20 shadow-lg">
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
