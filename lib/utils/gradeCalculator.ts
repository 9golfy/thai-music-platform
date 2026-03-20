/**
 * Calculate grade based on total score
 * @param score - Total score
 * @param maxScore - Maximum possible score (default: 100 for register100, use 80 for register-support)
 * @returns Grade letter (A, B, C, F)
 */
export function calculateGrade(score: number, maxScore: number = 100): string {
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 80) return 'A';      // 80-100% - ดีเยี่ยม
  if (percentage >= 70) return 'B';      // 70-79% - ดี
  if (percentage >= 50) return 'C';      // 50-69% - พอใช้
  return 'F';                            // 0-49% - ต้องปรับปรุง
}

/**
 * Get grade color for display
 * @param grade - Grade letter
 * @returns Tailwind color class
 */
export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A':
      return 'text-green-600';      // 80-100% - สีเขียว (ดีเยี่ยม)
    case 'B':
      return 'text-blue-600';       // 70-79% - สีน้ำเงิน (ดี)
    case 'C':
      return 'text-orange-600';     // 50-69% - สีส้ม (พอใช้)
    case 'F':
      return 'text-red-600';        // 0-49% - สีแดง (ต้องปรับปรุง)
    default:
      return 'text-gray-600';
  }
}

/**
 * Get grade background color for display
 * @param grade - Grade letter
 * @returns Tailwind background color class
 */
export function getGradeBgColor(grade: string): string {
  switch (grade) {
    case 'A':
      return 'bg-green-50';         // 80-100% - สีเขียว (ดีเยี่ยม)
    case 'B':
      return 'bg-blue-50';          // 70-79% - สีน้ำเงิน (ดี)
    case 'C':
      return 'bg-orange-50';        // 50-69% - สีส้ม (พอใช้)
    case 'F':
      return 'bg-red-50';           // 0-49% - สีแดง (ต้องปรับปรุง)
    default:
      return 'bg-gray-50';
  }
}
