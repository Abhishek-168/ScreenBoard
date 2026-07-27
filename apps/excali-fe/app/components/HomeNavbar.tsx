"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function NavBar() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                setToken(token);
            }
        } catch (error) {
            console.error("Error checking token:", error);
        }
    }, [])

    const handleLogout = () => {
        try {
            localStorage.removeItem("token");
            setToken(null);
            router.push("/");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }

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

                {token ? (<>
                    <Link href="/rooms" className="text-white cursor-pointer">
                        Rooms
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="inline-block cursor-pointer bg-amber-300 px-4 py-1 md:px-6 md:py-2 text-black font-bold
                        skew-x-[-20deg] shadow-md hover:bg-amber-400 transition"
                    >
                        <span className="block skew-x-20">Log out</span>
                    </button>
                </>
                ) : (
                    <>
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
                    </>
                )}
            </div>
            <div className="md:hidden lg:hidden block">
                {token ? (
                    <button
                        onClick={handleLogout}
                        className="inline-block cursor-pointer bg-amber-300 px-4 py-1 md:px-6 md:py-2 text-black font-bold
             skew-x-[-20deg] shadow-md hover:bg-amber-400 transition"
                    >
                        <span className="block skew-x-20">Log out</span>
                    </button>
                ) : (
                    <Link href="/signin" className="text-white cursor-pointer">
                        Log in
                    </Link>
                )}
            </div>
        </nav>
    );
}