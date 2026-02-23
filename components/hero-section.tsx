"use client"

import { motion } from "framer-motion"
import SineWaveCanvas from "./sine-wave-canvas"

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-start justify-center overflow-hidden"
    >
      {/* Background Image (เหมือนเดิม) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-bg2.jpg')" }}
      />

      {/* Overlays (เหมือนเดิม) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A3625]/40 via-transparent to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

      {/* ✅ Sine wave (เหมือนเดิม) */}
      {/* ✅ (ปรับเลขเองได้) waveCount = จำนวนเส้น wave */}
      {/* ✅ (ปรับเลขเองได้) speed = ความเร็วไหลของคลื่น (ยิ่งมาก ยิ่งเร็ว) */}
      {/* ✅ (ปรับเลขเองได้) opacity = ความจางรวมของเส้น */}
      <SineWaveCanvas waveCount={9} speed={1.35} opacity={0.55} />

      {/* Text Content (เหมือนเดิม) */}
      <div className="relative z-10 flex flex-col items-center px-6 mt-[150px] text-center">
        <motion.div
          className="flex flex-col items-center gap-5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1
            className="cinematic-gold-title text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-bold leading-tight text-balance"
            style={{
              paddingBottom: "5px",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {"ขอเชิญลงทะเบียนเสนอผลงาน 69"}
          </motion.h1>

          <motion.p
            className="max-w-4xl text-base sm:text-lg md:text-xl text-white/90 leading-relaxed lg:whitespace-nowrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {"เพื่อเข้าร่วมรับการคัดเลือกกิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์ ประจำปีงบประมาณ พ.ศ. 2569"}
          </motion.p>

          <motion.p
            className="max-w-2xl text-sm sm:text-base md:text-lg text-white/70 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {"เพื่อสืบสาน รักษา ต่อยอดวิชาดนตรีไทยให้คงอยู่คู่สังคมไทย"}
          </motion.p>

          {/* CTA Buttons (เหมือนเดิม) */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-[200px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <a
              href="/regist-100"
              className="group relative overflow-hidden rounded-full px-8 py-3.5 text-sm sm:text-base font-semibold text-[#5a4210] transition-all duration-300 hover:shadow-[0_0_20px_rgba(180,142,62,0.4)] hover:scale-[1.02]"
              style={{
                background: "linear-gradient(90deg, #B48E3E, #E6E39A, #B48E3E)",
              }}
            >
              <span className="relative z-10">
                {"สมัครประเภทโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์"}
              </span>
            </a>

            <a
              href="/regist-support"
              className="group relative overflow-hidden rounded-full border-2 border-[#B48E3E]/60 bg-transparent px-8 py-3.5 text-sm sm:text-base font-semibold text-[#E6E39A] transition-all duration-300 hover:border-[#E6E39A] hover:shadow-[0_0_20px_rgba(180,142,62,0.3)] hover:scale-[1.02]"
            >
              <span className="relative z-10">
                {"สมัครประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย"}
              </span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade (เหมือนเดิม) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  )
}