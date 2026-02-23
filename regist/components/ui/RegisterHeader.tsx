'use client';

interface RegisterHeaderProps {
  currentStep: number;
  totalSteps: number;
  title?: string;
  subtitle?: string;
}

export default function RegisterHeader({
  currentStep,
  totalSteps,
  title = 'โครงการดนตรีไทย (Thai Music Project)',
  subtitle = 'แบบฟอร์มลงทะเบียนเข้าร่วมโครงการ',
}: RegisterHeaderProps) {
  return (
    <div className="bg-white border-b border-neutral-border">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-4">
            {/* Logo Icon */}
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            </div>

            {/* Title & Subtitle */}
            <div>
              <h1 className="text-lg font-bold text-neutral-dark leading-tight">
                {title}
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Right: Progress */}
          <div className="text-right">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              ความคืบหน้า (Progress)
            </p>
            <p className="text-2xl font-bold text-primary">
              {currentStep} / {totalSteps}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
