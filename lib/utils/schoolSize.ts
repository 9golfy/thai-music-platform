// Helper function to calculate school size from student count

export type SchoolSize = 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE';

export function calculateSchoolSize(studentCount: number | undefined): SchoolSize | undefined {
  if (studentCount === undefined || studentCount === null || isNaN(studentCount) || studentCount < 0) {
    return undefined;
  }

  if (studentCount <= 119) return 'SMALL';
  if (studentCount <= 719) return 'MEDIUM';
  if (studentCount <= 1679) return 'LARGE';
  return 'EXTRA_LARGE';
}

export function getSchoolSizeHint(): string {
  return 'ขนาดโรงเรียนจะถูกคำนวณอัตโนมัติจากจำนวนนักเรียน: เล็ก (≤119), กลาง (120-719), ใหญ่ (720-1,679), ใหญ่พิเศษ (≥1,680)';
}

export function getDynamicSchoolSizeMessage(studentCount: number | undefined): string | null {
  if (studentCount === undefined || studentCount === null || isNaN(studentCount) || studentCount < 0) {
    return null;
  }

  if (studentCount <= 119) {
    return 'ขนาดเล็ก (119 คนลงมา)';
  }
  if (studentCount <= 719) {
    return 'ขนาดกลาง (120 - 719 คน)';
  }
  if (studentCount <= 1679) {
    return 'ขนาดใหญ่ (720 - 1,679 คน)';
  }
  return 'ขนาดใหญ่พิเศษ (1,680 คนขึ้นไป)';
}

export function getSchoolSizeDisplayText(sizeEnum: string | undefined): string {
  switch (sizeEnum) {
    case 'SMALL':
      return 'ขนาดเล็ก (119 คนลงมา)';
    case 'MEDIUM':
      return 'ขนาดกลาง (120 - 719 คน)';
    case 'LARGE':
      return 'ขนาดใหญ่ (720 - 1,679 คน)';
    case 'EXTRA_LARGE':
      return 'ขนาดใหญ่พิเศษ (1,680 คนขึ้นไป)';
    default:
      return '';
  }
}
