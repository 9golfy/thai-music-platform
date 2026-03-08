"use client"

import { useEffect, useRef } from "react"

interface WaveDef {
  amplitude: number
  frequency: number
  speed: number
  phaseOffset: number
  color: string
  glowColor: string
  lineWidth: number
  blurPx: number
  opacity: number
  yBase: number // 0..1 fraction of canvas height
}

const WAVES: WaveDef[] = [
  { amplitude: 24, frequency: 0.009, speed: 0.007, phaseOffset: 0.0, color: "#00FF88", glowColor: "#00FF88", lineWidth: 1.8, blurPx: 14, opacity: 0.22, yBase: 0.25 },
  { amplitude: 18, frequency: 0.012, speed: 0.005, phaseOffset: 1.8, color: "#D4AF37", glowColor: "#FFD700", lineWidth: 1.6, blurPx: 12, opacity: 0.20, yBase: 0.38 },
//   { amplitude: 28, frequency: 0.0075, speed: 0.009, phaseOffset: 3.4, color: "#00FF88", glowColor: "#00FF88", lineWidth: 2.0, blurPx: 16, opacity: 0.18, yBase: 0.52 },
//   { amplitude: 20, frequency: 0.011, speed: 0.006, phaseOffset: 5.1, color: "#D4AF37", glowColor: "#FFD700", lineWidth: 1.5, blurPx: 10, opacity: 0.15, yBase: 0.65 },
]

// Hardcoded note positions so they don't trigger hydration mismatch
const NOTES = [
  { waveIdx: 0, prog: 0.08, note: "♪", speed: 0.00014, yOff: -10 },
  { waveIdx: 0, prog: 0.52, note: "♫", speed: 0.00011, yOff: -8 },
  { waveIdx: 1, prog: 0.18, note: "♫", speed: 0.00008, yOff: -10 },
  { waveIdx: 1, prog: 0.70, note: "♪", speed: 0.00009, yOff: -8 },
  { waveIdx: 2, prog: 0.33, note: "♪", speed: 0.00013, yOff: -10 },
  { waveIdx: 2, prog: 0.80, note: "♫", speed: 0.00010, yOff: -8 },
  { waveIdx: 3, prog: 0.15, note: "♫", speed: 0.00009, yOff: -10 },
  { waveIdx: 3, prog: 0.60, note: "♪", speed: 0.00012, yOff: -8 },
]

function getWaveY(wave: WaveDef, x: number, t: number, H: number): number {
  return H * wave.yBase + wave.amplitude * Math.sin(wave.frequency * x + wave.speed * t + wave.phaseOffset)
}

interface SineWaveCanvasProps {
  /**
   * ✅ จำนวนเส้น wave ที่ต้องการ render (1–4)
   * - ปรับค่าตอนเรียกใช้: <SineWaveCanvas waveCount={9} ... />
   * - หรือปรับ default ในฟังก์ชัน component ได้
   */
  waveCount?: number

  /** ✅ ตัวคูณความเร็ว (ยิ่งมากยิ่งเร็ว) */
  speed?: number

  /** ✅ ตัวคูณความจางรวมของ wave ทั้งหมด */
  opacity?: number
}

export default function SineWaveCanvas({
  waveCount = 4,   // ✅ เปลี่ยน default จำนวนเส้นได้ตรงนี้
  speed = 1.0,
  opacity = 1.0,
}: SineWaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const tRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // ✅ เลือกจำนวนเส้นตาม waveCount (สูงสุดเท่าที่มีใน WAVES)
    const activeWaves = WAVES.slice(0, Math.min(Math.max(1, waveCount), WAVES.length))

    const resize = () => {
      const dpr = window.devicePixelRatio || 1

      const cssW = canvas.offsetWidth
      const cssH = canvas.offsetHeight

      // canvas resolution in device pixels
      canvas.width = Math.floor(cssW * dpr)
      canvas.height = Math.floor(cssH * dpr)

      // ✅ สำคัญ: reset transform แล้วค่อย set scale (กัน scale ทบซ้อน)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      const W = canvas.offsetWidth   // CSS pixels
      const H = canvas.offsetHeight  // CSS pixels

      ctx.clearRect(0, 0, W, H)

      // ✅ เพิ่มเวลา (t) ไปเรื่อย ๆ → wave "พริ้ว" แบบ sine จริง
      tRef.current += speed

      // waves
      for (const wave of activeWaves) {
        ctx.save()
        ctx.globalAlpha = wave.opacity * opacity
        ctx.shadowColor = wave.glowColor
        ctx.shadowBlur = wave.blurPx
        ctx.strokeStyle = wave.color
        ctx.lineWidth = wave.lineWidth
        ctx.globalCompositeOperation = "screen"

        ctx.beginPath()
        for (let x = 0; x <= W; x += 2) {
          const y = getWaveY(wave, x, tRef.current, H)
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
        ctx.restore()
      }

      // notes riding the waves
      for (const n of NOTES) {
        const wave = activeWaves[n.waveIdx % activeWaves.length]
        if (!wave) continue

        const xPos = ((n.prog + n.speed * tRef.current) % 1) * W
        const bob = n.yOff + 4 * Math.sin(0.003 * tRef.current + n.prog * 10)
        const yPos = getWaveY(wave, xPos, tRef.current, H) + bob

        ctx.save()
        ctx.globalAlpha = 0.30 * opacity
        ctx.shadowColor = wave.glowColor
        ctx.shadowBlur = 10
        ctx.fillStyle = wave.color
        ctx.font = "13px serif"
        ctx.globalCompositeOperation = "screen"
        ctx.fillText(n.note, xPos, yPos)
        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [waveCount, speed, opacity])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
