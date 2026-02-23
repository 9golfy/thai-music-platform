"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function PremiumBackgroundOverlay() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            })
        }
        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 bg-[#000504]">
            {/* Deep Background Gradients */}
            <div className="absolute inset-0 bg-radial-gradient from-[#001a12] via-transparent to-transparent opacity-60" />

            {/* Particle Grid Overlay */}
            <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                    backgroundImage: "radial-gradient(#00FF88 0.5px, transparent 0.5px)",
                    backgroundSize: "40px 40px"
                }}
            />

            {/* Parallax Layer for Grid/Nodes */}
            <motion.div
                className="absolute inset-0"
                animate={{ x: mousePos.x, y: mousePos.y }}
                transition={{ type: "spring", damping: 50, stiffness: 200 }}
            >
                {/* Random Floating Tech Nodes */}
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: Math.random() * 4 + 2,
                            height: Math.random() * 4 + 2,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            backgroundColor: i % 2 === 0 ? "#00FF88" : "#00E0FF",
                            boxShadow: `0 0 15px ${i % 2 === 0 ? "#00FF88" : "#00E0FF"}`,
                        }}
                        animate={{
                            opacity: [0.1, 0.4, 0.1],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: Math.random() * 5,
                        }}
                    />
                ))}
            </motion.div>

            {/* Glowing Horizontal Waves (Light Trails) */}
            <div className="absolute inset-0 flex flex-col justify-center space-y-[-10%] opacity-40">
                {[...Array(4)].map((_, i) => (
                    <motion.svg
                        key={i}
                        className="w-full h-64"
                        viewBox="0 0 1440 320"
                        preserveAspectRatio="none"
                        style={{
                            mixBlendMode: "screen",
                            filter: `blur(${8 + i * 4}px)`,
                        }}
                        animate={{
                            y: [0, 20, 0],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 10 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <motion.path
                            d="M0,160 C320,300 420,0 720,160 C1020,320 1120,20 1440,160"
                            fill="none"
                            stroke={i % 2 === 0 ? "#00FF88" : "#00E0FF"}
                            strokeWidth="2"
                            initial={{ pathLength: 0, pathOffset: 0 }}
                            animate={{
                                pathLength: [0.2, 0.4, 0.2],
                                pathOffset: [0, 1, 0]
                            }}
                            transition={{
                                duration: 15 + i * 5,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        />
                    </motion.svg>
                ))}
            </div>

            {/* Final Vignette & Soft Black Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#000504]/80 via-transparent to-black" />
        </div>
    )
}
