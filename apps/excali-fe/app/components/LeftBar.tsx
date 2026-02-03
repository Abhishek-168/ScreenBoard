import Link from "next/link";

export default function LeftBar() {
  return (
    <>
      <div className="w-[5vw] h-screen bg-linear-to-b from-slate-900 to-slate-950 flex flex-col gap-2 items-center py-6 fixed border-r border-slate-800/50 backdrop-blur-sm">
        <Link
          href="/rooms"
          className="p-3 pt-0 rounded-2xl cursor-pointer"
          title="Home"
        >
          <div className="p-2 w-10 sm:w-8 bg-white/10 rounded-2xl flex items-center justify-center">
            <img src="./house-regular.svg" alt="" />
          </div>
        </Link>

        <Link
          href="/profile"
          className="p-3 rounded-2xl cursor-pointer"
          title="Profile"
        >
          <div className="p-2 w-10 sm:w-8 bg-white/10 rounded-2xl flex items-center justify-center">
            <img src="./user-regular-full.svg" alt="" />
          </div>
        </Link>

        <Link
          href="/canvases"
          className="p-3 rounded-2xl cursor-pointer"
          title="Your Canvases"
        >
          <div className="p-2 w-10 sm:w-8 bg-white/10 rounded-2xl flex items-center justify-center">
            <img src="./pen-to-square-regular-full.svg" alt="" />
          </div>
        </Link>

        <Link
          href="/joined-rooms"
          className="p-3 rounded-2xl cursor-pointer"
          title="Joined Rooms"
        >
          <div className="p-2 w-10 sm:w-8 bg-white/10 rounded-2xl flex items-center justify-center">
            <img src="./users-solid-full.svg" alt="" />
          </div>
        </Link>

        <Link
          href="/notifications"
          className="p-3 rounded-2xl cursor-pointer"
          title="Notifications"
        >
          <div className="relative">
            <div className="p-2 w-10 sm:w-8 bg-white/10 rounded-2xl flex items-center justify-center">
              <img src="./bell-regular-full.svg" alt="" />
            </div>

            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
        </Link>

        <div className="flex-1"></div>
        <Link
          href="/settings"
          className="p-3 rounded-2xl mb-4 cursor-pointer"
          title="Settings"
        >
            <div className="p-2 w-10 sm:w-8 bg-white/10 rounded-2xl flex items-center justify-center">
              <img src="./gear-solid-full.svg" alt="Settings" />
            </div>

        </Link>
      </div>
    </>
  );
}
