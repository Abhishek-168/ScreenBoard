"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BE_URL } from "../config";

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
      <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div className="flex flex-col justify-between w-[30vw] h-auto gap-[2vw] p-6 border-2 rounded-xl border-gray-100 bg-gray-900">
          <span className="text-center text-2xl"> Sign in</span>
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
                  className="p-4 border-[0.5px] border-violet-800 rounded-xl"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
                  className="p-4 border-[0.5px] border-violet-800 rounded-xl"
          />
          <button
            className="bg-blue-700 p-4 ml-2 rounded-xl text-white cursor pointer"
            onClick={() => handleSubmit()}
          >
            {" "}
            Sign in{" "}
          </button>
        </div>
      </div>
    </>
  );
}
