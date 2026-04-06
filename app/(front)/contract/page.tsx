import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Phone, Mail, MapPin } from 'lucide-react'

export default function ContractPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 bg-[#0A3625] text-[#e8e0d0] relative">
        {/* Background Image with Overlay */}
        <div className="fixed inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: 'url(/images/contactus-bg.png)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A3625]/95 via-[#0A3625]/90 to-[#0A3625]/95" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-12 text-center text-[#f0d48d]">ติดต่อเรา</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: Map */}
            <div className="w-full">
              <h2 className="text-2xl font-semibold text-[#f0d48d] mb-4">แผนที่</h2>
              <div className="w-full h-96 rounded-lg overflow-hidden border-2 border-[#f0d48d]/30 shadow-lg">
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
                href="https://maps.app.goo.gl/oxNPjGtFVu1a7fFq7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-sm text-[#f0d48d] hover:text-white transition-colors duration-300"
              >
                <MapPin className="h-4 w-4" />
                ดูแผนที่ใน Google Maps
              </a>
            </div>

            {/* Right: Contact Information */}
            <div className="w-full">
              <h2 className="text-2xl font-semibold text-[#f0d48d] mb-6">ข้อมูลติดต่อ</h2>
              <div className="bg-[#0f3d2a] rounded-lg p-8 border border-[#f0d48d]/20 shadow-lg">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#f0d48d] mb-3">
                      กลุ่มส่งเสริมเครือข่ายสถานศึกษาและองค์กรเอกชน
                    </h3>
                    <p className="text-white/80 leading-relaxed">
                      กองกิจการเครือข่ายทางวัฒนธรรม<br />
                      กรมส่งเสริมวัฒนธรรม<br />
                      กระทรวงวัฒนธรรม
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-[#f0d48d] mt-1 shrink-0" />
                      <div className="text-white/80 leading-relaxed">
                        14 ถนนเทียมร่วมมิตร เขตห้วยขวาง<br />
                        กรุงเทพฯ 10310
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-[#f0d48d] shrink-0" />
                      <span className="text-white/80">
                        โทรศัพท์ 02-247-0013 ต่อ 1409 , 1410
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-[#f0d48d] shrink-0" />
                      <a 
                        href="mailto:edu.dcpcult@gmail.com"
                        className="text-white/80 hover:text-[#f0d48d] transition-colors"
                      >
                        edu.dcpcult@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
