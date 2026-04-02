import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Phone, Mail, MapPin } from 'lucide-react'

export default function ContractPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 bg-[#0A3625] text-[#e8e0d0]">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-12 text-center text-[#f0d48d]">ติดต่อเรา</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: Map */}
            <div className="w-full">
              <h2 className="text-2xl font-semibold text-[#f0d48d] mb-4">แผนที่</h2>
              <div className="w-full h-96 rounded-lg overflow-hidden border-2 border-[#f0d48d]/30 shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.2449087891847!2d100.48445931483!3d13.789847990331!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29c4e8e0e8e8f%3A0x8e0e8e8e8e8e8e8e!2z4LiB4Lij4Liw4LiX4Lij4Lin4LiH4Lin4Lix4LiS4LiZ4LiY4Lij4Lij4Lih!5e0!3m2!1sth!2sth!4v1234567890123!5m2!1sth!2sth"
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
                href="https://maps.app.goo.gl/1EfxTnFeijfMHfrAA"
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
