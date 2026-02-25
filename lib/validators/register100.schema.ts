import { z } from 'zod';

// Enums
export const schoolLevelEnum = z.enum(['ประถมศึกษา', 'มัธยมศึกษา', 'ขยายโอกาส', 'เฉพาะทาง'], {
  errorMap: () => ({ message: 'กรุณาระบุข้อมูลให้ถูกต้อง' })
});
export const schoolSizeEnum = z.enum(['SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE']);

// Thai Music Teacher schema
const thaiMusicTeacherSchema = z.object({
  teacherQualification: z.string().optional(),
  teacherFullName: z.string().optional(),
  teacherPosition: z.string().optional(),
  teacherEducation: z.string().optional(),
  teacherPhone: z.string().optional(),
  teacherEmail: z.string().email('กรุณากรอก email ให้ถูกต้อง').optional().or(z.literal('')),
  teacherImage: z.any().optional(),
});

// Support factor schema (for Step 5)
const supportFactorSchema = z.object({
  sup_supportByAdmin: z.string().optional(),
  sup_supportBySchoolBoard: z.string().optional(),
  sup_supportByOthers: z.string().optional(),
  sup_supportByDescription: z.string().optional(),
  sup_supportByDate: z.string().optional(),
  sup_supportByDriveLink: z.string().optional(),
});

// Support from organization schema
const supportFromOrgSchema = z.object({
  organization: z.string().optional(),
  details: z.string().optional(),
  evidenceLink: z.string().optional(),
});

// Support from external schema
const supportFromExternalSchema = z.object({
  organization: z.string().optional(),
  details: z.string().optional(),
  evidenceLink: z.string().optional(),
});

// Award schema
const awardSchema = z.object({
  awardLevel: z.string().optional(), // อำเภอ, จังหวัด, ภาค, ประเทศ
  awardName: z.string().optional(),
  awardDate: z.string().optional(),
  awardEvidenceLink: z.string().optional(),
});

// Activity within province - internal schema
const activityWithinProvinceInternalSchema = z.object({
  activityName: z.string().optional(),
  activityDate: z.string().optional(),
  evidenceLink: z.string().optional(),
});

// Activity within province - external schema
const activityWithinProvinceExternalSchema = z.object({
  activityName: z.string().optional(),
  activityDate: z.string().optional(),
  evidenceLink: z.string().optional(),
});

// Activity outside province schema
const activityOutsideProvinceSchema = z.object({
  activityName: z.string().optional(),
  activityDate: z.string().optional(),
  evidenceLink: z.string().optional(),
});

// PR activity schema
const prActivitySchema = z.object({
  activityName: z.string().optional(),
  platform: z.string().optional(),
  publishDate: z.string().optional(),
  evidenceLink: z.string().optional(),
});

// Main form schema
export const register100Schema = z.object({
  // Step 1: ข้อมูลพื้นฐาน
  schoolName: z.string().min(1, 'กรุณากรอกชื่อสถานศึกษา'),
  schoolProvince: z.string().min(1, 'กรุณาเลือกจังหวัด'),
  province: z.string().optional(),
  schoolLevel: schoolLevelEnum,
  affiliation: z.string().optional(),
  schoolSize: schoolSizeEnum.optional(),
  staffCount: z.coerce.number().optional(),
  studentCount: z.coerce.number().optional(),
  studentCountByGrade: z.string().optional(),
  
  // สถานที่ตั้ง
  addressNo: z.string().optional(),
  moo: z.string().optional(),
  road: z.string().optional(),
  subDistrict: z.string().optional(),
  district: z.string().optional(),
  provinceAddress: z.string().optional(),
  postalCode: z.coerce.string().optional(),
  phone: z.string().optional(),
  fax: z.string().optional(),

  // Step 2: ผู้บริหารสถานศึกษา
  mgtFullName: z.string().min(1, 'กรุณากรอกชื่อผู้บริหาร'),
  mgtPosition: z.string().min(1, 'กรุณากรอกตำแหน่ง'),
  mgtAddress: z.string().optional(),
  mgtPhone: z.string().min(1, 'กรุณากรอกเบอร์โทรศัพท์'),
  mgtEmail: z.string().email('กรุณากรอก email ให้ถูกต้อง').optional().or(z.literal('')),
  mgtImage: z.any().optional(),

  // Step 3: แผนการสอน
  currentMusicTypes: z.array(z.object({
    grade: z.string().optional(),
    details: z.string().optional(),
  })).default([]),
  readinessItems: z.array(z.object({
    instrumentName: z.string().optional(),
    quantity: z.string().optional(),
    note: z.string().optional(),
  })).default([]),

  // Step 4: ผู้สอนดนตรีไทย
  thaiMusicTeachers: z.array(thaiMusicTeacherSchema).default([]),
  
  // Teacher training checkboxes (คะแนน)
  isCompulsorySubject: z.boolean().default(false),
  hasAfterSchoolTeaching: z.boolean().default(false),
  hasElectiveSubject: z.boolean().default(false),
  hasLocalCurriculum: z.boolean().default(false),
  teacher_training_score: z.number().default(0),
  teacher_qualification_score: z.number().default(0), // New: 5 points per unique qualification type
  
  // ระยะเวลาการสอน
  inClassInstructionDurations: z.array(z.object({
    inClassGradeLevel: z.string().optional(),
    inClassStudentCount: z.coerce.number().optional(),
    inClassHoursPerSemester: z.coerce.number().optional(),
    inClassHoursPerYear: z.coerce.number().optional(),
  })).default([]),
  outOfClassInstructionDurations: z.array(z.object({
    outDay: z.string().optional(),
    outTimeFrom: z.string().optional(),
    outTimeTo: z.string().optional(),
    outLocation: z.string().optional(),
  })).default([]),
  teachingLocation: z.string().optional(),

  // Step 5: เครื่องดนตรี
  // ปัจจัยที่เกี่ยวข้อง
  supportFactors: z.array(supportFactorSchema).default([]),
  
  // การสนับสนุน
  hasSupportFromOrg: z.boolean().default(false),
  supportFromOrg: z.array(supportFromOrgSchema).default([]),
  support_from_org_score: z.number().default(0), // 5 คะแนนถ้าติ๊ก
  
  hasSupportFromExternal: z.boolean().default(false),
  supportFromExternal: z.array(supportFromExternalSchema).default([]),
  support_from_external_score: z.number().default(0), // 5/10/15 คะแนน
  
  // กรอบการเรียนการสอน
  curriculumFramework: z.string().optional(),
  learningOutcomes: z.string().optional(),
  managementContext: z.string().optional(),
  
  // รางวัล
  awards: z.array(awardSchema).default([]),
  award_score: z.number().default(0), // 5/10/15/20 คะแนน

  // Step 6: การสนับสนุน
  photoGalleryLink: z.string().optional(),
  videoLink: z.string().optional(),

  // Step 7: การเผยแพร่
  activitiesWithinProvinceInternal: z.array(activityWithinProvinceInternalSchema).default([]),
  activity_within_province_internal_score: z.number().default(0), // 5 คะแนนถ้า >= 3
  
  activitiesWithinProvinceExternal: z.array(activityWithinProvinceExternalSchema).default([]),
  activity_within_province_external_score: z.number().default(0), // 5 คะแนนถ้า >= 3
  
  activitiesOutsideProvince: z.array(activityOutsideProvinceSchema).default([]),
  activity_outside_province_score: z.number().default(0), // 5 คะแนนถ้า >= 3

  // Step 8: ประชาสัมพันธ์
  prActivities: z.array(prActivitySchema).default([]),
  pr_activity_score: z.number().default(0), // คะแนนถ้า >= 3
  
  // แหล่งที่มาของข้อมูล
  heardFromSchool: z.boolean().default(false),
  heardFromSchoolName: z.string().optional(),
  heardFromSchoolDistrict: z.string().optional(),
  heardFromSchoolProvince: z.string().optional(),
  DCP_PR_Channel_FACEBOOK: z.boolean().default(false),
  DCP_PR_Channel_YOUTUBE: z.boolean().default(false),
  DCP_PR_Channel_Tiktok: z.boolean().default(false),
  heardFromCulturalOffice: z.boolean().default(false),
  heardFromCulturalOfficeName: z.string().optional(),
  heardFromEducationArea: z.boolean().default(false),
  heardFromEducationAreaName: z.string().optional(),
  heardFromEducationAreaProvince: z.string().optional(),
  heardFromOther: z.boolean().default(false),
  heardFromOtherDetail: z.string().optional(),

  // ปัญหาและข้อเสนอแนะ
  obstacles: z.string().optional(),
  suggestions: z.string().optional(),

  // การรับรองข้อมูล
  certifiedINFOByAdminName: z.boolean().refine((val) => val === true, {
    message: 'กรุณายืนยันความถูกต้องของข้อมูล',
  }),
  
  // Total score
  total_score: z.number().default(0),
});

export type Register100FormData = z.infer<typeof register100Schema>;
