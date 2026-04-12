"use client"

import { Phone, Mail, MapPin, Facebook, Globe } from "lucide-react"
import { MessageCircle } from "lucide-react"

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/DCP.culture", label: "Facebook" },
  { icon: Globe, href: "https://www.culture.go.th/culture_th/main.php?filename=index", label: "Website" },
  { icon: MessageCircle, href: "https://line.me/ti/g2/4z-joEHAkGqVZuKK18e-nkbVH4F4LuPfhlgwcQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default", label: "Line" },
]

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-black pt-16 pb-8 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Column 1: About - 3 columns */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-start">
            <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-2gHqbiDoYjG1Du6Ziwev8MkD2NOkLc.png"
                alt="โลโก้โครงการ"
                className="h-11 w-11 object-contain"
                draggable={false}
              />
              <div className="flex flex-col leading-tight text-left">
                <span className="text-white font-bold text-[15px]">
                  {"กิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์"}
                </span>
                <span className="text-white/80 text-[11px]">
                  {"ประจำปีงบประมาณ พ.ศ.2569"}
                </span>
              </div>
            </div>
            <blockquote className="text-lg text-white/80 leading-relaxed text-center italic border-l-4 border-white/30 pl-4">
              {"กรมส่งเสริมวัฒนธรรม เพื่อสืบสาน รักษา ต่อยอดวิชาดนตรีไทยให้คงอยู่คู่สังคมไทย"}
            </blockquote>
          </div>

          {/* Column 2: Quick Links - 2 columns */}
          <div className="lg:col-span-2 text-center lg:text-left">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2 justify-center lg:justify-start">
              <span className="material-symbols-outlined text-lg">link</span>
              {"ลิงก์ด่วน"}
            </h3>
            <ul className="flex flex-col gap-2 items-center lg:items-start">
              {["หน้าแรก", "สมัครกิจกรรม", "ข้อมูลกิจกรรม", "ประกาศนียบัตร", "ดาวน์โหลด", "ติดต่อ"].map(
                (label) => (
                  <li key={label}>
                    <a
                      href="#"
                      className="text-sm text-white/60 transition-colors duration-300 hover:text-white"
                    >
                      {label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Column 3: Google Map - 4 columns */}
          <div className="lg:col-span-4 text-center lg:text-left">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2 justify-center lg:justify-start">
              <span className="material-symbols-outlined text-lg">map</span>
              {"แผนที่"}
            </h3>
            <div className="w-full h-48 rounded-lg overflow-hidden border border-white/20">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.212857414695!2d100.57084187516341!3d13.766033496963697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29e87fdd70611%3A0x65105b57b0c3de16!2z4LiB4Lij4Lih4Liq4LmI4LiH4LmA4Liq4Lij4Li04Lih4Lin4Lix4LiS4LiZ4LiY4Lij4Lij4Lih!5e0!3m2!1sth!2sth!4v1775448708517!5m2!1sth!2sth"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="แผนที่กระทรวงวัฒนธรรม"
              />
            </div>
            <a
              href="https://maps.app.goo.gl/YLSnxEpYmwGAE8nQ8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-sm text-white/60 hover:text-white transition-colors duration-300"
            >
              <MapPin className="h-4 w-4" />
              {"ดูแผนที่ใน Google Maps"}
            </a>
          </div>

          {/* Column 4: Contact - 3 columns */}
          <div className="lg:col-span-3 text-center lg:text-left">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2 justify-center lg:justify-start">
              <span className="material-symbols-outlined text-lg">support_agent</span>
              {"ติดต่อเรา"}
            </h3>
            <ul className="flex flex-col gap-3 items-center lg:items-start">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-white/50 mt-0.5 shrink-0" />
                <span className="text-sm text-white/60 leading-relaxed text-left">
                  {"กรมส่งเสริมวัฒนธรรม กระทรวงวัฒนธรรม 14 ถนนเทียมร่วมมิตร เขตห้วยขวาง กรุงเทพฯ 10310"}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-white/50 shrink-0" />
                <span className="text-sm text-white/60">
                  {"โทรศัพท์ 02-247-0013 ต่อ 1409 , 1410"}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-white/50 shrink-0" />
                <span className="text-sm text-white/60">
                  {"edu.dcpcult@gmail.com"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            {"© 2026 DCPSchool100.net, This website includes AI-generated visuals and audio (Google Gemini) for educational purposes."}
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => {
              const Icon = link.icon
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/50 transition-all duration-300 hover:border-white/50 hover:text-white"
                  aria-label={link.label}
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
