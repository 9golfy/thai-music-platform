"use client"

import React, { useMemo, useState, useEffect, useRef } from "react"
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "framer-motion"
import { ArrowRight } from "lucide-react"

type Card = {
  image: string
  title: string
  subtitle: string
  bg: string
  href: string
  imgAlt: string
  imgHeight: string
  imgOffsetY?: number
}

const CARDS: Card[] = [
  {
    image: "/images/student-pi.png",
    title: "ข้อมูลโครงการฯ",
    subtitle:
      "เรียนรู้รายละเอียดโครงการคัดเลือกสถานศึกษา เรียนรู้รายละเอียดโครงการคัดเลือกสถานศึกษา",
    bg: "#0B7A3A",
    href: "#about",
    imgAlt: "นักเรียนเป่าปี่",
    imgHeight: "220px",
    imgOffsetY: -68,
  },
  {
    image: "/images/student-ranat.png",
    title: "ประกาศนียบัตร e-Certificate",
    subtitle:
      "ตรวจสอบและดาวน์โหลดประกาศนียบัตรออนไลน์ ตรวจสอบและดาวน์โหลดประกาศนียบัตรออนไลน์",
    bg: "#A07810",
    href: "#certificate",
    imgAlt: "นักเรียนตีระนาด",
    imgHeight: "250px",
    imgOffsetY: -65,
  },
  {
    image: "/images/student-saw.png",
    title: "ดาวน์โหลดเอกสาร",
    subtitle:
      "รับเอกสารและสื่อประชาสัมพันธ์โครงการ รับเอกสารและสื่อประชาสัมพันธ์โครงการ",
    bg: "#7A1B4A",
    href: "#download",
    imgAlt: "นักเรียนสีซอด้วง",
    imgHeight: "230px",
    imgOffsetY: -65,
  },
]

// ─────────────────────────────────────────────────────────────
// ✅ NOTE “เกาะเส้น wave” + ลอยอิสระ (useAnimationFrame)
// ─────────────────────────────────────────────────────────────
function FloatingNote({
  symbol,
  color,
  baseOpacity,
  fontSize,
  waveBaseY,
  waveAmp,
  waveFreq,
  startXPercent,
  speed,
  phase,
  driftY,
}: {
  symbol: string
  color: string
  baseOpacity: number
  fontSize: number
  waveBaseY: number
  waveAmp: number
  waveFreq: number
  startXPercent: number
  speed: number
  phase: number
  driftY: number
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const r = useMotionValue(0)
  const o = useMotionValue(baseOpacity)
  const scale = useTransform(o, (v) => 0.95 + v * 0.25)

  useAnimationFrame((t) => {
    const time = t / 1000

    // ✅ (ปรับเองได้) ความกว้างพื้นที่ที่โน้ตวิ่ง (px)
    const TRAVEL_W = 1400

    // x เคลื่อนแบบวนลูป
    const xPos = ((time * speed + phase) % TRAVEL_W) - TRAVEL_W * 0.15
    x.set(xPos)

    // y “เกาะ wave” + ลอยเพิ่มเล็กน้อย
    const waveY =
      waveBaseY + Math.sin((xPos / 120) * waveFreq + phase * 0.02) * waveAmp
    const floatY = Math.sin(time * 1.6 + phase) * driftY
    y.set(waveY + floatY)

    r.set(Math.sin(time * 0.9 + phase) * 6)
    o.set(baseOpacity + (Math.sin(time * 1.2 + phase) + 1) * 0.08)
  })

  return (
    <motion.span
      className="absolute select-none pointer-events-none font-serif"
      style={{
        left: `${startXPercent}%`,
        x,
        y,
        rotate: r,
        opacity: o,
        scale,
        fontSize,
        color,
        textShadow: `0 0 10px ${color}`,
        lineHeight: 1,
        willChange: "transform, opacity",
      }}
    >
      {symbol}
    </motion.span>
  )
}

// ─────────────────────────────────────────────────────────────
// ✅ Music wave background + notes following waves (SEAMLESS LOOP)
// - แก้กระตุกด้วย "2 segments" + x แบบ modulo
// ─────────────────────────────────────────────────────────────
function MusicWaveParticles() {
  const WAVE_LINES = 4
  const NOTES = 30
  const OPACITY = 0.65
  const SEGMENT_WIDTH = 1200

  const [mounted, setMounted] = useState(false)
  const timeRef = useRef(0)
  const pathRefsRef = useRef<(SVGPathElement | null)[]>([])

  const waves = useMemo(() => {
    return Array.from({ length: WAVE_LINES }).map((_, i) => {
      const baseY = 20 + i * 10
      const amp = 10 + (i % 4) * 6
      const freq = 0.009 + (i % 3) * 0.003
      const phaseSpeed = 0.007 + (i % 3) * 0.002
      const phaseOffset = i * 1.5
      const y = 110 + i * 48
      const scale = 1 + i * 0.02

      return {
        id: `wave-${i}`,
        y,
        scale,
        baseY,
        amp,
        freq,
        phaseSpeed,
        phaseOffset,
      }
    })
  }, [WAVE_LINES])

  const notes = useMemo(() => {
    const SYMBOLS = ["♪", "♫", "♬"]
    return Array.from({ length: NOTES }).map((_, i) => {
      const waveIndex = i % WAVE_LINES
      const phase = 50 + i * 37
      return {
        id: `note-${i}`,
        symbol: SYMBOLS[i % SYMBOLS.length],
        fontSize: 12 + (i % 3) * 4,
        color: i % 2 === 0 ? "rgba(190,140,19,0.85)" : "rgba(0,255,136,0.55)",
        opacity: 0.14 + (i % 6) * 0.03,
        startXPercent: 4 + ((i * 7) % 92),
        waveIndex,
        phase,
        speed: 70 + (i % 6) * 18,
        driftY: 6 + (i % 5) * 3,
      }
    })
  }, [WAVE_LINES, NOTES])

  useEffect(() => {
    setMounted(true)
  }, [])

  useAnimationFrame(() => {
    if (!mounted) return

    timeRef.current += 1

    const step = 30
    for (let waveIdx = 0; waveIdx < waves.length; waveIdx++) {
      const wave = waves[waveIdx]
      const points: { x: number; y: number }[] = []

      for (let x = 0; x <= SEGMENT_WIDTH; x += step) {
        const y = wave.baseY + wave.amp * Math.sin(wave.freq * x + wave.phaseSpeed * timeRef.current + wave.phaseOffset)
        points.push({ x, y })
      }

      let d = `M ${points[0].x} ${points[0].y}`
      for (let j = 1; j < points.length; j++) {
        const prev = points[j - 1]
        const cur = points[j]
        const cx = (prev.x + cur.x) / 2
        const cy = (prev.y + cur.y) / 2
        d += ` Q ${prev.x} ${prev.y} ${cx} ${cy}`
      }

      const pathIndex = waveIdx * 2
      if (pathRefsRef.current[pathIndex]) {
        pathRefsRef.current[pathIndex]!.setAttribute("d", d)
      }
      if (pathRefsRef.current[pathIndex + 1]) {
        pathRefsRef.current[pathIndex + 1]!.setAttribute("d", d)
      }
    }
  })

  if (!mounted) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0" style={{ opacity: OPACITY }} />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0" style={{ opacity: OPACITY }}>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 2400 600"
          preserveAspectRatio="none"
          style={{ willChange: "contents" }}
        >
          <defs>
            <linearGradient id="waveGrad-fb" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="rgba(190,140,19,0.0)" />
              <stop offset="0.45" stopColor="rgba(190,140,19,0.45)" />
              <stop offset="1" stopColor="rgba(190,140,19,0.0)" />
            </linearGradient>
            <filter id="softGlow-fb" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {waves.map((w, idx) => (
            <g key={w.id} filter={idx < 3 ? "url(#softGlow-fb)" : undefined} opacity={0.55}>
              <g transform={`translate(0, ${w.y}) scale(${w.scale})`}>
                <path
                  ref={(el) => { pathRefsRef.current[idx * 2] = el }}
                  d=""
                  fill="none"
                  stroke="url(#waveGrad-fb)"
                  strokeWidth={idx % 2 === 0 ? 2 : 1.5}
                />
              </g>
              <g transform={`translate(${SEGMENT_WIDTH}, ${w.y}) scale(${w.scale})`}>
                <path
                  ref={(el) => { pathRefsRef.current[idx * 2 + 1] = el }}
                  d=""
                  fill="none"
                  stroke="url(#waveGrad-fb)"
                  strokeWidth={idx % 2 === 0 ? 2 : 1.5}
                />
              </g>
            </g>
          ))}
        </svg>

        {notes.map((n) => {
          const w = waves[n.waveIndex]
          return (
            <FloatingNote
              key={n.id}
              symbol={n.symbol}
              color={n.color}
              baseOpacity={n.opacity}
              fontSize={n.fontSize}
              startXPercent={n.startXPercent}
              speed={n.speed}
              phase={n.phase}
              driftY={n.driftY}
              waveBaseY={w.y + w.baseY}
              waveAmp={w.amp}
              waveFreq={w.freq}
            />
          )
        })}
      </div>
    </div>
  )
}

export default function FeaturesB() {
  return (
    <section id="certificate" className="relative py-24 bg-[#0A3625] overflow-hidden">
      <MusicWaveParticles />

      <div className="mx-auto max-w-7xl px-6 relative">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#BE8C13] mb-4">
            {"จุดเด่นของโครงการ"}
          </h2>
          <div className="mx-auto h-0.5 w-16 bg-gradient-to-r from-transparent via-[#BE8C13] to-transparent mb-4" />
          <p className="max-w-xl mx-auto text-white/70 leading-relaxed">
            {"โครงการที่ครอบคลุมทุกมิติของการส่งเสริมดนตรีไทยในสถานศึกษา "}
          </p>
        </motion.div>

        {/* 3-column promo cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
          {CARDS.map((card, i) => {
            const imgH = parseInt(card.imgHeight, 10) || 250
            const overlapRatio = 0.45
            const overlapPx = Math.round(imgH * overlapRatio)
            const cardMinHeight = 160
            const ARROW_COL_W = 64

            return (
              <motion.div
                key={card.title}
                className="relative flex flex-col items-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                {/* image */}
                <div className="relative w-full flex justify-center" style={{ zIndex: 0, height: card.imgHeight }}>
                  <img
                    src={card.image}
                    alt={card.imgAlt}
                    draggable={false}
                    className="absolute bottom-0 w-auto select-none pointer-events-none"
                    style={{
                      height: "100%",
                      objectFit: "contain",
                      objectPosition: "bottom center",
                      transform: `translateY(${card.imgOffsetY ?? 0}px)`,
                      mixBlendMode: "normal",
                      filter: "drop-shadow(0 10px 28px rgba(0,0,0,0.35))",
                    }}
                  />
                </div>

                {/* card */}
                <motion.a
                  href={card.href}
                  className="group relative w-full overflow-hidden cursor-pointer no-underline"
                  style={{
                    zIndex: 2,
                    marginTop: `-${overlapPx}px`,
                    borderRadius: "20px",
                    backgroundColor: card.bg,
                    minHeight: `${cardMinHeight}px`,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.40)",
                  }}
                  whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}
                  transition={{ duration: 0.25 }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
                    style={{
                      background: "linear-gradient(to bottom, rgba(255,255,255,0.07), transparent)",
                      zIndex: 1,
                    }}
                  />

                  {/* ✅ ลูกศรกึ่งกลางแนวตั้งเสมอ */}
                  <div className="relative px-7 pt-6 pb-6 flex items-stretch gap-4" style={{ zIndex: 3 }}>
                    <div className="min-w-0 flex-1">
                      <h3
                        className="text-lg sm:text-xl font-bold text-white leading-tight mb-2"
                        style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
                      >
                        {card.title}
                      </h3>
                      <p className="text-white/75 leading-relaxed" style={{ fontSize: 16 }}>
                        {card.subtitle}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center justify-end" style={{ width: ARROW_COL_W }}>
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-full transition-transform duration-300 group-hover:translate-x-1"
                        style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
                        aria-hidden="true"
                      >
                        <ArrowRight className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.a>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}