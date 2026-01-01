"use client";

import LeftBar from "../components/LeftBar";
import NavBar from "../components/NavBar";

export default function Profile() {
  return (
    <>
      <div className="flex">
        <LeftBar />
        <div className="flex-1 ml-20">
          <NavBar />
          <ProfileContent />
        </div>
      </div>
    </>
  );
}

function ProfileContent() {
  return (
    <div className="p-10 text-center text-2xl text-gray-500">
      Profile Page - Coming Soon!
    </div>
  );
}