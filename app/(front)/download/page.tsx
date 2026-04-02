"use client"

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { motion } from 'framer-motion'

export default function DownloadPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 bg-[#0A3625] text-[#e8e0d0]">
        <div className="max-w-7xl mx-auto px-4 py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="rounded-[2rem] border border-[#d2bb80]/20 bg-[linear-gradient(180deg,rgba(17,53,40,0.92),rgba(9,28,21,0.98))] p-16 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <h1 className="text-4xl font-bold text-[#f0d48d] sm:text-5xl mb-4">
                โปรดติดตามเร็วๆนี้
              </h1>
              <p className="text-lg text-white/70 mt-4">
                เอกสารและไฟล์ดาวน์โหลดจะพร้อมให้บริการในเร็วๆ นี้
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
