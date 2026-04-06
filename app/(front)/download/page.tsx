"use client"

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { motion } from 'framer-motion'
import { FileText, Download } from 'lucide-react'

const downloadFiles = [
  {
    title: 'ประกาศกรมส่งเสริมวัฒนธรรม เรื่องการคัดเลือกโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์',
    description: 'ประกาศกรมส่งเสริมวัฒนธรรม เรื่องการคัดเลือกโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์ ประจำปีงบประมาณ พ.ศ.2569',
    url: '/filedownload/file002_announcement_call_to_register.pdf',
  },
  {
    title: 'หลักเกณฑ์การประเมินและตัวชี้วัด',
    description: 'เอกสารหลักเกณฑ์และคุณสมบัติการสมัครเข้าร่วมกิจกรรม',
    url: '/filedownload/file001_policy_evaluation.pdf',
  },  
]

export default function DownloadPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 bg-[#0A3625] text-[#e8e0d0] relative">
        {/* Background Image with Overlay */}
        <div className="fixed inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: 'url(/images/register100activity.png)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A3625]/95 via-[#0A3625]/90 to-[#0A3625]/95" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-[#f0d48d] sm:text-5xl mb-4">
              ดาวน์โหลดเอกสาร
            </h1>
            <p className="text-lg text-white/70">
              เอกสารและแบบฟอร์มสำหรับการสมัครเข้าร่วมกิจกรรม
            </p>
          </motion.div>

          {/* Download List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto space-y-4"
          >
            {downloadFiles.map((file, index) => (
              <motion.a
                key={index}
                href={file.url}
                download
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="flex items-center gap-4 p-6 rounded-xl bg-[linear-gradient(180deg,rgba(17,53,40,0.92),rgba(9,28,21,0.98))] border border-[#d2bb80]/20 hover:border-[#f0d48d]/40 hover:bg-[rgba(17,53,40,0.98)] transition-all duration-300 group"
              >
                {/* PDF Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                  <FileText className="w-6 h-6 text-red-500" />
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-[#f0d48d] group-hover:text-[#ffd700] transition-colors mb-1">
                    {file.title}
                  </h3>
                  <p className="text-sm text-white/60 line-clamp-1">
                    {file.description}
                  </p>
                </div>

                {/* Download Button */}
                <div className="flex-shrink-0">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f0d48d]/10 text-[#f0d48d] group-hover:bg-[#f0d48d]/20 transition-colors">
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:inline">ดาวน์โหลด</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-4xl mx-auto mt-12 p-6 rounded-xl bg-blue-500/10 border border-blue-500/20"
          >
            <p className="text-sm text-blue-200 text-center">
              <strong>หมายเหตุ:</strong> ไฟล์เอกสารทั้งหมดอยู่ในรูปแบบ PDF กรุณาติดตั้งโปรแกรมอ่านไฟล์ PDF เพื่อเปิดดูเอกสาร
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
