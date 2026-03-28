"use client"

import { motion } from "framer-motion"
import SineWaveCanvas from "./sine-wave-canvas"

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-start justify-center overflow-hidden"
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: 'translateY(-100px)' }}
      >
        <source src="/hero-vdo/hero-vdo.mp4" type="video/mp4" />
      </video>

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

          {/* CTA Buttons - Luxury 4 💎 Emerald 🤍 Ivory Style */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-[300px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <a
              href="/regist100"
              className="group relative overflow-hidden rounded-full px-8 py-3.5 text-sm sm:text-base font-semibold text-white transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:scale-[1.02] hover:brightness-110"
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
                boxShadow: "0 4px 15px rgba(16,185,129,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
                {"สมัครประเภทโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์"}
              </span>
            </a>

            <a
              href="/regist-support"
              className="group relative overflow-hidden rounded-full px-6 py-3.5 text-sm sm:text-base font-semibold text-gray-800 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-[1.02] hover:brightness-95"
              style={{
                background: "linear-gradient(135deg, #fefefe 0%, #f8fafc 50%, #f1f5f9 100%)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
                border: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 400 400" fill="none" className="text-emerald-700">
                  <path d="M116.228 250.104C160.625 231.004 176.248 295.603 132.546 311.567C88.4453 327.678 80.4484 273.335 97.7357 260.703C100.653 258.569 103.621 259.21 106.438 256.463" stroke="currentColor" strokeOpacity="1" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M249.999 217.862C297.451 173.612 337.281 267.64 281.465 281.467C240.284 291.668 224.622 254.235 256.295 222.849" stroke="currentColor" strokeOpacity="1" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M161.1 280.566C167.127 263.776 161.557 142.607 167.192 132.843C167.817 131.761 207.382 113.165 247.584 99.8579C274.443 90.9675 307.206 85.0325 308.1 86.0652C312.379 91.004 308.1 209.417 308.1 230.277" stroke="currentColor" strokeOpacity="1" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {"สมัครประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย"}
              </span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade - linear gradient from bottom to top */}
      <div 
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '60%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 20%, rgba(0,0,0,0.4) 40%, transparent 100%)'
        }}
      />
    </section>
  )
}