"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BE_URL } from "../config";
import Link from "next/link";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(`${BE_URL}/signin`, {
        email,
        password,
      });
      const token = data;
      if (!token) {
        console.error("Missing token in response");
        return;
      }
      localStorage.setItem("token", token);
      router.push("/rooms");
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  return (
    <>
      <img src="./testbg7.png" alt="" className="w-screen h-screen fixed -z-10" />

      <div className="flex items-center justify-center sm:min-h-screen p-4 md:p-0 md:block md:absolute md:left-[50%] md:top-[45%] md:translate-x-[-50%] md:translate-y-[-45%]">
        <img
          src="./brightsparks.png"
          alt=""
          className="hidden md:block md:w-[7vw] md:relative md:top-15 md:-rotate-25 md:right-6"
        />
        <div className="flex flex-col justify-between w-full max-w-sm md:max-w-none md:w-[30vw] h-auto gap-4 md:gap-[2vw] p-6 md:p-8 pt-6 pb-8 md:pb-10 rounded-xl bg-gray-900">
          <span className="text-center text-2xl md:text-3xl font-charlie text-white">
            Sign In
          </span>
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 md:p-4 border border-violet-800 focus:border-amber-300 autofill:bg-gray-900 outline-none rounded-xl bg-transparent text-white"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 md:p-4 border border-violet-800 focus:border-amber-300 autofill:bg-gray-900 outline-none rounded-xl bg-transparent text-white"
          />
          <button
            className="bg-amber-300 p-3 md:p-4 cursor-pointer rounded-xl text-lg md:text-xl text-black font-charlie font-bold hover:bg-amber-400 transition"
            onClick={() => handleSubmit()}
          >
            Sign in
          </button>
          <span className="text-center text-sm md:text-base text-white">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-amber-300 hover:underline">
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </>
  );
}
