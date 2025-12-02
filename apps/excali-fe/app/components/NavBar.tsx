import Link from "next/link";


export default function NavBar() {
    return (
        <>
            <div className="flex justify-between items-center w-full h-[5vw] bg-gray-900 text-white pl-[10vw] pr-[10vw]">
                <span>
                    Excalidraw
                </span>
                <div className="flex max-w-[20vw] justify-around">
                    <Link href="/"> Home </Link>
                    <Link href="/userCanvas"> Canvas </Link>
                    <Link href="/about"> About </Link>
                </div>
                <img src="./user-profile.png" alt="" className="w-[2vw] h-[2vw]"/>
            </div>
        </>
    )
}