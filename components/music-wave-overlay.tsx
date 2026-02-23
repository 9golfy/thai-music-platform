"use client"

import { motion } from "framer-motion"

export default function MusicWaveOverlay() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
            {/* Dotted Mesh Grid */}
            <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                    backgroundImage: "radial-gradient(rgba(180, 142, 62, 0.4) 1px, transparent 1px)",
                    backgroundSize: "32px 32px"
                }}
            />

            {/* Wave Lines Container - Upper and Mid background */}
            <div className="absolute inset-0 flex flex-col justify-start pt-[5%] h-[75%]">
                {[...Array(5)].map((_, i) => (
                    <motion.svg
                        key={i}
                        className="absolute w-[200%] h-48"
                        viewBox="0 0 1000 100"
                        preserveAspectRatio="none"
                        style={{
                            top: `${15 + i * 10}%`,
                            left: '-50%',
                            opacity: 0.06 + (i * 0.02),
                            filter: 'blur(12px)',
                            mixBlendMode: 'screen'
                        }}
                        animate={{
                            x: ["0%", "-20%", "0%"],
                            y: [0, 15, 0],
                        }}
                        transition={{
                            duration: 12 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <path
                            d="M0,50 C200,20 300,80 500,50 C700,20 800,80 1000,50"
                            fill="none"
                            stroke={`url(#wave-gradient-${i})`}
                            strokeWidth="3"
                        />
                        <defs>
                            <linearGradient id={`wave-gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="transparent" />
                                <stop offset="50%" stopColor="#E6E39A" />
                                <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                        </defs>
                    </motion.svg>
                ))}
            </div>

            {/* Floating Music Notes Particles */}
            <div className="absolute top-[10%] left-[5%] right-[5%] bottom-[45%]">
                {[...Array(14)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-[#E6E39A] text-xl"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            filter: 'blur(1.5px)',
                        }}
                        initial={{ opacity: 0.1 }}
                        animate={{
                            y: [0, -15, 0],
                            opacity: [0.1, 0.25, 0.1],
                            scale: [1, 1.15, 1],
                            rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                            duration: 7 + Math.random() * 7,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: Math.random() * 10,
                        }}
                    >
                        {i % 3 === 0 ? "♪" : i % 3 === 1 ? "♫" : "♩"}
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
