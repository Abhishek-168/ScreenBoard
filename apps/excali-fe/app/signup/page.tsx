"use client";

import axios from "axios";
import { useState } from "react";
import { BE_URL } from "../config";
import { useRouter } from "next/navigation";

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
      <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div className="flex flex-col justify-between w-[30vw] h-auto gap-[2vw] p-8 pt-6 pb-10 border-2 rounded-xl border-gray-100 bg-gray-900">
          <span className="text-center text-3xl font-boldonse"> Sign Up</span>
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-4 border-[0.5px] border-violet-800 rounded-xl"
          />
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
            className="bg-blue-700 p-4 cursor-pointer rounded-xl text-white"
            onClick={() => handleSubmit()}
          >
            {" "}
            Sign up{" "}
          </button>
        </div>
      </div>
    </>
  );
}
