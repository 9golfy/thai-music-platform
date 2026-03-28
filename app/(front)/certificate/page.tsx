"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Award, CheckCircle2, Medal, ShieldCheck, Star, Trophy } from "lucide-react"

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
    icon: ShieldCheck,
    title: "โปร่งใสตรวจสอบได้",
    description: "ใช้หลักเกณฑ์และตัวชี้วัดที่ชัดเจน ครอบคลุมทั้งด้านการเรียนรู้ บุคลากร และผลลัพธ์",
  },
  {
    icon: Medal,
    title: "ประเมินแบบองค์รวม",
    description: "พิจารณาทั้งเอกสาร ข้อมูลเชิงประจักษ์ และสื่อผลงานที่สะท้อนการดำเนินงานจริง",
  },
  {
    icon: Trophy,
    title: "มีระดับผลประเมิน",
    description: "จัดระดับคุณภาพตั้งแต่ดีเด่นจนถึงต่ำกว่าเกณฑ์ เพื่อสะท้อนมาตรฐานอย่างชัดเจน",
  },
  {
    icon: Star,
    title: "เชิดชูเกียรติ",
    description: "สถานศึกษาที่ผ่านเกณฑ์จะได้รับใบประกาศนียบัตรเป็นเกียรติประวัติและแรงบันดาลใจ",
  },
]

const documentCriteria = [
  {
    title: "ด้านหลักสูตรและการจัดการเรียนการสอน",
    description:
      "สถานศึกษาต้องมีการจัดการเรียนการสอนดนตรีไทยทั้งในเวลาเรียนและนอกเวลาเรียน เช่น การบรรจุในหลักสูตรรายวิชา การจัดกิจกรรมชุมนุม หรือวิชาเพิ่มเติม รวมถึงการมีหลักสูตรท้องถิ่นที่เกี่ยวข้อง",
  },
  {
    title: "ด้านบุคลากร",
    description:
      "มีครูผู้สอนดนตรีไทย ครูภูมิปัญญาท้องถิ่น หรือผู้ทรงคุณวุฒิที่มีความเชี่ยวชาญ รวมถึงการเชิญวิทยากรภายนอกมาร่วมถ่ายทอดความรู้",
  },
  {
    title: "ด้านงบประมาณและทรัพยากร",
    description:
      "ได้รับการสนับสนุนด้านงบประมาณและอุปกรณ์ ทั้งจากหน่วยงานต้นสังกัดและหน่วยงานภายนอก เพื่อให้การจัดการเรียนการสอนมีประสิทธิภาพ",
  },
  {
    title: "ด้านผลงานและรางวัล",
    description:
      "มีผลงานเชิงประจักษ์ เช่น การเข้าร่วมแข่งขันหรือการแสดง และได้รับรางวัลในระดับต่าง ๆ ภายในระยะเวลาที่กำหนด",
  },
  {
    title: "ด้านการเผยแพร่และแลกเปลี่ยนเรียนรู้",
    description:
      "มีการจัดกิจกรรมเผยแพร่ผลงานด้านดนตรีไทย ทั้งภายในและภายนอกสถานศึกษา รวมถึงการเผยแพร่ผ่านสื่อออนไลน์ เช่น Facebook, YouTube หรือ TikTok",
  },
]

const mediaCriteria = [
  "บรรยากาศการเรียนการสอนดนตรีไทยในสถานศึกษา",
  "ความสามารถในการแสดงดนตรีไทยของนักเรียนทั้งโรงเรียน",
]

const levels = ["ระดับดีเด่น", "ระดับดีมาก", "ระดับดี", "ระดับชมเชย", "ต่ำกว่าเกณฑ์"]

const certificateImportance = [
  "ความร่วมมือของผู้บริหาร ครู และชุมชน",
  "ความตั้งใจของนักเรียนในการเรียนรู้ดนตรีไทย",
  "ความเข้มแข็งของสถานศึกษาในการอนุรักษ์วัฒนธรรมไทย",
]

const sections = [
  {
    number: "1",
    eyebrow: "หลักเกณฑ์การประเมิน",
    title: "การประเมินจากเอกสารและข้อมูลเชิงประจักษ์",
    tone: "light" as const,
    intro:
      "การประเมินส่วนนี้มีคะแนนเต็ม ๑๐๐ คะแนน โดยพิจารณาจากองค์ประกอบหลัก ๕ ด้าน ซึ่งสะท้อนความพร้อมและคุณภาพของสถานศึกษาอย่างเป็นระบบ",
    criteria: documentCriteria,
  },
  {
    number: "2",
    eyebrow: "การประเมินสื่อผลงาน",
    title: "สะท้อนการปฏิบัติจริงผ่านภาพถ่ายและคลิปวิดีโอ",
    tone: "dark" as const,
    intro:
      "การประเมินสื่อผลงานมีคะแนนเต็ม ๑๐๐ คะแนน โดยพิจารณาจากภาพถ่ายและคลิปวิดีโอที่สะท้อนให้เห็นถึงการดำเนินงานจริงของสถานศึกษา ทั้งในมิติของบรรยากาศการเรียนรู้และศักยภาพของผู้เรียน",
    list: mediaCriteria,
  },
  {
    number: "3",
    eyebrow: "เกณฑ์การตัดสินและระดับผลการประเมิน",
    title: "จัดระดับคุณภาพอย่างชัดเจนและตรวจสอบได้",
    tone: "light" as const,
    intro:
      "คะแนนรวมจากทั้ง 2 ส่วนจะถูกนำมาพิจารณาเพื่อจัดระดับคุณภาพของสถานศึกษา โดยสถานศึกษาที่ผ่านเกณฑ์ในระดับที่กำหนด จะได้รับใบประกาศนียบัตรเพื่อเชิดชูเกียรติ",
    pills: levels,
  },
  {
    number: "4",
    eyebrow: "ความสำคัญของใบประกาศนียบัตร",
    title: "ไม่ใช่เพียงรางวัล แต่คือสัญลักษณ์ของการร่วมกันรักษาวัฒนธรรมไทย",
    tone: "dark" as const,
    intro:
      "ใบประกาศนียบัตรนี้มิได้เป็นเพียงเครื่องหมายแห่งความสำเร็จเท่านั้น แต่ยังสะท้อนถึงความตั้งใจและความร่วมมือของทุกภาคส่วนที่ขับเคลื่อนการเรียนการสอนดนตรีไทยให้เกิดขึ้นอย่างมีคุณภาพ",
    list: certificateImportance,
  },
]

function SectionCard({
  number,
  eyebrow,
  title,
  tone,
  intro,
  list,
  pills,
  criteria,
}: {
  number: string
  eyebrow: string
  title: string
  tone: "dark" | "light"
  intro?: string
  list?: string[]
  pills?: string[]
  criteria?: { title: string; description: string }[]
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

      {intro ? (
        <p className={`mt-8 text-base leading-8 ${isDark ? "text-white/82" : "text-[#28473b]/90"}`}>{intro}</p>
      ) : null}

      {criteria ? (
        <div className="mt-8 grid gap-4">
          {criteria.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.35rem] bg-white/86 p-5 ring-1 ring-[#e8d6aa] shadow-[0_10px_25px_rgba(87,65,18,0.06)]"
            >
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 leading-7 text-[#355246]">{item.description}</p>
            </div>
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
              <p className={`leading-7 ${isDark ? "text-white/84" : "text-[#355246]"}`}>{item}</p>
            </div>
          ))}
        </div>
      ) : null}

      {pills ? (
        <div className="mt-8 flex flex-wrap gap-3">
          {pills.map((item) => (
            <span
              key={item}
              className={`rounded-full px-4 py-2 text-sm ${
                isDark
                  ? "border border-[#f3d37d]/28 bg-[#f3d37d]/10 text-[#f6dfa0]"
                  : "border border-[#ccb06a]/40 bg-white/72 text-[#355246]"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}
    </motion.article>
  )
}

export default function CertificatePage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-[#071d15] pt-16 text-[#f7f0df]">
        <section className="relative isolate">
          <div className="absolute inset-0">
            <Image
              src="/images/certificate-article.png"
              alt="ครูถือใบประกาศนียบัตร"
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
                ประกาศนียบัตร
              </motion.span>

              <motion.h1
                className="cinematic-gold-title mt-6 text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-[4rem]"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                หลักเกณฑ์และกระบวนการ
                <br />
                พิจารณาคัดเลือกสถานศึกษา
              </motion.h1>

              <motion.p
                className="mt-6 max-w-2xl text-lg leading-8 text-white/86 sm:text-xl"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.8 }}
              >
                แนวทางการประเมินที่เป็นระบบ โปร่งใส และตรวจสอบได้ เพื่อรับรองคุณภาพของสถานศึกษาที่ส่งเสริมการเรียนการสอนดนตรีไทยอย่างต่อเนื่องและเป็นรูปธรรม
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
                    src="/images/certificate-article.png"
                    alt="ภาพประกอบใบประกาศนียบัตร"
                    width={1400}
                    height={900}
                    className="h-full w-full object-cover object-top"
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
            <motion.article
              variants={fadeUp}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className="overflow-hidden rounded-[2rem] border border-[#d2bb80]/18 bg-[linear-gradient(180deg,rgba(12,40,31,0.98),rgba(7,25,19,0.98))] p-8 shadow-[0_22px_60px_rgba(0,0,0,0.14)] sm:p-10"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f0c969]/14 text-[#f5da94]">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-[#cfb26a]">บทนำของกระบวนการคัดเลือก</p>
                  <h2 className="mt-3 text-2xl font-semibold leading-tight text-[#fff1c4] sm:text-[2rem]">
                    การรับรองคุณภาพสถานศึกษาด้วยหลักเกณฑ์ที่ชัดเจน
                  </h2>
                </div>
              </div>

              <div className="mt-8 space-y-5 text-base leading-8 text-white/82">
                <p>
                  โครงการโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์ ประจำปีงบประมาณ พ.ศ. 2569 จัดขึ้นโดยกรมส่งเสริมวัฒนธรรม กระทรวงวัฒนธรรม โดยมีวัตถุประสงค์เพื่อส่งเสริม สนับสนุน และยกระดับการเรียนการสอนดนตรีไทยในสถานศึกษา ตลอดจนปลูกฝังให้เยาวชนไทยมีความรู้ ความสามารถ และความภาคภูมิใจในมรดกทางวัฒนธรรมของชาติ
                </p>
                <p>
                  ในการพิจารณาคัดเลือกสถานศึกษาเพื่อรับใบประกาศนียบัตร โครงการได้กำหนดหลักเกณฑ์และตัวชี้วัดอย่างเป็นระบบ โปร่งใส และสามารถตรวจสอบได้ โดยใช้การประเมินแบบองค์รวม ครอบคลุมทั้งด้านการจัดการเรียนการสอน บุคลากร ทรัพยากร และผลลัพธ์ของผู้เรียน
                </p>
              </div>
            </motion.article>

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
                  5
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-[#cfb26a]">สรุปสาระสำคัญ</p>
                  <h2 className="mt-3 text-2xl font-semibold leading-tight text-[#fff1c4] sm:text-[2rem]">
                    ใบประกาศนียบัตรในฐานะเครื่องยืนยันคุณภาพและความมุ่งมั่น
                  </h2>
                </div>
              </div>

              <div className="mt-8 space-y-5 text-base leading-8 text-white/84">
                <p>
                  สถานศึกษาที่ผ่านเกณฑ์การประเมินในระดับที่กำหนด จะได้รับใบประกาศนียบัตรเพื่อเชิดชูเกียรติ อันเป็นการรับรองถึงความมุ่งมั่นและความสำเร็จในการส่งเสริมการเรียนการสอนดนตรีไทยอย่างมีคุณภาพ
                </p>
                <p>
                  ทั้งนี้ ใบประกาศนียบัตรยังถือเป็นเกียรติประวัติ และเป็นแรงบันดาลใจในการพัฒนาและต่อยอดการเรียนการสอนดนตรีไทยให้ก้าวหน้ายิ่งขึ้นในอนาคต
                </p>
              </div>
            </motion.article>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  )
}
