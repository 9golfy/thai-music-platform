import type { Metadata, Viewport } from 'next'
import { Sarabun } from 'next/font/google'
import './globals.css'

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  variable: '--font-sarabun',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'กิจกรรมคัดเลือกสถานศึกษา | โรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์',
  description: 'กิจกรรมคัดเลือกกิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์ ประจำปีงบประมาณ พ.ศ. 2569',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/Logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/Logo.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/Logo.png',
    apple: [
      { url: '/Logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: '#0A3625',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" className={sarabun.variable}>
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-YZJLC5ES6Z"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YZJLC5ES6Z');
            `,
          }}
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <link rel="icon" href="/Logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/Logo.png" />
        <meta name="theme-color" content="#0A3625" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
