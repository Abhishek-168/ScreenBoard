import Link from "next/link";
import VideoPlayer from "./videoPlayer";
import "./globals.css";
import TechCarousel from "./components/TechCarousel";

export default function Home() {
  return (
    <>
      <img src="./testbg7.png" alt="" className="md:w-screen h-screen fixed -z-10" />
      <div className="p-4 md:p-6 md:pl-20 md:pr-20">
        <NavBar />
        <HeroSection />
        <TechCarousel />
        <CoreFeatures />
        <Footer />
      </div>
    </>
  );
}

function NavBar() {
  return (
    <nav className="flex md:flex-row justify-between items-center gap-4 md:gap-0 md:h-[2.5vw] w-full">
      <div>
        <span className="text-2xl md:text-3xl text-white font-finger-paint cursor-pointer">
          ScreenBoard
        </span>
      </div>
      <div className="hidden md:flex md:flex-wrap md:items-center md:gap-4 md:justify-between md:w-[29vw]">
        <Link href="/github.com" className="text-white cursor-pointer">
          Github
        </Link>
        <Link href="/docs" className="text-white cursor-pointer">
          Docs
        </Link>
        <Link href="/trending" className="text-white cursor-pointer">
          Trending
        </Link>
        <Link
          href="/signup"
          className="inline-block cursor-pointer bg-amber-300 px-4 py-1 md:px-6 md:py-2 text-black font-bold
             skew-x-[-20deg] shadow-md hover:bg-amber-400 transition"
        >
          <span className="block skew-x-20">Get Started</span>
        </Link>

        <Link href="/signin" className="text-white cursor-pointer">
          Log in
        </Link>
      </div>
      <div className="md:hidden lg:hidden block">
        <Link href="/signin" className="text-white cursor-pointer">
          Log in
        </Link>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <>
      <div className="flex flex-col justify-between w-full md:w-[43vw] h-auto md:h-[22vw] mt-14 md:mt-[18vh] gap-4 md:gap-1">
        <span className="text-white text-4xl md:text-[2.8em] font-boldonse leading-12 md:leading-18">
          A Real-time canvas, <br />
          built for collaboration
          <span className="inline-block w-2 h-2 md:w-[1vw] md:h-[1vw] bg-amber-400 ml-2"></span>
          {/* <img src="./uni-shape.png" alt="" className="inline-block w-8 md:w-[2.2vw] ml-2 -mt-1 md:-mt-2"/> */}
        </span>
        <span className="text-gray-400 font-sans text-[1.2em] md:text-[1.5em] mt-2 md:-mt-4">
          Multiplayer drawing with live cursors, conflict-free updates, and
          low-latency sync — ready for teams, classrooms, and creators.
        </span>
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:pl-2">
          <Link
            href="/signup"
            className="inline-block cursor-pointer bg-amber-300 px-4 py-2 md:px-6 md:py-2 text-black font-bold
             skew-x-[-20deg] shadow-md hover:bg-amber-400 transition"
          >
            <span className="block skew-x-20">Get Started</span>
          </Link>
          <Link
            href="/"
            className="inline-block cursor-pointer px-4 py-2 md:px-6 md:py-2 text-amber-300 border border-amber-300 md:ml-6
             skew-x-[-20deg] shadow-md"
          >
            <span className="block skew-x-20">Guest Canvas</span>
          </Link>
        </div>
        <div className="hidden md:block md:absolute md:top-[5vw] md:-right-[4vw]">
          <img src="./dia-bg.png" alt="" className="w-full md:w-[50vw]" />
          <img
            src="./sparks.png"
            alt=""
            className="w-20 md:w-[9vw] absolute top-8 left-4 md:top-[3.7vw] md:left-[2vw] opacity-90"
          />
        </div>
        <div className="absolute -z-2 md:block md:absolute md:top-[4vw] md:right-[4vw] md:-rotate-45">
          <img
            src="./grid3.svg"
            alt=""
            className="w-full md:w-[40vw]"
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
      <div className="h-full text-white rounded-2xl md:rounded-4xl relative mt-12 md:mt-0">
        <span className="relative pb-2 md:pb-4 text-4xl md:text-6xl font-boldonse z-10">
          Our Core
        </span>
        <span className="relative pb-2 md:pb-4 text-4xl md:text-6xl font-boldonse -z-10">
          {" "}
          Featur
        </span>
        <span className="relative pb-2 md:pb-4 text-4xl md:text-6xl font-boldonse z-10">es</span>
        <img src="./svgline.png" alt="" className="absolute  md:block md:absolute -top-17 sm:-top-15 md:left-70 sm:left-50" />
        <img src="./sidesvg.png" alt="" className="absolute  md:block md:absolute md:-left-16 md:top-0" />
        <div className="pl-4 md:pl-30">
          <div>
            <Feature title="Modern Drawing Canvas" 
            description="Draw on a modern, responsive canvas with a variety of tools and options. Drag elements, change colors, and customize your artwork with ease.
            Add text, shapes, and images to bring your ideas to life. Use AI-powered tools to enhance your creativity." />
          </div>
          <div>
            <Feature title="Synched Collaborative Canvas" description="Collaborate in real-time with others on the same canvas. See live cursors, conflict-free updates, and low-latency synchronization for a seamless team experience.
            " />
          </div>
          <div>
            <Feature title="Create Rooms Public or Private" description="Create public or private rooms to control access and collaboration. Invite team members or share links to join. Manage room settings and permissions for a secure and flexible experience." />
          </div>
        </div>
      </div>
    </>
  );
}

function Feature({ title , description}: { title: string , description: string}) {
  return (
    <>
      <div className="flex md:flex-row items-center p-4 md:p-8 w-full md:w-[70vw] mx-auto rounded-xl gap-6 md:gap-10 md:pl-[4vw] mt-6 md:mt-[1.4vw]">
        <div className="flex items-center gap-4 md:gap-10 w-full md:w-auto">
          <div className="w-[35vw] md:w-[15vw]">
            <VideoPlayer />
          </div>
        </div>

        <div className="flex flex-col max-w-full md:max-w-[37vw] md:ml-[4vw]">
          <h2 className="text-2xl md:text-4xl font-charlie text-white">{title}</h2>
          <p className="text-white mt-2 text-sm md:text-xl leading-relaxed font-sans text-justify">
            {description}
          </p>
        </div>
      </div>
    </>
  );
}

function Footer() {
  return (
    <>
      <footer className="mt-16 md:mt-28 w-full backdrop-blur-2xl bg-white/5 border-t border-amber-300 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10 grid grid-cols-2 gap-6 md:gap-8 text-white">
          <div>
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Pages</h2>
            <ul className="space-y-1 md:space-y-2">
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
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Contact</h2>
            <ul className="space-y-1 md:space-y-2">
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

        <div className="text-center text-white/60 py-3 md:py-4 text-xs md:text-sm border-t border-white/10">
          © 2025 ScreenBoard. All rights reserved.
        </div>
      </footer>
    </>
  );
}
