import Link from "next/link";

export default function NavBar() {
  return (
    <>
      <nav className="fixed w-[95vw] flex justify-between items-center h-16 bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 text-white px-8 border-b border-slate-800/50  z-50">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-2xl text-white font-finger-paint cursor-pointer">
            ScreenBoard
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/Abhishek-168/ScreenBoard" target="_blank"
            className=" px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 group"
          >
            <img src="./github-brands-solid-full.svg" alt="Github" className="w-8" />
          </Link>

           <Link
            href="https://www.linkedin.com/in/abhishek-jain-71879030b/" target="_blank"
            className=" px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 group"
          >
            <img src="./linkedin-brands-solid-full.svg" alt="Github" className="w-8" />
          </Link>

        </div>
      </nav>
    </>
  );
}
