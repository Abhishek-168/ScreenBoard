"use client";

import axios from "axios";
import { useState } from "react";
import { BE_URL } from "../config";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    const { data } = await axios.post(`${BE_URL}/signup`, {
      name,
      email,
      password,
    });
    const token = data;
    if (!token) {
      console.error("Missing token in response");
      return;
    }
    localStorage.setItem("token", token);
    console.log("Token is " + token);
    router.push("/rooms");
    console.log(data);
  };

  return (
    <>
      <img src="./testbg7.png" alt="" className="w-screen fixed -z-10" />

      <div className="absolute left-[50%] top-[45%] translate-x-[-50%] translate-y-[-50%]">
        <img
          src="./brightsparks.png"
          alt=""
          className="w-[7vw] relative top-15 -rotate-25 right-6"
        />
        <div className="flex flex-col justify-between w-[30vw] h-auto gap-[2vw] p-8 pt-6 pb-10 rounded-xl bg-gray-900">
          <span className="text-center text-3xl font-charlie text-white">
            {" "}
            Sign Up{" "}
          </span>
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-4 border border-violet-800 focus:border-amber-300 autofill:bg-gray-900 outline-none rounded-xl "
          />
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-4 border border-violet-800 focus:border-amber-300 autofill:bg-gray-900 outline-none rounded-xl"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-4 border border-violet-800 focus:border-amber-300 autofill:bg-gray-900 outline-none rounded-xl"
          />
          <button
            className="bg-amber-300 p-4 cursor-pointer rounded-xl text-xl text-black font-charlie font-bold hover:bg-amber-400 transition"
            onClick={() => handleSubmit()}
          >
            {" "}
            Sign up{" "}
          </button>
          <span className="text-center">
            Already have an account?{" "}
            <Link href="/signin" className="text-amber-300 hover:underline">
              Log in
            </Link>
          </span>
        </div>
      </div>
    </>
  );
}
