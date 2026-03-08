import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'แบบเสนอผลงาน 69',
  description: 'โครงการดนตรีไทย',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
