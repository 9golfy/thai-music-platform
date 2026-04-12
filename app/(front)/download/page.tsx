"use client"

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { motion } from 'framer-motion'
import { FileText, Download, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

const downloadFiles = [
  {
    title: 'คู่มือการลงทะเบียนประเภทโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์',
    description: 'คู่มือการลงทะเบียนผ่านหน้าเว็บไซต์สำหรับโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์ เวอร์ชัน 1.0',
    url: '/filedownload/reg100-คู่มือการลงทะเบียนประเภทโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์ v1.0.pdf',
    type: 'pdf'
  },
  {
    title: 'คู่มือการลงทะเบียนประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย',
    description: 'คู่มือการลงทะเบียนผ่านหน้าเว็บไซต์สำหรับโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย เวอร์ชัน 1.0',
    url: '/filedownload/regsup-คู่มือการลงทะเบียนประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย v1.0.pdf',
    type: 'pdf'
  },
  {
    title: 'ประกาศกรมส่งเสริมวัฒนธรรม เรื่องการคัดเลือกโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์',
    description: 'ประกาศกรมส่งเสริมวัฒนธรรม เรื่องการคัดเลือกโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์ ประจำปีงบประมาณ พ.ศ.2569',
    url: '/filedownload/file002_announcement_call_to_register.pdf',
    type: 'pdf'
  },
  {
    title: 'หลักเกณฑ์การประเมินและตัวชี้วัด',
    description: 'เอกสารหลักเกณฑ์และคุณสมบัติการสมัครเข้าร่วมกิจกรรม',
    url: '/filedownload/file001_v2_policy_evaluation.pdf',
    type: 'pdf'
  },  
]

const posterImages = [
  {
    title: 'โปสเตอร์กิจกรรมโรงเรียนดนตรีไทย',
    description: 'โปสเตอร์ประชาสัมพันธ์กิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์',
    url: '/imgposters/poster01.png',
    filename: 'poster01.png'
  },
  {
    title: 'โปสเตอร์โรงเรียนดนตรีไทย 100%',
    description: 'โปสเตอร์สำหรับโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์',
    url: '/imgposters/poster02-reg100.png',
    filename: 'poster02-reg100.png'
  },
  {
    title: 'โปสเตอร์โรงเรียนสนับสนุนและส่งเสริม',
    description: 'โปสเตอร์สำหรับโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย',
    url: '/imgposters/poster03-regsupport.png',
    filename: 'poster03-regsupport.png'
  },
]

const qrCodeItems = [
  {
    qrImage: "/qrcode/qr-regist-activities.png",
    title: "QR Code แบบฟอร์มการสมัคร",
    description: "สแกน QR Code เพื่อเข้าสู่หน้าแบบฟอร์มการสมัครเข้าร่วมกิจกรรม",
    href: "/regist-activities",
    filename: "qr-regist-activities.png",
  },
  {
    qrImage: "/qrcode/qr-policy-instructions.png",
    title: "QR Code หลักเกณฑ์การสมัคร",
    description: "สแกน QR Code เพื่อดูหลักเกณฑ์และคุณสมบัติการสมัคร",
    href: "/filedownload/file001_policy_evaluation.pdf",
    filename: "qr-policy-instructions.png",
  },
  {
    qrImage: "/qrcode/qr-filedownload.png",
    title: "QR Code คู่มือสำหรับรับสมัคร",
    description: "สแกน QR Code เพื่อดาวน์โหลดคู่มือและเอกสารประกอบ",
    href: "/download",
    filename: "qr-filedownload.png",
  },
]

export default function DownloadPage() {
  const handleDownloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  const handleDownloadQR = async (qrImage: string, filename: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const response = await fetch(qrImage)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Error downloading QR code:', error)
    }
  }

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

          {/* PDF Documents Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto space-y-4 mb-16"
          >
            <h2 className="text-2xl font-bold text-[#f0d48d] mb-6 text-center">เอกสารประกอบ</h2>
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

          {/* QR Code Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto mb-16"
          >
            <h2 className="text-2xl font-bold text-[#f0d48d] mb-6 text-center">QR Code สำหรับสแกน</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {qrCodeItems.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="block bg-[linear-gradient(180deg,rgba(17,53,40,0.92),rgba(9,28,21,0.98))] rounded-xl border border-[#d2bb80]/20 hover:border-[#f0d48d]/40 transition-all duration-300 overflow-hidden group"
                >
                  {/* QR Code Image */}
                  <div className="relative aspect-square bg-white p-4 flex items-center justify-center">
                    <Image
                      src={item.qrImage}
                      alt={item.title}
                      width={200}
                      height={200}
                      className="object-contain"
                    />
                  </div>
                  
                  {/* QR Info */}
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-[#f0d48d] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/60 mb-4">
                      {item.description}
                    </p>
                    
                    {/* Download Button */}
                    <button
                      onClick={(e) => handleDownloadQR(item.qrImage, item.filename, e)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#f0d48d]/10 text-[#f0d48d] hover:bg-[#f0d48d]/20 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm font-medium">ดาวน์โหลด QR Code</span>
                    </button>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Poster Images Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-6xl mx-auto mb-16"
          >
            <h2 className="text-2xl font-bold text-[#f0d48d] mb-6 text-center">โปสเตอร์ประชาสัมพันธ์</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posterImages.map((poster, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-xl bg-[linear-gradient(180deg,rgba(17,53,40,0.92),rgba(9,28,21,0.98))] border border-[#d2bb80]/20 overflow-hidden hover:border-[#f0d48d]/40 transition-all duration-300 group"
                >
                  {/* Poster Image */}
                  <div className="relative aspect-[3/4] bg-gray-800">
                    <Image
                      src={poster.url}
                      alt={poster.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  
                  {/* Poster Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-[#f0d48d] mb-2">
                      {poster.title}
                    </h3>
                    <p className="text-sm text-white/60 mb-4">
                      {poster.description}
                    </p>
                    
                    {/* Download Button */}
                    <button
                      onClick={() => handleDownloadImage(poster.url, poster.filename)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#f0d48d]/10 text-[#f0d48d] hover:bg-[#f0d48d]/20 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm font-medium">ดาวน์โหลดโปสเตอร์</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
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
