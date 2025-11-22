import Link from "next/link";

export default function Home() {
  return <NavBar />;
}

function NavBar() {
  return (
    <nav className="flex justify-between items-center h-[10vh] w-full p-2 bg-gray-800">
      <div>
        <span className="text-3xl text-white">Excalidraw</span>
      </div>
      <div>
        <Link
          href="/signin"
          className="bg-blue-700 p-2 ml-2 rounded-xl text-white cursor-pointer "
        >
          {" "}
          Sign in{" "}
        </Link>
        <Link
          href="/signup"
          className="bg-orange-700 p-2 ml-2 mr-2 rounded-xl text-white cursor-pointer"
        >
          {" "}
          Sign up{" "}
        </Link>
      </div>
    </nav>
  );
}
