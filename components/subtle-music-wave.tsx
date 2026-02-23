"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

// Pre-computed positions to avoid hydration mismatch with Math.random()
const NOTES = [
    { left: 10, top: 20, note: "♪", color: "#00FF88", dur: 9, delay: 0 },
    { left: 25, top: 60, note: "♫", color: "#00E0FF", dur: 11, delay: 2 },
    { left: 40, top: 35, note: "♪", color: "#00FF88", dur: 8, delay: 5 },
    { left: 55, top: 15, note: "♫", color: "#00E0FF", dur: 12, delay: 1 },
    { left: 65, top: 50, note: "♪", color: "#00FF88", dur: 10, delay: 6 },
    { left: 75, top: 30, note: "♫", color: "#00E0FF", dur: 9, delay: 3 },
    { left: 85, top: 70, note: "♪", color: "#00FF88", dur: 13, delay: 4 },
    { left: 20, top: 80, note: "♫", color: "#00E0FF", dur: 11, delay: 7 },
    { left: 50, top: 45, note: "♪", color: "#00FF88", dur: 8, delay: 8 },
    { left: 90, top: 25, note: "♫", color: "#00E0FF", dur: 10, delay: 2 },
]

export default function SubtleMusicWave() {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" style={{ zIndex: 1 }}>

            {/* Wave Lines - visible glow effect */}
            {[0, 1, 2, 3].map((i) => (
                <motion.svg
                    key={i}
                    className="absolute w-[200%] left-[-50%]"
                    viewBox="0 0 1440 120"
                    preserveAspectRatio="none"
                    style={{
                        top: `${18 + i * 14}%`,
                        height: "80px",
                        opacity: 0.25 - i * 0.03,
                        filter: `blur(${4 + i * 2}px)`,
                    }}
                    animate={{
                        x: ["0%", "-10%", "0%"],
                        y: [0, i % 2 === 0 ? 8 : -8, 0],
                    }}
                    transition={{
                        x: { duration: 16 + i * 4, repeat: Infinity, ease: "easeInOut" },
                        y: { duration: 12 + i * 2, repeat: Infinity, ease: "easeInOut" },
                    }}
                >
                    <defs>
                        <linearGradient id={`wg-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="transparent" />
                            <stop offset="30%" stopColor={i % 2 === 0 ? "#00FF88" : "#00E0FF"} />
                            <stop offset="70%" stopColor={i % 2 === 0 ? "#00FF88" : "#00E0FF"} />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                    <path
                        d={i % 2 === 0
                            ? "M0,60 C180,10 360,110 540,60 C720,10 900,110 1080,60 C1260,10 1440,110 1620,60 C1800,10 2000,110 2160,60"
                            : "M0,60 C180,110 360,10 540,60 C720,110 900,10 1080,60 C1260,110 1440,10 1620,60 C1800,110 2000,10 2160,60"
                        }
                        fill="none"
                        stroke={`url(#wg-${i})`}
                        strokeWidth="3"
                    />
                </motion.svg>
            ))}

            {/* Music Note Particles */}
            {isMounted && NOTES.map((n, i) => (
                <motion.div
                    key={i}
                    className="absolute font-serif select-none"
                    style={{
                        left: `${n.left}%`,
                        top: `${n.top}%`,
                        color: n.color,
                        fontSize: "18px",
                        textShadow: `0 0 12px ${n.color}, 0 0 24px ${n.color}`,
                    }}
                    animate={{
                        y: [0, -18, 0],
                        opacity: [0, 0.55, 0],
                        scale: [0.9, 1.1, 0.9],
                    }}
                    transition={{
                        duration: n.dur,
                        delay: n.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    {n.note}
                </motion.div>
            ))}
        </div>
    )
}
