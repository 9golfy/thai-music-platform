"use client"

import { useEffect, useRef } from "react"

interface Wave {
    amplitude: number
    frequency: number
    speed: number
    phase: number
    color: string
    glow: string
    lineWidth: number
    blur: number
    opacity: number
    yFrac: number
}

const WAVES: Wave[] = [
    { amplitude: 30, frequency: 0.006, speed: 0.005, phase: 0.0, color: "#00CC66", glow: "#00FF88", lineWidth: 1.5, blur: 14, opacity: 0.08, yFrac: 0.18 },
    { amplitude: 22, frequency: 0.008, speed: 0.004, phase: 2.0, color: "#C8A632", glow: "#F9E295", lineWidth: 1.3, blur: 12, opacity: 0.07, yFrac: 0.34 },
    { amplitude: 28, frequency: 0.005, speed: 0.006, phase: 4.1, color: "#00CC66", glow: "#00FF88", lineWidth: 1.8, blur: 16, opacity: 0.06, yFrac: 0.55 },
    { amplitude: 18, frequency: 0.009, speed: 0.003, phase: 1.3, color: "#C8A632", glow: "#F9E295", lineWidth: 1.2, blur: 10, opacity: 0.05, yFrac: 0.73 },
]

// Fixed note positions to avoid hydration mismatches
const NOTES = [
    { x: 0.05, yFrac: 0.16, note: "♪", waveIdx: 0, speed: 0.00006, dy: 0.00004, color: "#00FF88" },
    { x: 0.22, yFrac: 0.33, note: "♫", waveIdx: 1, speed: 0.00005, dy: 0.00003, color: "#F9E295" },
    { x: 0.38, yFrac: 0.18, note: "♬", waveIdx: 0, speed: 0.00007, dy: 0.00005, color: "#00FF88" },
    { x: 0.52, yFrac: 0.34, note: "♪", waveIdx: 1, speed: 0.00004, dy: 0.00003, color: "#F9E295" },
    { x: 0.66, yFrac: 0.54, note: "♫", waveIdx: 2, speed: 0.00006, dy: 0.00004, color: "#00FF88" },
    { x: 0.77, yFrac: 0.72, note: "♬", waveIdx: 3, speed: 0.00005, dy: 0.00003, color: "#F9E295" },
    { x: 0.88, yFrac: 0.55, note: "♪", waveIdx: 2, speed: 0.00007, dy: 0.00004, color: "#00FF88" },
    { x: 0.14, yFrac: 0.74, note: "♫", waveIdx: 3, speed: 0.00004, dy: 0.00003, color: "#F9E295" },
    { x: 0.45, yFrac: 0.56, note: "♬", waveIdx: 2, speed: 0.00006, dy: 0.00005, color: "#00FF88" },
    { x: 0.92, yFrac: 0.20, note: "♪", waveIdx: 0, speed: 0.00005, dy: 0.00004, color: "#F9E295" },
]

function getWaveY(wave: Wave, x: number, t: number, H: number): number {
    return H * wave.yFrac + wave.amplitude * Math.sin(wave.frequency * x + wave.speed * t + wave.phase)
}

export default function GlobalWaveBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const rafRef = useRef<number>(0)
    const tRef = useRef<number>(0)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const resize = () => {
            const dpr = window.devicePixelRatio || 1
            canvas.width = window.innerWidth * dpr
            canvas.height = window.innerHeight * dpr
            ctx.scale(dpr, dpr)
        }
        resize()
        window.addEventListener("resize", resize)

        const draw = () => {
            const W = window.innerWidth
            const H = window.innerHeight
            ctx.clearRect(0, 0, W, H)
            tRef.current++

            // Draw sine wave lines
            WAVES.forEach((wave) => {
                ctx.save()
                ctx.globalAlpha = wave.opacity
                ctx.shadowColor = wave.glow
                ctx.shadowBlur = wave.blur
                ctx.strokeStyle = wave.color
                ctx.lineWidth = wave.lineWidth
                ctx.beginPath()
                for (let x = 0; x <= W; x += 2) {
                    const y = getWaveY(wave, x, tRef.current, H)
                    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
                }
                ctx.stroke()
                ctx.restore()
            })

            // Draw floating music notes on wave paths
            NOTES.forEach((n) => {
                const wave = WAVES[n.waveIdx]
                const xPos = ((n.x + n.speed * tRef.current) % 1) * W
                const yBase = getWaveY(wave, xPos, tRef.current, H)
                const yBob = -6 * Math.sin(0.002 * tRef.current + n.x * 20)
                const yPos = yBase + yBob - 10   // float slightly above wave

                ctx.save()
                ctx.globalAlpha = 0.30
                ctx.shadowColor = n.color
                ctx.shadowBlur = 8
                ctx.fillStyle = n.color
                ctx.font = "14px serif"
                ctx.fillText(n.note, xPos, yPos)
                ctx.restore()
            })

            rafRef.current = requestAnimationFrame(draw)
        }
        draw()

        return () => {
            cancelAnimationFrame(rafRef.current)
            window.removeEventListener("resize", resize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: "fixed",
                inset: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 0,
                pointerEvents: "none",
            }}
        />
    )
}
