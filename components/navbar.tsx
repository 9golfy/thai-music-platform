"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, LogIn } from "lucide-react"

const navItems = [
  { label: "หน้าแรก", href: "/" },
  { label: "ข้อมูลโครงการ", href: "/about" },
  { label: "ประกาศนียบัตร", href: "/certificate" },
  { label: "ดาวน์โหลด", href: "/download" },
  { label: "ติดต่อ", href: "/contract" },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      // Only handle scroll for hash-based navigation on home page
      if (pathname !== '/') return
      
      const sections = navItems.filter(item => item.href.startsWith('#')).map(item => item.href)
      if (sections.length === 0) return
      
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.querySelector(section)
        if (element) {
          const offsetTop = (element as HTMLElement).offsetTop
          const offsetHeight = (element as HTMLElement).offsetHeight
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial position
    
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  const handleNavClick = (href: string) => {
    // Only set active section for hash-based navigation
    if (href.startsWith('#')) {
      setActiveSection(href)
    }
    setMobileOpen(false)
  }

  const isActive = (href: string) => {
    // For hash-based navigation
    if (href.startsWith('#')) {
      return activeSection === href
    }
    // For path-based navigation
    return pathname === href
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#007F3D]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* LEFT: Logo + Title */}
          <a href="/" className="flex items-center gap-3 shrink-0">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-2gHqbiDoYjG1Du6Ziwev8MkD2NOkLc.png"
              alt="โลโก้โครงการ"
              className="h-11 w-11 object-contain"
              draggable={false}
            />
            <div className="flex flex-col leading-tight">
              <span className="text-white font-bold text-[15px]">
                {"โครงการคัดเลือกสถานศึกษา"}
              </span>
              <span className="text-white/80 text-[11px]">
                {"ตามกิจกรรมโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์"}
              </span>
            </div>
          </a>

          {/* CENTER-RIGHT: Nav links (desktop) */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative text-sm font-medium transition-colors duration-300 ${
                    active
                      ? "text-[#F9E295]"
                      : "text-white/80 hover:text-[#F9E295]"
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="navbar-underline"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#F9E295] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              )
            })}
          </div>

          {/* RIGHT: Login button (desktop) */}
          <a
            href="/login"
            className="hidden lg:inline-flex items-center gap-2 rounded-full border border-white/80 px-5 py-1.5 text-sm font-medium text-white transition-all duration-300 hover:bg-[#F9E295] hover:text-[#1a1a1a] hover:border-[#F9E295]"
          >
            <LogIn className="h-4 w-4" />
            {"เข้าระบบ"}
          </a>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#007F3D] overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-1">
              {navItems.map((item) => {
                const active = isActive(item.href)
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className={`relative py-2.5 text-sm transition-colors duration-300 ${
                      active
                        ? "text-[#F9E295] font-semibold"
                        : "text-white/80 hover:text-[#F9E295]"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute bottom-0 left-0 w-12 h-[2px] bg-[#F9E295] rounded-full" />
                    )}
                  </a>
                )
              })}
              <a
                href="/login"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-white/80 px-5 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-[#F9E295] hover:text-[#1a1a1a] hover:border-[#F9E295]"
                onClick={() => setMobileOpen(false)}
              >
                <LogIn className="h-4 w-4" />
                {"เข้าระบบ"}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
