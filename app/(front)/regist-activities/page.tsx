"use client"

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import HeroMusicOverlay from "@/components/hero-music-overlay";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function RegistActivitiesPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-[#071d15] pt-16 text-[#f7f0df]">
        {/* Hero Section */}
        <section className="relative isolate">
          <div className="absolute inset-0">
            <Image
              src="/images/info-img.png"
              alt="บรรยากาศการเรียนดนตรีไทย"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(237,197,94,0.18),transparent_30%),linear-gradient(180deg,rgba(5,18,13,0.24)_0%,rgba(7,29,21,0.88)_58%,#071d15_100%)]" />
            <div className="absolute inset-0 bg-black/38" />
          </div>
          <HeroMusicOverlay />

          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="inline-flex rounded-full border border-[#f0d48d]/30 bg-[#f0d48d]/10 px-4 py-2 text-sm tracking-[0.22em] text-[#f3dd9f]"
              >
                สมัครเข้าร่วมโครงการ
              </motion.span>

              <motion.h1
                className="cinematic-gold-title mt-6 text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-[4rem]"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                เลือกประเภทการสมัคร
              </motion.h1>

              <motion.p
                className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/86 sm:text-xl"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.8 }}
              >
                เลือกประเภทการสมัครที่เหมาะสมกับโรงเรียนของคุณ
                เพื่อเข้าร่วมกิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* YouTube Video Section */}
        <section className="relative bg-black px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-5xl"
          >
            <div className="overflow-hidden rounded-2xl border border-[#d2bb80]/20 bg-[linear-gradient(180deg,rgba(12,40,31,0.98),rgba(7,25,19,0.98))] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                <iframe
                  src="https://www.youtube.com/embed/dwfCiZWcXdc"
                  title="วิดีโอแนะนำกิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              <div className="mt-4 space-y-3">
                <p className="text-center text-sm text-white/70">
                  วิดีโอแนะนำกิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('https://youtu.be/dwfCiZWcXdc?si=J0TyIeU7eZMRjMlv');
                      const btn = document.getElementById('copy-link-btn');
                      if (btn) {
                        btn.textContent = '✓ คัดลอกแล้ว';
                        setTimeout(() => {
                          btn.textContent = 'คัดลอกลิงก์';
                        }, 2000);
                      }
                    }}
                    id="copy-link-btn"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#f0d48d]/10 px-4 py-2 text-sm font-medium text-[#f0d48d] transition-colors hover:bg-[#f0d48d]/20"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    คัดลอกลิงก์
                  </button>
                  <a
                    href="https://youtu.be/dwfCiZWcXdc?si=J0TyIeU7eZMRjMlv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-red-600/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-600/20"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    ดูใน YouTube
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Registration Cards Section */}
        <section className="relative bg-black px-4 pb-24 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mx-auto max-w-6xl"
          >
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Card 1: Register 100 */}
              <motion.div variants={fadeUp} transition={{ duration: 0.7, ease: "easeOut" }}>
                <Link href="/regist100">
                  <div className="group relative h-full overflow-hidden rounded-[2rem] border border-[#d2bb80]/18 bg-[linear-gradient(180deg,rgba(12,40,31,0.98),rgba(7,25,19,0.98))] shadow-[0_22px_60px_rgba(0,0,0,0.14)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
                    {/* Image Section */}
                    <div className="relative h-64 overflow-hidden border-b border-[#d2bb80]/10">
                      <Image
                        src="/images/register100activity.png"
                        alt="โรงเรียนดนตรีไทย 100 เปอร์เซ็นต์"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071d15]/80 via-transparent to-transparent" />
                    </div>

                    {/* Content Section */}
                    <div className="p-8 sm:p-10">
                      {/* Title */}
                      <h2 className="text-2xl font-semibold leading-tight text-[#fff1c4] sm:text-3xl">
                        สมัครประเภทโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์
                      </h2>

                      {/* Description */}
                      <p className="mt-4 leading-7 text-white/82">
                        สำหรับสถานศึกษาในระดับชั้นประถมศึกษา ระดับชั้นขยายโอกาสทางการศึกษา 
                        ระดับชั้นมัธยมศึกษา สถานศึกษาที่มีการจัดการศึกษาเฉพาะทาง 
                        โรงเรียนการศึกษาพิเศษ ทั้งภาครัฐ และภาคเอกชนทั่วประเทศ
                      </p>

                      

                      {/* CTA */}
                      <div className="mt-8 flex items-center justify-between">
                        <span className="text-[#f0d48d] transition-colors duration-300 group-hover:text-[#f5da94]">
                          คลิกที่นี่เพื่อสมัคร
                        </span>
                        <svg
                          className="h-6 w-6 text-[#f0d48d] transition-transform duration-500 group-hover:translate-x-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_50%_0%,rgba(240,201,105,0.15),transparent_50%)]" />
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Card 2: Register Support */}
              <motion.div variants={fadeUp} transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}>
                <Link href="/regist-support">
                  <div className="group relative h-full overflow-hidden rounded-[2rem] border border-[#ead9ae]/70 bg-[radial-gradient(circle_at_top,rgba(255,248,234,0.98),rgba(246,236,210,0.98)_70%,rgba(240,225,188,0.98)_100%)] text-[#173629] shadow-[0_26px_70px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_35px_90px_rgba(0,0,0,0.18)]">
                    {/* Image Section */}
                    <div className="relative h-64 overflow-hidden border-b border-[#ead9ae]">
                      <Image
                        src="/images/registersupportactivity.png"
                        alt="โรงเรียนสนับสนุนและส่งเสริมดนตรีไทย"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#f6ecd2]/60 via-transparent to-transparent" />
                    </div>

                    {/* Content Section */}
                    <div className="p-8 sm:p-10">
                      {/* Title */}
                      <h2 className="text-2xl font-semibold leading-tight text-[#173629] sm:text-3xl">
                        สมัครประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย
                      </h2>

                      {/* Description */}
                      <p className="mt-4 leading-7 text-[#28473b]/90">
                        สำหรับชุมนุมดนตรีไทย หรือชมรมดนตรีไทย หรือกลุ่มดนตรีไทย หรือวงดนตรีไทย 
                        หรือสถานศึกษาที่จัดการเรียนการสอนดนตรีไทย 
                      </p>

                     

                      {/* CTA */}
                      <div className="mt-8 flex items-center justify-between">
                        <span className="text-[#0f6b44] transition-colors duration-300 group-hover:text-[#0a5534]">
                          คลิกที่นี่เพื่อสมัคร
                        </span>
                        <svg
                          className="h-6 w-6 text-[#0f6b44] transition-transform duration-500 group-hover:translate-x-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_50%_0%,rgba(15,107,68,0.08),transparent_50%)]" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* Info Box */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
              className="mt-12"
            >
              <div className="overflow-hidden rounded-[2rem] border border-[#d2bb80]/18 bg-[linear-gradient(135deg,rgba(209,169,76,0.16),rgba(10,35,26,0.98))] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:p-10">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f0c969]/14 text-2xl">
                    💡
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#fff1c4]">ข้อมูลสำคัญ</h3>
                    <p className="mt-3 leading-7 text-white/84">
                      กรุณาเตรียมเอกสารและข้อมูลของโรงเรียนให้พร้อมก่อนเริ่มกรอกแบบฟอร์ม
                      หากมีข้อสงสัยสามารถติดต่อสอบถามได้ที่หน้า{" "}
                      <Link href="/contract" className="text-[#f0d48d] underline transition-colors hover:text-[#f5da94]">
                        ติดต่อ
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
