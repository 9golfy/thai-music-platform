"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { CheckCircle2, Globe2, GraduationCap, ShieldCheck, Trophy } from "lucide-react"

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

const highlights = [
  {
    icon: GraduationCap,
    title: "เรียนได้จริง",
    description: "มุ่งให้นักเรียนทุกคนสามารถปฏิบัติดนตรีไทยได้อย่างน้อย ๑ ชนิด",
  },
  {
    icon: Globe2,
    title: "ขยายผลทั่วประเทศ",
    description: "ครอบคลุมสถานศึกษาทั้งภาครัฐและเอกชน พร้อมเครือข่ายการเรียนรู้ร่วมกัน",
  },
  {
    icon: ShieldCheck,
    title: "โปร่งใสตรวจสอบได้",
    description: "ใช้ระบบดิจิทัลในการรับสมัคร ประเมินผล และประกาศผลอย่างเป็นระบบ",
  },
  {
    icon: Trophy,
    title: "ต่อยอดเชิงคุณภาพ",
    description: "สร้างฐานข้อมูล ผลงาน และต้นแบบที่นำไปพัฒนาโครงการระยะยาวได้",
  },
]

const objectives = [
  "เพื่อส่งเสริมและสนับสนุนการเรียนการสอนดนตรีไทยในสถานศึกษาให้ครอบคลุมเด็กนักเรียนทุกคน",
  "เพื่อสืบสาน อนุรักษ์ และต่อยอดมรดกทางวัฒนธรรมด้านดนตรีไทยให้คงอยู่คู่สังคมไทย",
  "เพื่อสร้างเครือข่ายสถานศึกษาที่มีความเข้มแข็งด้านดนตรีไทย ทั้งในระดับท้องถิ่นและระดับประเทศ",
  "เพื่อเผยแพร่และประชาสัมพันธ์องค์ความรู้ด้านดนตรีไทยผ่านกิจกรรมและสื่อออนไลน์ให้เข้าถึงสาธารณชนอย่างกว้างขวาง",
  "เพื่อพัฒนาระบบการรับสมัคร คัดเลือก และประเมินผลให้มีความโปร่งใส ตรวจสอบได้ และมีประสิทธิภาพ",
]

const workScopes = [
  {
    title: "การประชาสัมพันธ์โครงการ",
    description:
      "ดำเนินการจัดทำแผนประชาสัมพันธ์อย่างเป็นระบบ ครอบคลุมกลุ่มเป้าหมายทั่วประเทศ พร้อมทั้งจัดทำสื่อประชาสัมพันธ์ เช่น โปสเตอร์ อินโฟกราฟิก และสื่อดิจิทัล เพื่อสร้างการรับรู้และกระตุ้นให้สถานศึกษาเข้าร่วมโครงการ",
  },
  {
    title: "การรับสมัครสถานศึกษา",
    description:
      "พัฒนาระบบรับสมัครในรูปแบบออนไลน์ รองรับการบันทึกข้อมูล ข้อความ ภาพ และลิงก์ โดยสามารถใช้งานได้บนทุกแพลตฟอร์ม และรองรับจำนวนผู้ใช้งานจำนวนมากได้อย่างมีประสิทธิภาพ",
  },
  {
    title: "การประเมินและคัดเลือก",
    description:
      "ดำเนินการประเมินผลตามหลักเกณฑ์ที่กำหนด โดยแบ่งเป็นการประเมินข้อมูลเอกสาร และการประเมินสื่อผลงานและคลิปวิดีโอ พร้อมทั้งสามารถคำนวณคะแนนรวม และจัดระดับผลการคัดเลือกได้อย่างเป็นระบบ",
  },
  {
    title: "การประกาศผลและเผยแพร่",
    description:
      "ประกาศผลการคัดเลือกผ่านช่องทางออนไลน์ พร้อมจัดทำใบประกาศเกียรติคุณให้สถานศึกษาที่ผ่านการคัดเลือก และสามารถดาวน์โหลดได้ด้วยตนเอง",
  },
  {
    title: "การสรุปผลและจัดทำรายงาน",
    description:
      "รวบรวม วิเคราะห์ และจัดทำรายงานผลการดำเนินโครงการทั้งในรูปแบบเอกสารและดิจิทัล เพื่อใช้เป็นฐานข้อมูลในการพัฒนาโครงการในอนาคต",
  },
]

const schoolGuidelines = [
  "มีหลักสูตรหรือกิจกรรมที่ส่งเสริมการเรียนดนตรีไทย",
  "มีครูผู้สอนหรือวิทยากรที่มีความรู้ความสามารถ",
  "มีเครื่องดนตรีและอุปกรณ์เพียงพอ",
  "มีการจัดกิจกรรมแสดงผลงานและเผยแพร่",
  "มีการสนับสนุนจากหน่วยงานและชุมชน",
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
    number: "๑",
    eyebrow: "หลักการและเหตุผล",
    title: "สืบสานดนตรีไทยด้วยการเรียนรู้ที่เข้าถึงได้",
    tone: "dark" as const,
    content: [
      "ดนตรีไทยถือเป็นมรดกทางวัฒนธรรมที่มีคุณค่าและสะท้อนถึงอัตลักษณ์ของชาติไทยมาอย่างยาวนาน ทั้งในรูปแบบดนตรีไทยแบบแผน ดนตรีพื้นบ้าน ตลอดจนการขับร้องเพลงไทย ซึ่งล้วนมีบทบาทสำคัญในการหล่อหลอมจิตใจ สร้างสุนทรียภาพ และพัฒนาศักยภาพของเยาวชนไทยในด้านสติปัญญา อารมณ์ สังคม และคุณธรรมจริยธรรม",
      "กรมส่งเสริมวัฒนธรรม กระทรวงวัฒนธรรม จึงได้ดำเนิน “กิจกรรมโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์” อย่างต่อเนื่อง เพื่อส่งเสริมให้เด็กและเยาวชนไทยทุกคนสามารถเล่นดนตรีไทยได้อย่างน้อยคนละ ๑ ชนิด อันเป็นการสร้างรากฐานในการอนุรักษ์ สืบสาน และต่อยอดองค์ความรู้ด้านดนตรีไทยให้คงอยู่คู่สังคมไทยอย่างยั่งยืน",
      "จากการดำเนินโครงการที่ผ่านมา พบว่าสถานศึกษาทั่วประเทศทั้งภาครัฐและเอกชนให้ความสนใจเข้าร่วมเพิ่มขึ้นอย่างต่อเนื่อง สะท้อนให้เห็นถึงความตระหนักถึงความสำคัญของดนตรีไทยในระบบการศึกษา รวมถึงบทบาทของดนตรีไทยในการพัฒนาผู้เรียนอย่างรอบด้าน ทั้งด้านความคิดสร้างสรรค์ ความมีวินัย และความภาคภูมิใจในวัฒนธรรมของตนเอง",
      "ดังนั้น การดำเนินโครงการในปีงบประมาณ พ.ศ. ๒๕๖๙ จึงมุ่งเน้นการขยายผลให้ครอบคลุมสถานศึกษาทั่วประเทศ เพิ่มประสิทธิภาพการบริหารจัดการข้อมูล การคัดเลือก และการเผยแพร่ผลงานในรูปแบบดิจิทัล เพื่อให้เข้าถึงได้ง่าย โปร่งใส และสามารถต่อยอดในอนาคตได้อย่างมีประสิทธิภาพ",
    ],
  },
  {
    number: "๒",
    eyebrow: "วัตถุประสงค์ของโครงการ",
    title: "เป้าหมายหลักของการขับเคลื่อนโครงการ",
    tone: "light" as const,
    list: objectives,
  },
  {
    number: "๓",
    eyebrow: "ลักษณะและขอบเขตของโครงการ",
    title: "โครงการที่ทำงานครบทั้งการส่งเสริม คัดเลือก และเผยแพร่",
    tone: "dark" as const,
    intro:
      "โครงการนี้เป็นการดำเนินงานในลักษณะของการส่งเสริม สนับสนุน และคัดเลือกสถานศึกษาที่มีความพร้อมในการจัดการเรียนการสอนดนตรีไทย โดยแบ่งออกเป็น ๒ ประเภท ได้แก่ ประเภทโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์ และประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย",
    scopes: workScopes,
  },
  {
    number: "๔",
    eyebrow: "แนวทางการดำเนินงานของสถานศึกษา",
    title: "องค์ประกอบสำคัญที่สถานศึกษาควรมี",
    tone: "light" as const,
    intro:
      "สถานศึกษาที่เข้าร่วมโครงการจะต้องมีการดำเนินงานด้านการเรียนการสอนดนตรีไทยอย่างเป็นระบบ ครอบคลุมทั้งในและนอกเวลาเรียน โดยมุ่งเน้นให้นักเรียนทุกคนสามารถปฏิบัติดนตรีไทยได้อย่างน้อย ๑ ชนิด รวมถึงมีองค์ประกอบสำคัญดังต่อไปนี้",
    list: schoolGuidelines,
  },
  {
    number: "๕",
    eyebrow: "หลักเกณฑ์การประเมินผล",
    title: "ประเมินรอบด้านด้วยเกณฑ์ที่ชัดเจน",
    tone: "dark" as const,
    intro:
      "การประเมินผลจะพิจารณาจากองค์ประกอบหลักที่สะท้อนความพร้อมและคุณภาพของสถานศึกษาอย่างครบถ้วน โดยมีการกำหนดคะแนนรวม ๑๐๐ คะแนน และแบ่งระดับผลการประเมินเป็นระดับต่าง ๆ เช่น ดีเด่น ดีมาก ดี และชมเชย",
    list: evaluationCriteria,
  },
  {
    number: "๖",
    eyebrow: "ผลที่คาดว่าจะได้รับ",
    title: "ผลลัพธ์ที่ต่อยอดได้จริงในระดับผู้เรียนและสถานศึกษา",
    tone: "light" as const,
    list: expectedOutcomes,
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
}) {
  const isDark = tone === "dark"

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
                ข้อมูลโครงการ
              </motion.span>

              <motion.h1
                className="cinematic-gold-title mt-6 text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-[4rem]"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                โครงการโรงเรียนดนตรีไทย
                <br />
                ๑๐๐ เปอร์เซ็นต์
              </motion.h1>

              <motion.p
                className="mt-6 max-w-2xl text-lg leading-8 text-white/86 sm:text-xl"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.8 }}
              >
                กลไกสำคัญในการสืบสาน อนุรักษ์ และต่อยอดมรดกทางวัฒนธรรมไทย ผ่านระบบการศึกษาที่เปิดโอกาสให้เด็กและเยาวชนได้เรียนรู้ดนตรีไทยอย่างเข้าถึงง่าย และนำไปปฏิบัติได้จริง
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

        <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
          >
            {highlights.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                transition={{ duration: 0.65, ease: "easeOut" }}
                className="group rounded-[1.75rem] border border-[#d2bb80]/20 bg-[linear-gradient(180deg,rgba(17,53,40,0.92),rgba(9,28,21,0.98))] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.2)] transition-transform duration-500 hover:-translate-y-1"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0c969]/15 text-[#f0d48d] transition-transform duration-500 group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold text-[#fff1c4]">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/75">{description}</p>
              </motion.div>
            ))}
          </motion.div>
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

            <motion.article
              variants={fadeUp}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className="rounded-[2rem] border border-[#d2bb80]/18 bg-[linear-gradient(135deg,rgba(209,169,76,0.16),rgba(10,35,26,0.98))] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:p-10"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f0c969]/14 text-lg font-semibold text-[#f5da94]">
                  ๗
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-[#cfb26a]">สรุปภาพรวมโครงการ</p>
                  <h2 className="mt-3 text-2xl font-semibold leading-tight text-[#fff1c4] sm:text-[2rem]">
                    โครงการที่เชื่อมผู้เรียน ครู ชุมชน และวัฒนธรรมไทยเข้าหากัน
                  </h2>
                </div>
              </div>

              <div className="mt-8 space-y-5 text-base leading-8 text-white/84">
                <p>
                  โครงการโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์ เป็นกลไกสำคัญในการขับเคลื่อนการอนุรักษ์และพัฒนาดนตรีไทยผ่านระบบการศึกษา โดยเน้นการมีส่วนร่วมของทุกภาคส่วน ทั้งสถานศึกษา ครู ผู้เรียน ชุมชน และหน่วยงานที่เกี่ยวข้อง
                </p>
                <p>
                  เป้าหมายสำคัญคือการสร้างความยั่งยืนให้กับมรดกทางวัฒนธรรมของชาติ พร้อมยกระดับคุณภาพการเรียนรู้ของเยาวชนไทยในอนาคต ผ่านระบบที่ทันสมัย โปร่งใส และสามารถต่อยอดได้จริงในระดับประเทศ
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-[#f3d37d]/28 bg-[#f3d37d]/10 px-4 py-2 text-sm text-[#f6dfa0]">
                  วัฒนธรรมไทย
                </span>
                <span className="rounded-full border border-[#f3d37d]/28 bg-[#f3d37d]/10 px-4 py-2 text-sm text-[#f6dfa0]">
                  การศึกษา
                </span>
                <span className="rounded-full border border-[#f3d37d]/28 bg-[#f3d37d]/10 px-4 py-2 text-sm text-[#f6dfa0]">
                  ระบบดิจิทัล
                </span>
                <span className="rounded-full border border-[#f3d37d]/28 bg-[#f3d37d]/10 px-4 py-2 text-sm text-[#f6dfa0]">
                  เครือข่ายสถานศึกษา
                </span>
              </div>
            </motion.article>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  )
}
