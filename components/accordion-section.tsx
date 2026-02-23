"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Download, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const posterImages = [
  {
    src: "/images/poster-1.png",
    alt: "โปสเตอร์ประชาสัมพันธ์โครงการโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์",
    downloadUrl: "/downloads/poster-1.pdf",
  },
  {
    src: "/images/poster-2.png",
    alt: "โปสเตอร์ประชาสัมพันธ์โครงการ ภาพที่ 2",
    downloadUrl: "/downloads/poster-2.pdf",
  },
  {
    src: "/images/poster-3.png",
    alt: "โปสเตอร์ประชาสัมพันธ์โครงการ ภาพที่ 3",
    downloadUrl: "/downloads/poster-3.pdf",
  },
]

const faqItems = [
  {
    question: "คุณสมบัติของสถานศึกษาที่สมัครได้คืออะไร?",
    answer:
      "สถานศึกษาในสังกัดกระทรวงศึกษาธิการ ทุกระดับ ทุกสังกัด ที่มีการจัดกิจกรรมการเรียนการสอนดนตรีไทยเป็นประจำ และมีความพร้อมในการดำเนินกิจกรรมอย่างต่อเนื่อง",
  },
  {
    question: "ขั้นตอนการสมัครเข้าร่วมโครงการมีอย่างไร?",
    answer:
      "1. ลงทะเบียนผ่านระบบออนไลน์ 2. กรอกข้อมูลสถานศึกษาและแนบเอกสารประกอบ 3. ส่งผลงานดนตรีไทยที่ดำเนินกิจกรรม 4. รอผลการพิจารณาจากคณะกรรมการ",
  },
  {
    question: "ประเภทการสมัครมีกี่ประเภท?",
    answer:
      "มี 2 ประเภท คือ ประเภทโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์ สำหรับสถานศึกษาที่จัดกิจกรรมดนตรีไทยอย่างครบถ้วน และประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย สำหรับสถานศึกษาที่มีการสนับสนุนกิจกรรมดนตรีไทย",
  },
  {
    question: "กำหนดการรับสมัครและประกาศผลเมื่อไหร่?",
    answer:
      "เปิดรับสมัครตั้งแต่บัดนี้ถึงวันที่ 30 มิถุนายน 2569 ประกาศผลการคัดเลือกภายในเดือนสิงหาคม 2569 และมอบรางวัลในเดือนกันยายน 2569",
  },
  {
    question: "สิทธิประโยชน์ที่ได้รับจากการเข้าร่วมโครงการคืออะไร?",
    answer:
      "สถานศึกษาที่ได้รับการคัดเลือกจะได้รับประกาศนียบัตรเกียรติคุณ โล่รางวัล และทุนสนับสนุนการจัดกิจกรรมดนตรีไทย นอกจากนี้ยังได้รับการเผยแพร่ผลงานในระดับชาติ",
  },
   

]

const downloadItems = [
  {
    qrImage: "/images/qr.png",
    title: "QR Code แบบฟอร์มการสมัคร",
    description: "เข้าร่วมกิจกรรมโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์ ผ่านระบบออนไลน์",
    href: "/downloads/apply-form.pdf",
  },
  {
    qrImage: "/images/qr.png",
    title: "QR Code หลักเกณฑ์การสมัคร",
    description: "เข้าร่วมกิจกรรมโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์",
    href: "/downloads/criteria.pdf",
  },
  {
    qrImage: "/images/qr.png",
    title: "QR Code คู่มือสำหรับรับสมัคร",
    description: "เข้าร่วมกิจกรรมโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์",
    href: "/downloads/manual.pdf",
  },
]

export default function AccordionSection() {
  const [currentPosterIndex, setCurrentPosterIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const nextPoster = () => {
    setDirection(1)
    setCurrentPosterIndex((prev) => (prev + 1) % posterImages.length)
  }

  const prevPoster = () => {
    setDirection(-1)
    setCurrentPosterIndex((prev) => (prev - 1 + posterImages.length) % posterImages.length)
  }

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextPoster()
    }, 5000)

    return () => clearInterval(timer)
  }, [currentPosterIndex])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  return (
    <section id="download" className="relative py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#BE8C13] mb-4 text-balance">
            {"ข้อมูลและคำถามที่พบบ่อย"}
          </h2>
          <div className="mx-auto h-0.5 w-16 bg-gradient-to-r from-transparent via-[#BE8C13] to-transparent mb-4" />
          <p className="text-gray-600 leading-relaxed">
            {"ดาวน์โหลดเอกสารและข้อมูลสำคัญเกี่ยวกับโครงการ"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* LEFT: Poster */}
          <motion.div
            className="col-span-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="relative group">
              {/* Poster Image Container */}
              <div className="relative overflow-hidden border border-gray-200 shadow-sm bg-white aspect-[3/4]">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.img
                    key={currentPosterIndex}
                    src={posterImages[currentPosterIndex].src}
                    alt={posterImages[currentPosterIndex].alt}
                    className="absolute inset-0 w-full h-full object-cover"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "tween", ease: "easeInOut", duration: 0.5 },
                      opacity: { duration: 0.3 },
                    }}
                  />
                </AnimatePresence>
              </div>

              {/* Navigation Buttons */}
              {posterImages.length > 1 && (
                <>
                  <button
                    onClick={prevPoster}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-label="รูปก่อนหน้า"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextPoster}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-label="รูปถัดไป"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Download Button */}
              <a
                href={posterImages[currentPosterIndex].downloadUrl}
                download
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#BE8C13] hover:bg-[#0A3625] text-white rounded-xl transition-colors duration-300 font-semibold"
              >
                <Download className="w-5 h-5" />
                ดาวน์โหลดโปสเตอร์
              </a>
            </div>
          </motion.div>

          {/* MIDDLE: Download QR List */}
          <motion.div
            className="col-span-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#1a1a1a]">
                ข้อมูลสำหรับดาวน์โหลด
              </h3>

              {downloadItems.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:border-[#BE8C13]/30 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-20 h-20 bg-white rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center">
                      <img
                        src={item.qrImage}
                        alt={item.title}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[#1a1a1a] mb-1 group-hover:text-[#0A3625] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-[#BE8C13]/10 flex items-center justify-center group-hover:bg-[#BE8C13] transition-colors">
                        <Download className="w-5 h-5 text-[#BE8C13] group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: FAQ Accordion */}
          <motion.div
            className="col-span-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#1a1a1a]">
                คำถามที่พบบ่อย
              </h3>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, i) => (
                    <AccordionItem
                      key={i}
                      value={`item-${i}`}
                      className="border-b border-gray-200 last:border-0"
                    >
                      <AccordionTrigger className="text-left text-[#1a1a1a] hover:text-[#0A3625] transition-colors duration-300 text-sm py-4 [&[data-state=open]]:text-[#0A3625]">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-[#6b6b6b] text-sm leading-relaxed pb-4">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
