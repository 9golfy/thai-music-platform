"use client"

import { motion } from "framer-motion"

export default function EnergyStreamOverlay() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
            {/* Background Ambient Glow */}
            <div className="absolute inset-0 bg-radial-gradient from-[#004d40]/20 via-transparent to-transparent opacity-40" />

            {/* Central Energy Beam */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] sm:w-[4px] md:w-[6px] h-full">
                {/* Core Intensity */}
                <div className="absolute inset-0 bg-[#00FF88] shadow-[0_0_40px_rgba(0,255,136,0.8),0_0_80px_rgba(0,224,255,0.6)]" />

                {/* Animated Glow Pulsing */}
                <motion.div
                    className="absolute inset-0 bg-[#00E0FF] opacity-50 blur-[20px]"
                    animate={{
                        scaleX: [1, 1.5, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            {/* Flowing Energy Threads */}
            <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(6)].map((_, i) => (
                    <motion.svg
                        key={i}
                        className="absolute w-24 sm:w-48 h-full"
                        viewBox="0 0 100 1000"
                        preserveAspectRatio="none"
                        style={{
                            left: `${45 + Math.random() * 10}%`,
                            opacity: 0.1 + Math.random() * 0.2,
                            filter: "blur(4px)",
                            mixBlendMode: "screen",
                        }}
                        animate={{
                            y: ["-10%", "10%", "-10%"],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 8 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <path
                            d="M50,0 Q60,250 50,500 Q40,750 50,1000"
                            fill="none"
                            stroke={i % 2 === 0 ? "#00FF88" : "#00E0FF"}
                            strokeWidth="2"
                            strokeDasharray="20 100"
                        >
                            <animate
                                attributeName="stroke-dashoffset"
                                from="0"
                                to="120"
                                dur={`${4 + i}s`}
                                repeatCount="indefinite"
                            />
                        </path>
                    </motion.svg>
                ))}
            </div>

            {/* Turbulent Particles */}
            <div className="absolute inset-0">
                {[...Array(30)].map((_, i) => {
                    const size = Math.random() * 3 + 1
                    return (
                        <motion.div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                width: size,
                                height: size,
                                backgroundColor: i % 3 === 0 ? "#00FF88" : i % 3 === 1 ? "#00E0FF" : "#50C878",
                                boxShadow: `0 0 ${size * 3}px currentColor`,
                                left: `calc(50% + ${Math.random() * 200 - 100}px)`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, 400],
                                x: [0, Math.random() * 40 - 20, 0],
                                opacity: [0, 0.8, 0],
                                scale: [0, 1.2, 0],
                            }}
                            transition={{
                                duration: 5 + Math.random() * 5,
                                repeat: Infinity,
                                ease: "linear",
                                delay: Math.random() * 5,
                            }}
                        />
                    )
                })}
            </div>

            {/* Ambient Depth Gradients */}
            <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-[#001a12]/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black to-transparent" />
        </div>
    )
}
