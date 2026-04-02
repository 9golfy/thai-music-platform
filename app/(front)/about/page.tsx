"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

import Footer from "@/components/footer"
import HeroMusicOverlay from "@/components/hero-music-overlay"
import Navbar from "@/components/navbar"

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const objectives = [
  "เพื่อสืบสาน รักษา ต่อยอดวิชาดนตรีไทยให้คงอยู่คู่สังคมไทย",
  "เพื่อขับเคลื่อนนโยบายกระทรวงวัฒนธรรม \"สืบสาน สร้างสรรค์ นำวัฒนธรรมไทย สู่อนาคตอย่างยั่งยืน\" สู่การปฏิบัติให้บังเกิดผลเป็นรูปธรรม",
  "เพื่อส่งเสริม สนับสนุน สืบสานและถ่ายทอดดนตรีไทยได้อย่างถูกต้อง และแก้ไขปัญหาพื้นฐาน สำหรับการเรียนการสอนดนตรีไทยในทุกพื้นที่ทั่วประเทศ อันจะนำไปสู่การสืบสาน ต่อยอด เพื่อการอนุรักษ์มรดก ทางวัฒนธรรมด้านดนตรีไทย",
]

const workScopes = [
  {
    title: "ประเภทโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์",
    description: "",
  },
  {
    title: "ประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย",
    description: "",
  },
]

const evaluationPart1 = [
  { title: "ด้านหลักสูตร", score: 20 },
  { title: "ด้านบุคลากร", score: 20 },
  { title: "งบประมาณและวัสดุอุปกรณ์", score: 20 },
  { title: "การได้รับรางวัลประเภทต่าง ๆ", score: 20 },
  { title: "การเผยแพร่และการแลกเปลี่ยนเรียนรู้ด้านดนตรีไทย", score: 20 },
]

const evaluationPart2 = [
  { 
    title: "สื่อผลงานกิจกรรม/คลิปวิดีโอ", 
    score: 50,
    description: "ที่มีความชัดเจน และสื่อให้เห็นถึงกิจกรรมการแสดงดนตรีไทยของนักเรียนทั้งโรงเรียน ขนาดความยาวไม่เกิน 3 นาที โดยพิจารณาจากบรรยากาศการเรียนการสอนในชั้นเรียน (ทุกระดับชั้น)"
  },
  { 
    title: "การแสดงผลงานด้านดนตรีไทยของนักเรียนทั้งโรงเรียน", 
    score: 50 
  },
]

const evaluationLevels = [
  { level: "ดีเด่น", minScore: 160 },
  { level: "ดีมาก", minScore: 140, maxScore: 159 },
  { level: "ดี", minScore: 120, maxScore: 139 },
  { level: "ชมเชย", minScore: 100, maxScore: 119 },
  { level: "ต่ำกว่าเกณฑ์", maxScore: 99 },
]

const supportEvaluationPart1 = [
  { title: "ด้านบุคลากร", score: 20 },
  { title: "งบประมาณและวัสดุอุปกรณ์", score: 20 },
  { title: "การได้รับรางวัลประเภทต่าง ๆ", score: 20 },
  { title: "การเผยแพร่และการแลกเปลี่ยนเรียนรู้ด้านดนตรีไทย", score: 20 },
]

const supportEvaluationPart2 = [
  { 
    title: "สื่อผลงานกิจกรรม/คลิปวิดีโอ", 
    score: 50,
    description: "ที่มีความชัดเจน และสื่อให้เห็นถึงกิจกรรมการแสดงดนตรีไทยของนักเรียน ขนาดความยาวไม่เกิน 3 นาที โดยพิจารณาจากบรรยากาศการเรียนการสอนในชั้นเรียน และในสถานศึกษา"
  },
  { 
    title: "การแสดงผลงานด้านดนตรีไทยของนักเรียน", 
    score: 50 
  },
]

const supportEvaluationLevels = [
  { level: "ดีเด่น", minScore: 144 },
  { level: "ดีมาก", minScore: 126, maxScore: 143 },
  { level: "ดี", minScore: 108, maxScore: 125 },
  { level: "ชมเชย", minScore: 90, maxScore: 107 },
  { level: "ต่ำกว่าเกณฑ์", maxScore: 89 },
]

const evaluationCriteria = [
  "ด้านหลักสูตร (การจัดการเรียนการสอนทั้งในและนอกเวลา)",
  "ด้านบุคลากร (ครูผู้สอนและผู้เชี่ยวชาญ)",
  "ด้านงบประมาณและอุปกรณ์",
  "ด้านผลงานและรางวัล",
  "ด้านการเผยแพร่และแลกเปลี่ยนเรียนรู้",
]

const expectedOutcomes = [
  "นักเรียนมีทักษะด้านดนตรีไทยและสามารถปฏิบัติได้จริง",
  "เกิดการสืบสานและอนุรักษ์ดนตรีไทยอย่างเป็นรูปธรรม",
  "สถานศึกษามีความเข้มแข็งด้านกิจกรรมวัฒนธรรม",
  "เกิดเครือข่ายความร่วมมือระหว่างโรงเรียน ชุมชน และหน่วยงานต่าง ๆ",
  "มีฐานข้อมูลและผลงานที่สามารถนำไปใช้ต่อยอดและเผยแพร่ในระดับประเทศ",
]

const sections = [
  {
    number: "1",
    eyebrow: "หลักการและเหตุผล",
    title: "สืบสานดนตรีไทยด้วยการเรียนรู้ที่เข้าถึงได้",
    tone: "dark" as const,
    content: [
      "ดนตรีไทยถือเป็นมรดกทางวัฒนธรรมที่มีคุณค่าและสะท้อนถึงอัตลักษณ์ของชาติไทยมาอย่างยาวนาน ทั้งในรูปแบบดนตรีไทยแบบแผน ดนตรีพื้นบ้าน ตลอดจนการขับร้องเพลงไทย ซึ่งล้วนมีบทบาทสำคัญในการหล่อหลอมจิตใจ สร้างสุนทรียภาพ และพัฒนาศักยภาพของเยาวชนไทยในด้านสติปัญญา อารมณ์ สังคมและคุณธรรมจริยธรรม",
      "กรมส่งเสริมวัฒนธรรม กระทรวงวัฒนธรรม ในฐานะหน่วยงานที่ทำหน้าที่ส่งเสริม รักษาวัฒนธรรมตลอดจนการเสริมสร้างการมีส่วนร่วมจากหน่วยงานต่าง ๆ ทั้งภาครัฐ ภาคเอกชน และประชาชนให้มีส่วนร่วม ในการขับเคลื่อนและร่วมกันธำรงรักษามรดกวัฒนธรรมที่ดีงาม ได้ดำเนินกิจกรรมโรงเรียนดนตรีไทย100 เปอร์เซ็นต์ ตั้งแต่ปีงบประมาณ พ.ศ. 2561 เป็นต้นมา ",
      "โดยมีสถานศึกษาทั่วประเทศทั้งภาครัฐ และเอกชนให้ความสนใจเข้าร่วมกิจกรรมเพิ่มขึ้นอย่างต่อเนื่อง โดยเริ่มแรกมีเครือข่ายนำร่องที่เข้าร่วมโครงการ 9 แห่ง และปัจจุบันมีสถานศึกษาเข้าร่วมกิจกรรม รวมทั้งสิ้น 1,276 แห่ง",
    ],
  },
  {
    number: "2",
    eyebrow: "วัตถุประสงค์ของกิจกรรม",
    title: "เป้าหมายหลักของการขับเคลื่อนกิจกรรม",
    tone: "light" as const,
    list: objectives,
  },
  {
    number: "3",
    eyebrow: "คุณสมบัติของผู้สมัคร",
    title: "การตรวจสอบก่อนสมัครเข้าร่วมกิจกรรม",
    tone: "dark" as const,
    intro: "สถานศึกษาสามารถสมัครเข้าร่วมเป็นโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์ ประจำปีงบประมาณ พ.ศ. 2569 ได้เพียงประเภทเดียวเท่านั้น โดยแบ่งเป็น 2 ประเภท ได้แก่",
    scopes: workScopes,
  },
  {
    number: "4",
    eyebrow: "รางวัลที่ได้รับ",
    title: "รางวัลเกียรติยศโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์",
    tone: "dark" as const,
    intro: "รางวัลเกียรติยศโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์ ประจำปีงบประมาณ พ.ศ. 2569",
  },
  {
    number: "5",
    eyebrow: "เกณฑ์การประเมินและตัวชี้วัด",
    title: "เกณฑ์การประเมินทั้ง 2 ประเภท",
    tone: "light" as const,
    isEvaluationBoth: true,
  },
  
]

function SectionCard({
  number,
  eyebrow,
  title,
  tone,
  content,
  intro,
  list,
  scopes,
  image,
  isEvaluation,
  evaluationType,
  isEvaluationBoth,
}: {
  number: string
  eyebrow: string
  title: string
  tone: "dark" | "light"
  content?: string[]
  intro?: string
  list?: string[]
  scopes?: { title: string; description: string }[]
  image?: string
  isEvaluation?: boolean
  evaluationType?: "100percent" | "support"
  isEvaluationBoth?: boolean
}) {
  const isDark = tone === "dark"
  
  // Select the appropriate evaluation data based on type
  const evalPart1 = evaluationType === "support" ? supportEvaluationPart1 : evaluationPart1
  const evalPart2 = evaluationType === "support" ? supportEvaluationPart2 : evaluationPart2
  const evalLevels = evaluationType === "support" ? supportEvaluationLevels : evaluationLevels
  const totalScore = evaluationType === "support" ? 180 : 200
  const part1Score = evaluationType === "support" ? 80 : 100
  const part2Score = evaluationType === "support" ? 100 : 100

  return (
    <motion.article
      variants={fadeUp}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`overflow-hidden rounded-[2rem] border p-7 shadow-[0_22px_60px_rgba(0,0,0,0.14)] sm:p-10 ${
        isDark
          ? "border-[#d2bb80]/18 bg-[linear-gradient(180deg,rgba(12,40,31,0.98),rgba(7,25,19,0.98))] text-white"
          : "border-[#ead9ae]/70 bg-[radial-gradient(circle_at_top,rgba(255,248,234,0.98),rgba(246,236,210,0.98)_70%,rgba(240,225,188,0.98)_100%)] text-[#173629] shadow-[0_26px_70px_rgba(0,0,0,0.12)]"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold ${
            isDark ? "bg-[#f0c969]/14 text-[#f5da94]" : "bg-[#0f6b44]/10 text-[#0f6b44]"
          }`}
        >
          {number}
        </div>
        <div className="min-w-0">
          <p className={`text-sm uppercase tracking-[0.28em] ${isDark ? "text-[#cfb26a]" : "text-[#8e6d24]"}`}>
            {eyebrow}
          </p>
          <h2 className={`mt-3 text-2xl font-semibold leading-tight sm:text-[2rem] ${isDark ? "text-[#fff1c4]" : ""}`}>
            {title}
          </h2>
        </div>
      </div>

      {image ? (
        <div className="relative mt-8 overflow-hidden rounded-[1.75rem] border border-[#e4cf9c]/70 bg-[linear-gradient(180deg,rgba(243,229,191,0.88),rgba(237,218,171,0.92))] p-3">
          <div className="relative h-[280px] sm:h-[420px]">
            <Image src={image} alt={title} fill className="object-contain object-center" />
          </div>
          <div className="pointer-events-none absolute inset-x-3 bottom-3 h-20 bg-gradient-to-t from-[#ead39b]/85 to-transparent" />
        </div>
      ) : null}

      {intro ? (
        <p className={`mt-8 text-base leading-8 ${isDark ? "text-white/82" : "text-[#28473b]/90"}`}>{intro}</p>
      ) : null}

      {content ? (
        <div className={`mt-8 space-y-5 text-base leading-8 ${isDark ? "text-white/82" : "text-[#28473b]/90"}`}>
          {content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      ) : null}

      {list ? (
        <div className="mt-8 grid gap-4">
          {list.map((item) => (
            <div
              key={item}
              className={`flex items-start gap-3 rounded-[1.35rem] p-4 ${
                isDark
                  ? "bg-white/[0.05] ring-1 ring-white/8"
                  : "bg-white/86 ring-1 ring-[#e8d6aa] shadow-[0_10px_25px_rgba(87,65,18,0.06)]"
              }`}
            >
              <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${isDark ? "text-[#f0d48d]" : "text-[#0f6b44]"}`} />
              <p className="leading-7">{item}</p>
            </div>
          ))}
        </div>
      ) : null}

      {scopes ? (
        <div className="mt-8 grid gap-4">
          {scopes.map((item, index) => (
            <div key={item.title} className="rounded-[1.5rem] bg-white/[0.05] p-5 ring-1 ring-white/8">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f0c969]/14 text-sm font-semibold text-[#f0d48d]">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 leading-7 text-white/72">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {isEvaluationBoth ? (
        <div className="mt-8 space-y-10">
          {/* 5.1 ประเภทโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์ */}
          <div className={`rounded-[2rem] border p-6 ${
            isDark ? "border-[#f0c969]/20 bg-white/[0.03]" : "border-[#0f6b44]/20 bg-white/50"
          }`}>
            <div className="mb-6 flex items-center gap-3">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold ${
                isDark ? "bg-[#f0c969]/14 text-[#f0d48d]" : "bg-[#0f6b44]/10 text-[#0f6b44]"
              }`}>
                5.1
              </div>
              <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-[#173629]"}`}>
                ประเภทโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์
              </h3>
            </div>

            <div className="space-y-6">
              {/* ส่วนที่ 1 */}
              <div className={`rounded-[1.5rem] p-5 ${
                isDark ? "bg-white/[0.05] ring-1 ring-white/8" : "bg-white/86 ring-1 ring-[#e8d6aa] shadow-[0_10px_25px_rgba(87,65,18,0.06)]"
              }`}>
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                    isDark ? "bg-[#f0c969]/14 text-[#f0d48d]" : "bg-[#0f6b44]/10 text-[#0f6b44]"
                  }`}>
                    1
                  </div>
                  <h4 className={`text-lg font-semibold ${isDark ? "text-white" : "text-[#173629]"}`}>
                    ส่วนที่ 1
                  </h4>
                </div>
                <div className="space-y-2">
                  {evaluationPart1.map((item, index) => (
                    <div key={index} className={`flex items-center justify-between rounded-lg p-3 ${
                      isDark ? "bg-white/[0.03]" : "bg-white/60"
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${isDark ? "text-white/60" : "text-[#173629]/60"}`}>
                          {index + 1}.
                        </span>
                        <span className={`text-sm ${isDark ? "text-white/90" : "text-[#173629]"}`}>
                          {item.title}
                        </span>
                      </div>
                      <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                        isDark ? "bg-[#f0c969]/14 text-[#f0d48d]" : "bg-[#0f6b44]/10 text-[#0f6b44]"
                      }`}>
                        {item.score} คะแนน
                      </span>
                    </div>
                  ))}
                  <div className={`mt-3 rounded-lg p-3 text-center ${
                    isDark ? "bg-[#f0c969]/8" : "bg-[#0f6b44]/8"
                  }`}>
                    <span className={`text-base font-bold ${isDark ? "text-[#f0d48d]" : "text-[#0f6b44]"}`}>
                      รวม 100 คะแนน
                    </span>
                  </div>
                </div>
              </div>

              {/* ส่วนที่ 2 */}
              <div className={`rounded-[1.5rem] p-5 ${
                isDark ? "bg-white/[0.05] ring-1 ring-white/8" : "bg-white/86 ring-1 ring-[#e8d6aa] shadow-[0_10px_25px_rgba(87,65,18,0.06)]"
              }`}>
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                    isDark ? "bg-[#f0c969]/14 text-[#f0d48d]" : "bg-[#0f6b44]/10 text-[#0f6b44]"
                  }`}>
                    2
                  </div>
                  <h4 className={`text-lg font-semibold ${isDark ? "text-white" : "text-[#173629]"}`}>
                    ส่วนที่ 2
                  </h4>
                </div>
                <div className="space-y-2">
                  {evaluationPart2.map((item, index) => (
                    <div key={index} className={`rounded-lg p-3 ${
                      isDark ? "bg-white/[0.03]" : "bg-white/60"
                    }`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${isDark ? "text-white/60" : "text-[#173629]/60"}`}>
                              {index + 1}.
                            </span>
                            <span className={`text-sm font-medium ${isDark ? "text-white/90" : "text-[#173629]"}`}>
                              {item.title}
                            </span>
                          </div>
                          {item.description && (
                            <p className={`mt-1.5 ml-6 text-xs leading-5 ${isDark ? "text-white/70" : "text-[#173629]/70"}`}>
                              {item.description}
                            </p>
                          )}
                        </div>
                        <span className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          isDark ? "bg-[#f0c969]/14 text-[#f0d48d]" : "bg-[#0f6b44]/10 text-[#0f6b44]"
                        }`}>
                          {item.score} คะแนน
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className={`mt-3 rounded-lg p-3 text-center ${
                    isDark ? "bg-[#f0c969]/8" : "bg-[#0f6b44]/8"
                  }`}>
                    <span className={`text-base font-bold ${isDark ? "text-[#f0d48d]" : "text-[#0f6b44]"}`}>
                      รวม 100 คะแนน
                    </span>
                  </div>
                </div>
              </div>
                            {/* หมายเหตุ การประเมินผล */}
              <div className={`rounded-[1.5rem] p-5 ${
                isDark ? "bg-white/[0.05] ring-1 ring-white/8" : "bg-white/86 ring-1 ring-[#e8d6aa] shadow-[0_10px_25px_rgba(87,65,18,0.06)]"
              }`}>
                <h5 className={`mb-3 text-base font-semibold ${isDark ? "text-white" : "text-[#173629]"}`}>
                  หมายเหตุ การประเมินผลการคัดเลือกตามระดับคะแนน
                </h5>
                <div className="space-y-1.5">
                  {evaluationLevels.map((level, index) => (
                    <div key={index} className={`flex items-center justify-between rounded-lg p-2.5 ${
                      isDark ? "bg-white/[0.03]" : "bg-white/60"
                    }`}>
                      <span className={`text-sm font-medium ${isDark ? "text-white/90" : "text-[#173629]"}`}>
                        {level.level}
                      </span>
                      <span className={`text-xs ${isDark ? "text-white/70" : "text-[#173629]/70"}`}>
                        {level.minScore && level.maxScore 
                          ? `คะแนน ${level.minScore} - ${level.maxScore}`
                          : level.minScore 
                          ? `คะแนน ${level.minScore} ขึ้นไป`
                          : `คะแนนต่ำกว่า ${(level.maxScore || 0) + 1}`
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* รวม 2 ส่วน */}
              <div className={`rounded-[1.5rem] p-4 text-center ${
                isDark ? "bg-gradient-to-br from-[#f0c969]/12 to-[#f0c969]/6 ring-1 ring-[#f0c969]/20" : "bg-gradient-to-br from-[#0f6b44]/12 to-[#0f6b44]/6 ring-1 ring-[#0f6b44]/20"
              }`}>
                <p className={`text-sm font-medium ${isDark ? "text-white/70" : "text-[#173629]/70"}`}>
                  
                  ประเภทโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์รวม 2 ส่วน
                </p>
                <p className={`mt-1 text-2xl font-bold ${isDark ? "text-[#f0d48d]" : "text-[#0f6b44]"}`}>
                  200 คะแนน
                </p>
              </div>


            </div>
          </div>

          {/* 5.2 ประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย */}
          <div className={`rounded-[2rem] border p-6 ${
            isDark ? "border-[#f0c969]/20 bg-white/[0.03]" : "border-[#0f6b44]/20 bg-white/50"
          }`}>
            <div className="mb-6 flex items-center gap-3">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold ${
                isDark ? "bg-[#f0c969]/14 text-[#f0d48d]" : "bg-[#0f6b44]/10 text-[#0f6b44]"
              }`}>
                5.2
              </div>
              <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-[#173629]"}`}>
                ประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย
              </h3>
            </div>

            <div className="space-y-6">
              {/* ส่วนที่ 1 */}
              <div className={`rounded-[1.5rem] p-5 ${
                isDark ? "bg-white/[0.05] ring-1 ring-white/8" : "bg-white/86 ring-1 ring-[#e8d6aa] shadow-[0_10px_25px_rgba(87,65,18,0.06)]"
              }`}>
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                    isDark ? "bg-[#f0c969]/14 text-[#f0d48d]" : "bg-[#0f6b44]/10 text-[#0f6b44]"
                  }`}>
                    1
                  </div>
                  <h4 className={`text-lg font-semibold ${isDark ? "text-white" : "text-[#173629]"}`}>
                    ส่วนที่ 1
                  </h4>
                </div>
                <div className="space-y-2">
                  {supportEvaluationPart1.map((item, index) => (
                    <div key={index} className={`flex items-center justify-between rounded-lg p-3 ${
                      isDark ? "bg-white/[0.03]" : "bg-white/60"
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${isDark ? "text-white/60" : "text-[#173629]/60"}`}>
                          {index + 1}.
                        </span>
                        <span className={`text-sm ${isDark ? "text-white/90" : "text-[#173629]"}`}>
                          {item.title}
                        </span>
                      </div>
                      <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                        isDark ? "bg-[#f0c969]/14 text-[#f0d48d]" : "bg-[#0f6b44]/10 text-[#0f6b44]"
                      }`}>
                        {item.score} คะแนน
                      </span>
                    </div>
                  ))}
                  <div className={`mt-3 rounded-lg p-3 text-center ${
                    isDark ? "bg-[#f0c969]/8" : "bg-[#0f6b44]/8"
                  }`}>
                    <span className={`text-base font-bold ${isDark ? "text-[#f0d48d]" : "text-[#0f6b44]"}`}>
                      รวม 80 คะแนน
                    </span>
                  </div>
                </div>
              </div>

              {/* ส่วนที่ 2 */}
              <div className={`rounded-[1.5rem] p-5 ${
                isDark ? "bg-white/[0.05] ring-1 ring-white/8" : "bg-white/86 ring-1 ring-[#e8d6aa] shadow-[0_10px_25px_rgba(87,65,18,0.06)]"
              }`}>
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                    isDark ? "bg-[#f0c969]/14 text-[#f0d48d]" : "bg-[#0f6b44]/10 text-[#0f6b44]"
                  }`}>
                    2
                  </div>
                  <h4 className={`text-lg font-semibold ${isDark ? "text-white" : "text-[#173629]"}`}>
                    ส่วนที่ 2
                  </h4>
                </div>
                <div className="space-y-2">
                  {supportEvaluationPart2.map((item, index) => (
                    <div key={index} className={`rounded-lg p-3 ${
                      isDark ? "bg-white/[0.03]" : "bg-white/60"
                    }`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${isDark ? "text-white/60" : "text-[#173629]/60"}`}>
                              {index + 1}.
                            </span>
                            <span className={`text-sm font-medium ${isDark ? "text-white/90" : "text-[#173629]"}`}>
                              {item.title}
                            </span>
                          </div>
                          {item.description && (
                            <p className={`mt-1.5 ml-6 text-xs leading-5 ${isDark ? "text-white/70" : "text-[#173629]/70"}`}>
                              {item.description}
                            </p>
                          )}
                        </div>
                        <span className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          isDark ? "bg-[#f0c969]/14 text-[#f0d48d]" : "bg-[#0f6b44]/10 text-[#0f6b44]"
                        }`}>
                          {item.score} คะแนน
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className={`mt-3 rounded-lg p-3 text-center ${
                    isDark ? "bg-[#f0c969]/8" : "bg-[#0f6b44]/8"
                  }`}>
                    <span className={`text-base font-bold ${isDark ? "text-[#f0d48d]" : "text-[#0f6b44]"}`}>
                      รวม 100 คะแนน
                    </span>
                  </div>
                </div>
              </div>


              {/* หมายเหตุ การประเมินผล */}
              <div className={`rounded-[1.5rem] p-5 ${
                isDark ? "bg-white/[0.05] ring-1 ring-white/8" : "bg-white/86 ring-1 ring-[#e8d6aa] shadow-[0_10px_25px_rgba(87,65,18,0.06)]"
              }`}>
                <h5 className={`mb-3 text-base font-semibold ${isDark ? "text-white" : "text-[#173629]"}`}>
                  หมายเหตุ การประเมินผลการคัดเลือกตามระดับคะแนน
                </h5>
                <div className="space-y-1.5">
                  {supportEvaluationLevels.map((level, index) => (
                    <div key={index} className={`flex items-center justify-between rounded-lg p-2.5 ${
                      isDark ? "bg-white/[0.03]" : "bg-white/60"
                    }`}>
                      <span className={`text-sm font-medium ${isDark ? "text-white/90" : "text-[#173629]"}`}>
                        {level.level}
                      </span>
                      <span className={`text-xs ${isDark ? "text-white/70" : "text-[#173629]/70"}`}>
                        {level.minScore && level.maxScore 
                          ? `คะแนน ${level.minScore} - ${level.maxScore}`
                          : level.minScore 
                          ? `คะแนน ${level.minScore} ขึ้นไป`
                          : `คะแนนต่ำกว่า ${(level.maxScore || 0) + 1}`
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* รวม 2 ส่วน */}
              <div className={`rounded-[1.5rem] p-4 text-center ${
                isDark ? "bg-gradient-to-br from-[#f0c969]/12 to-[#f0c969]/6 ring-1 ring-[#f0c969]/20" : "bg-gradient-to-br from-[#0f6b44]/12 to-[#0f6b44]/6 ring-1 ring-[#0f6b44]/20"
              }`}>
                <p className={`text-sm font-medium ${isDark ? "text-white/70" : "text-[#173629]/70"}`}>
                  ประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย รวม 2 ส่วน
                </p>
                <p className={`mt-1 text-2xl font-bold ${isDark ? "text-[#f0d48d]" : "text-[#0f6b44]"}`}>
                  180 คะแนน
                </p>
              </div>

            </div>
          </div>
        </div>
      ) : null}

      {isEvaluation ? (
        <div className="mt-8 space-y-8">
          {/* ส่วนที่ 1 */}
          <div className={`rounded-[1.75rem] p-6 ${
            isDark ? "bg-white/[0.05] ring-1 ring-white/8" : "bg-white/86 ring-1 ring-[#e8d6aa] shadow-[0_10px_25px_rgba(87,65,18,0.06)]"
          }`}>
            <div className="mb-5 flex items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-bold ${
                isDark ? "bg-[#f0c969]/14 text-[#f0d48d]" : "bg-[#0f6b44]/10 text-[#0f6b44]"
              }`}>
                1
              </div>
              <h3 className={`text-xl font-semibold ${isDark ? "text-white" : "text-[#173629]"}`}>
                ส่วนที่ 1
              </h3>
            </div>
            <div className="space-y-3">
              {evalPart1.map((item, index) => (
                <div key={index} className={`flex items-center justify-between rounded-xl p-4 ${
                  isDark ? "bg-white/[0.03]" : "bg-white/60"
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${isDark ? "text-white/60" : "text-[#173629]/60"}`}>
                      {index + 1}.
                    </span>
                    <span className={`${isDark ? "text-white/90" : "text-[#173629]"}`}>
                      {item.title}
                    </span>
                  </div>
                  <span className={`rounded-lg px-3 py-1 text-sm font-semibold ${
                    isDark ? "bg-[#f0c969]/14 text-[#f0d48d]" : "bg-[#0f6b44]/10 text-[#0f6b44]"
                  }`}>
                    {item.score} คะแนน
                  </span>
                </div>
              ))}
              <div className={`mt-4 rounded-xl p-4 text-center ${
                isDark ? "bg-[#f0c969]/8" : "bg-[#0f6b44]/8"
              }`}>
                <span className={`text-lg font-bold ${isDark ? "text-[#f0d48d]" : "text-[#0f6b44]"}`}>
                  รวม {part1Score} คะแนน
                </span>
              </div>
            </div>
          </div>

          {/* ส่วนที่ 2 */}
          <div className={`rounded-[1.75rem] p-6 ${
            isDark ? "bg-white/[0.05] ring-1 ring-white/8" : "bg-white/86 ring-1 ring-[#e8d6aa] shadow-[0_10px_25px_rgba(87,65,18,0.06)]"
          }`}>
            <div className="mb-5 flex items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-bold ${
                isDark ? "bg-[#f0c969]/14 text-[#f0d48d]" : "bg-[#0f6b44]/10 text-[#0f6b44]"
              }`}>
                2
              </div>
              <h3 className={`text-xl font-semibold ${isDark ? "text-white" : "text-[#173629]"}`}>
                ส่วนที่ 2
              </h3>
            </div>
            <div className="space-y-3">
              {evalPart2.map((item, index) => (
                <div key={index} className={`rounded-xl p-4 ${
                  isDark ? "bg-white/[0.03]" : "bg-white/60"
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${isDark ? "text-white/60" : "text-[#173629]/60"}`}>
                          {index + 1}.
                        </span>
                        <span className={`font-medium ${isDark ? "text-white/90" : "text-[#173629]"}`}>
                          {item.title}
                        </span>
                      </div>
                      {item.description && (
                        <p className={`mt-2 ml-7 text-sm leading-6 ${isDark ? "text-white/70" : "text-[#173629]/70"}`}>
                          {item.description}
                        </p>
                      )}
                    </div>
                    <span className={`shrink-0 rounded-lg px-3 py-1 text-sm font-semibold ${
                      isDark ? "bg-[#f0c969]/14 text-[#f0d48d]" : "bg-[#0f6b44]/10 text-[#0f6b44]"
                    }`}>
                      {item.score} คะแนน
                    </span>
                  </div>
                </div>
              ))}
              <div className={`mt-4 rounded-xl p-4 text-center ${
                isDark ? "bg-[#f0c969]/8" : "bg-[#0f6b44]/8"
              }`}>
                <span className={`text-lg font-bold ${isDark ? "text-[#f0d48d]" : "text-[#0f6b44]"}`}>
                  รวม {part2Score} คะแนน
                </span>
              </div>
            </div>
          </div>

          {/* รวม 2 ส่วน */}
          <div className={`rounded-[1.75rem] p-6 text-center ${
            isDark ? "bg-gradient-to-br from-[#f0c969]/12 to-[#f0c969]/6 ring-1 ring-[#f0c969]/20" : "bg-gradient-to-br from-[#0f6b44]/12 to-[#0f6b44]/6 ring-1 ring-[#0f6b44]/20"
          }`}>
            <p className={`text-sm font-medium ${isDark ? "text-white/70" : "text-[#173629]/70"}`}>
              ประเภทโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์ รวม 2 ส่วน
            </p>
            <p className={`mt-2 text-3xl font-bold ${isDark ? "text-[#f0d48d]" : "text-[#0f6b44]"}`}>
              {totalScore} คะแนน
            </p>
          </div>

          {/* หมายเหตุ การประเมินผล */}
          <div className={`rounded-[1.75rem] p-6 ${
            isDark ? "bg-white/[0.05] ring-1 ring-white/8" : "bg-white/86 ring-1 ring-[#e8d6aa] shadow-[0_10px_25px_rgba(87,65,18,0.06)]"
          }`}>
            <h4 className={`mb-4 text-lg font-semibold ${isDark ? "text-white" : "text-[#173629]"}`}>
              หมายเหตุ การประเมินผลการคัดเลือกตามระดับคะแนน
            </h4>
            <div className="space-y-2">
              {evalLevels.map((level, index) => (
                <div key={index} className={`flex items-center justify-between rounded-lg p-3 ${
                  isDark ? "bg-white/[0.03]" : "bg-white/60"
                }`}>
                  <span className={`font-medium ${isDark ? "text-white/90" : "text-[#173629]"}`}>
                    {level.level}
                  </span>
                  <span className={`text-sm ${isDark ? "text-white/70" : "text-[#173629]/70"}`}>
                    {level.minScore && level.maxScore 
                      ? `คะแนน ${level.minScore} - ${level.maxScore}`
                      : level.minScore 
                      ? `คะแนน ${level.minScore} ขึ้นไป`
                      : `คะแนนต่ำกว่า ${(level.maxScore || 0) + 1}`
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </motion.article>
  )
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-[#071d15] pt-16 text-[#f7f0df]">
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

          <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.96fr_1.04fr] lg:px-8 lg:py-20">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-3xl"
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="inline-flex rounded-full border border-[#f0d48d]/30 bg-[#f0d48d]/10 px-4 py-2 text-sm tracking-[0.22em] text-[#f3dd9f]"
              >
                ข้อมูลกิจกรรม
              </motion.span>

              <motion.h1
                className="cinematic-gold-title mt-6 text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-[4rem]"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                กิจกรรมโรงเรียนดนตรีไทย
                <br />
                100 เปอร์เซ็นต์
              </motion.h1>

              <motion.p
                className="mt-6 max-w-2xl text-lg leading-8 text-white/86 sm:text-xl"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.8 }}
              >
                กลไกสำคัญในการสืบสาน อนุรักษ์ และต่อยอดมรดกทางวัฒนธรรมไทย ผ่านระบบการศึกษาที่เปิดโอกาสให้เด็กและเยาวชนได้เรียนรู้ดนตรีไทยอย่างเข้าถึงง่าย
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 48, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.3, duration: 0.95, ease: "easeOut" }}
              className="relative mx-auto w-full max-w-[46rem]"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative overflow-hidden rounded-[2rem] border border-[#f5db95]/25 bg-[linear-gradient(180deg,rgba(19,60,44,0.9),rgba(8,25,19,0.96))] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
              >
                <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-black/20">
                  <Image
                    src="/images/info-img.png"
                    alt="นักเรียนกำลังบรรเลงดนตรีไทย"
                    width={1400}
                    height={900}
                    className="h-full w-full object-cover"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            className="mx-auto max-w-5xl space-y-8"
          >
            {sections.map((section) => (
              <SectionCard key={section.number} {...section} />
            ))}
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  )
}
