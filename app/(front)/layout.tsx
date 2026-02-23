import GlobalWaveBackground from '@/components/global-wave-background'

export default function FrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <GlobalWaveBackground />
      <div className="relative z-10 bg-[#0A3625] text-[#e8e0d0]">
        {children}
      </div>
    </>
  )
}
