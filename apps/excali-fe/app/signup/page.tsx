"use client";

import axios from "axios";
import { useState } from "react"
import { BE_URL } from "../config";

export default function Signup() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async () => {
        const res = await axios.post(`${BE_URL}/signup`, {
            name,
            email,
            password
        })
        console.log(res)
    }

    return (
        <>
            <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                <div className="flex flex-col justify-between w-[30vw] h-auto gap-[2vw] p-6 border-2 rounded-xl border-gray-100 bg-gray-50">
                    <span className="text-center text-2xl"> Sign Up</span>
                    <input type="text" placeholder="Name" name="name" value={name} onChange={(e) => setName(e.target.value)}/>
                    <input type="text" placeholder="Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" placeholder="Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <button className="bg-blue-700 p-2 ml-2 rounded-xl text-white" onClick={() => handleSubmit()}> Sign up </button>
                </div>
            </div>
        </>
    )
}