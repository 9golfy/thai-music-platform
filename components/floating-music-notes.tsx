"use client"

import { motion } from "framer-motion"

const musicNotes = [
  { char: "\u266A", x: "10%", y: "20%", delay: 0, size: "text-xs" },
  { char: "\u266B", x: "22%", y: "60%", delay: 2.5, size: "text-sm" },
  { char: "\u266A", x: "38%", y: "30%", delay: 5, size: "text-xs" },
  { char: "\u266B", x: "52%", y: "55%", delay: 1.5, size: "text-sm" },
  { char: "\u266A", x: "65%", y: "25%", delay: 4, size: "text-xs" },
  { char: "\u266B", x: "78%", y: "50%", delay: 3, size: "text-sm" },
  { char: "\u266A", x: "88%", y: "35%", delay: 6, size: "text-xs" },
  { char: "\u266B", x: "45%", y: "70%", delay: 7, size: "text-xs" },
]

export default function FloatingMusicNotes() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {musicNotes.map((note, i) => (
        <motion.span
          key={i}
          className={`absolute ${note.size} select-none`}
          style={{
            left: note.x,
            top: note.y,
            color: "rgba(255, 255, 255, 0.18)",
            filter: "blur(1px)",
          }}
          animate={{
            y: [0, -6, 0, 6, 0],
            opacity: [0.12, 0.25, 0.12],
          }}
          transition={{
            duration: 8 + i,
            delay: note.delay,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          {note.char}
        </motion.span>
      ))}
    </div>
  )
}
