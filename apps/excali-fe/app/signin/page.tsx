"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BE_URL } from "../config";
import Link from "next/dist/client/link";


export default function Signup() {
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
      console.log("Token is " + token);
      router.push("/rooms");
    } catch (error) {
      console.error("Sign in failed:", error);
    }
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
        <div className="flex flex-col justify-between w-[30vw] h-auto gap-[2.5vw] p-8 pl-10 pr-10 rounded-xl bg-gray-900">
          <span className="text-center text-3xl font-charlie"> Sign in</span>
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
                  className="p-4 border border-violet-800 focus:border-amber-300 outline-none rounded-xl"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
                  className="p-4 border border-violet-800 focus:border-amber-300 outline-none rounded-xl"
          />
          <button
            className="bg-amber-300 text-xl p-4 ml-2 rounded-xl text-black font-charlie cursor-pointer"
            onClick={() => handleSubmit()}
          >
            {" "}
            Sign in{" "}
          </button>
          <span className="text-center -mt-5">
            Don't have an account?{" "}
            <Link href="/signup" className="text-amber-300 hover:underline">
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </>
  );
}
