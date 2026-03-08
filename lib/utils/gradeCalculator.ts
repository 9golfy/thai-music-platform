/**
 * Calculate grade based on total score
 * @param score - Total score (0-100)
 * @returns Grade letter (A, B, C, F)
 */
export function calculateGrade(score: number): string {
  if (score >= 90) return 'A';      // 90-100 คะแนน
  if (score >= 70) return 'B';      // 70-89 คะแนน
  if (score >= 50) return 'C';      // 50-69 คะแนน
  return 'F';                       // 0-49 คะแนน
}

/**
 * Get grade color for display
 * @param grade - Grade letter
 * @returns Tailwind color class
 */
export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A':
      return 'text-green-600';      // 90-100 คะแนน - สีเขียว
    case 'B':
      return 'text-blue-600';       // 70-89 คะแนน - สีน้ำเงิน
    case 'C':
      return 'text-orange-600';     // 50-69 คะแนน - สีส้ม
    case 'F':
      return 'text-red-600';        // 0-49 คะแนน - สีแดง
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
      return 'bg-green-50';         // 90-100 คะแนน - สีเขียว
    case 'B':
      return 'bg-blue-50';          // 70-89 คะแนน - สีน้ำเงิน
    case 'C':
      return 'bg-orange-50';        // 50-69 คะแนน - สีส้ม
    case 'F':
      return 'bg-red-50';           // 0-49 คะแนน - สีแดง
    default:
      return 'bg-gray-50';
  }
}
