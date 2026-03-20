"use client"

import { motion } from "framer-motion"

const notes = [
  { note: "♪", left: "8%", top: "22%", delay: 0.2 },
  { note: "♫", left: "22%", top: "34%", delay: 1.1 },
  { note: "♬", left: "39%", top: "19%", delay: 2.4 },
  { note: "♪", left: "58%", top: "30%", delay: 0.8 },
  { note: "♫", left: "74%", top: "18%", delay: 1.8 },
  { note: "♬", left: "87%", top: "28%", delay: 2.9 },
  { note: "♪", left: "14%", top: "46%", delay: 1.4 },
  { note: "♫", left: "31%", top: "42%", delay: 2.1 },
  { note: "♬", left: "49%", top: "48%", delay: 0.6 },
  { note: "♪", left: "67%", top: "41%", delay: 2.7 },
  { note: "♫", left: "82%", top: "44%", delay: 1.6 },
]

export default function HeroMusicOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-x-0 top-[10%] h-[44%]">
        {[0, 1, 2].map((idx) => (
          <motion.svg
            key={idx}
            viewBox="0 0 1440 320"
            className="absolute left-[-10%] w-[120%]"
            style={{
              top: `${idx * 13}%`,
              opacity: 0.18 - idx * 0.03,
              filter: `blur(${idx === 0 ? 0 : 4 + idx * 2}px)`,
            }}
            animate={{
              x: [0, -30, 0],
              y: [0, 8, 0],
            }}
            transition={{
              duration: 14 + idx * 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <path
              d="M0,160 C120,120 240,210 360,178 C490,144 590,84 720,108 C850,132 940,214 1080,198 C1220,182 1320,106 1440,126"
              fill="none"
              stroke={idx % 2 === 0 ? "rgba(243,221,159,0.85)" : "rgba(50,209,122,0.72)"}
              strokeWidth={idx === 0 ? 2.8 : idx === 1 ? 2.2 : 1.9}
              strokeLinecap="round"
            />
          </motion.svg>
        ))}
      </div>

      {notes.map((item, index) => (
        <motion.span
          key={`${item.note}-${index}`}
          className="absolute select-none text-lg text-[#f3dd9f]/40"
          style={{ left: item.left, top: item.top }}
          animate={{
            y: [0, -10, 0, 8, 0],
            opacity: [0.18, 0.42, 0.18],
            rotate: [0, 8, -6, 0],
          }}
          transition={{
            duration: 7 + index,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay,
          }}
        >
          {item.note}
        </motion.span>
      ))}
    </div>
  )
}
