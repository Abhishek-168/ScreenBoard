import Link from "next/link";


export default function NavBar() {
    return (
        <>
            <div className="flex justify-between items-center h-[4vw] bg-black text-white pl-[2vw] pr-[2vw] border-b-[0.8px] border-gray-600">
                <Link href="/" className="text-2xl">
                    Excalidraw
                </Link >
                <div className="flex max-w-[20vw] w-[15vw] bg-pink-700 justify-around">
                    <Link href="/"> Github </Link>
                    <Link href="/coffee"> Coffee </Link>
                </div>
                {/* <img src="./user-profile.png" alt="" className="w-[2vw] h-[2vw]"/> */}
            </div>
        </>
    )
}