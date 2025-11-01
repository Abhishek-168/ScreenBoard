"use client";

import { useEffect, useRef } from "react"


export default function Canvas() {

    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect( () => {

        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d")

            if (!ctx) return;

            let startX = 0;
            let startY = 0;
            let width = 0;
            let height = 0;

            ctx.strokeStyle = "white"
            ctx.lineWidth = 2
            // ctx.strokeRect(0, 0, 600, 60)
            let clicked = false
            canvas.addEventListener("mousedown", (e) => {
                clicked = true
                startX = e.clientX
                startY = e.clientY
                console.log(startX)
                console.log(startY)
            })

            canvas.addEventListener("mouseup", (e) => {
                clicked= false
               
            })
            
            canvas.addEventListener("mousemove", (e) => {
                if (clicked) {
                    width = e.clientX - startX
                    height = e.clientY - startY
                    ctx.clearRect(0, 0, canvas.width, canvas.height)
                    ctx.strokeRect(startX, startY, width, height)
                }
            })
            
        }

    }, [canvasRef])

    return (
        <>
            <div>
                <canvas ref={canvasRef} width={1536} height={701} className="bg-black"></canvas>
            </div>
        </>
    )
}