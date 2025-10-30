"use client"

import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [slug, setSlug] = useState("");
  const router = useRouter()

  const joinRoom = () => {
    router.push(`/room/${slug}`)
  };

  return (
    <>
      <div
        style={{
          width: "24vw",
          height: "6vw",
          padding: "2em",
          display: "flex",
          margin: "1em",
        }}
      >
        <input
          type="text"
          placeholder="Enter room name"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <button onClick={() => joinRoom()}> Join </button>
      </div>
    </>
  );
}
