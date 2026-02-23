import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function CertificatePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 bg-[#0A3625] text-[#e8e0d0]">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-6">ประกาศนียบัตร</h1>
          <p className="text-lg">เนื้อหาประกาศนียบัตรจะอยู่ที่นี่</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
