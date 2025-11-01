
export default function Home() {
  return (
    <NavBar />
  );
}

function NavBar() {
  return (
    <nav className="flex justify-between items-center h-[10vh] w-full p-2 bg-gray-800">
      <div>
        <span className="text-3xl text-white">Excalidraw</span>
      </div>
      <div>
        <button className="bg-blue-700 p-2 ml-2 rounded-xl text-white"> Sign in </button>
        <button className="bg-orange-700 p-2 ml-2 mr-2 rounded-xl text-white"> Sign up </button>
      </div>
    </nav>
  );
}
