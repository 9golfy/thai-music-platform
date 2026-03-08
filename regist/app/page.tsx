import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-4 text-center">
          แบบเสนอผลงาน 69
        </h1>
        <h2 className="text-xl text-neutral-dark mb-6 text-center">
          เพื่อเข้ารับการคัดเลือกกิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์
        </h2>
        <p className="text-center text-neutral-dark mb-8">
          ประจำปีงบประมาณ พ.ศ. 2569
        </p>
        
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-neutral-dark mb-3">ข้อมูลที่ต้องเตรียม:</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-neutral-dark">
            <li>ข้อมูลพื้นฐานของสถานศึกษา</li>
            <li>ข้อมูลผู้บริหารและผู้สอนดนตรีไทย</li>
            <li>แผนการจัดการเรียนการสอน</li>
            <li>ข้อมูลเครื่องดนตรีไทยและวิทยากร</li>
            <li>รูปภาพกิจกรรม (ไฟล์ jpg/png ขนาดไม่เกิน 1MB ต่อไฟล์)</li>
          </ul>
        </div>

        <div className="text-center">
          <Link
            href="/register-69"
            className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            เริ่มกรอกแบบฟอร์ม
          </Link>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          แบบฟอร์มนี้ใช้เวลากรอกประมาณ 15-20 นาที และสามารถบันทึกร่างได้
        </p>
      </div>
    </div>
  );
}
