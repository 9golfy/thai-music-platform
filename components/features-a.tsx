"use client"

import { motion } from "framer-motion"

export default function FeaturesA() {
  return (
    <section id="about" className="relative py-24 bg-black">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Portrait / Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative overflow-hidden shadow-xl" style={{ borderRadius: "20px", border: "2px solid #F9E295", boxShadow: "0 0 24px rgba(249,226,149,0.20), 0 0 48px rgba(249,226,149,0.08)" }}>
              {/* Landscape executive photo */}
              <div className="relative w-full" style={{ height: "420px" }}>
                <img
                  src="/images/project-director.png"
                  alt="นางยุถิกา อิศรางกูร ณ อยุธยา"
                  className="w-full h-full object-cover object-top"
                  draggable={false}
                />

                {/* Dark gradient overlay — transparent top → dark bottom */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.65) 100%)",
                    borderRadius: "inherit",
                  }}
                />

                {/* Text sits above the gradient */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 text-center" style={{ zIndex: 2 }}>
                  <p
                    className="font-bold text-base leading-snug"
                    style={{ color: "#F9E295", textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}
                  >
                    {"นางยุถิกา อิศรางกูร ณ อยุธยา"}
                  </p>
                  <p className="text-sm text-white/80 mt-1" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                    {"(อธิบดีกรมส่งเสริมวัฒนธรรม)"}
                  </p>
                </div>
              </div>

              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 h-8 w-8 border-t-2 border-l-2 border-[#F9E295]/50 rounded-tl-[20px]" />
              <div className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-[#F9E295]/50 rounded-br-[20px]" />
            </div>
          </motion.div>

          {/* Right: Thai Quote / Info */}
          <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#BE8C13] leading-tight mb-4 text-balance">
                {"สืบสาน รักษา ต่อยอด วิชาดนตรีไทย"}
              </h2>
              <div className="h-0.5 w-20 bg-gradient-to-r from-[#BE8C13] to-transparent mb-6" />
            </div>

            <blockquote className="border-l-2 border-[#BE8C13]/50 pl-6 py-2">
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed italic">
                {'"ดนตรีไทยเป็นมรดกทางวัฒนธรรมที่ทรงคุณค่า เป็นเอกลักษณ์ของชาติไทย ที่ควรแก่การอนุรักษ์และสืบทอดให้คงอยู่ตลอดไป"'}
              </p>
            </blockquote>

            <p className="text-white/70 leading-relaxed">
              {"โครงการคัดเลือกสถานศึกษา ตามกิจกรรมโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์ มีวัตถุประสงค์เพื่อส่งเสริมให้สถานศึกษาจัดกิจกรรมการเรียนการสอนดนตรีไทย อย่างเป็นรูปธรรม เพื่อปลูกฝังให้เยาวชนมีความรักและภาคภูมิใจในศิลปวัฒนธรรมไทย"}
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="rounded-xl border border-white/15 bg-white/10 px-6 py-4 text-center">
                <p className="text-2xl font-bold text-[#BE8C13]">{"๑๐๐%"}</p>
                <p className="text-xs text-white/60 mt-1">{"โรงเรียนดนตรีไทย"}</p>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 px-6 py-4 text-center">
                <p className="text-2xl font-bold text-[#BE8C13]">{"พ.ศ. ๒๕๖๙"}</p>
                <p className="text-xs text-white/60 mt-1">{"ปีงบประมาณ"}</p>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 px-6 py-4 text-center">
                <p className="text-2xl font-bold text-[#BE8C13]">{"ทั่วประเทศ"}</p>
                <p className="text-xs text-white/60 mt-1">{"สถานศึกษาที่เข้าร่วม"}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
