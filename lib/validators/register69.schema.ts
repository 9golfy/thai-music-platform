import { z } from 'zod';

// Enums
export const schoolLevelEnum = z.enum(['ประถมศึกษา', 'มัธยมศึกษา', 'ขยายโอกาส', 'เฉพาะทาง']);
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

// Current Teaching Plan schema
const currentTeachingPlanSchema = z.object({
  gradeLevel: z.string().optional(),
  planDetails: z.string().optional(),
});

// Available Instruments schema
const availableInstrumentSchema = z.object({
  availableInstrumentsName: z.string().optional(),
  availableInstrumentsAmount: z.coerce.number().optional(),
  availableInstrumentsRemark: z.string().optional(),
});

// External Instructor schema
const externalInstructorSchema = z.object({
  extFullName: z.string().optional(),
  extPosition: z.string().optional(),
  extRole: z.string().optional(),
  extAddress: z.string().optional(),
  extPhone: z.string().optional(),
  extEmail: z.string().email('กรุณากรอก email ให้ถูกต้อง').optional().or(z.literal('')),
});

// In-Class Instruction Duration schema
const inClassInstructionDurationSchema = z.object({
  inClassGradeLevel: z.string().optional(),
  inClassStudentCount: z.coerce.number().optional(),
  inClassHoursPerSemester: z.coerce.number().optional(),
  inClassHoursPerYear: z.coerce.number().optional(),
});

// Out-of-Class Instruction Duration schema
const outOfClassInstructionDurationSchema = z.object({
  outDay: z.string().optional(),
  outTimeFrom: z.string().optional(),
  outTimeTo: z.string().optional(),
  outLocation: z.string().optional(),
});

// Support Factors schema
const supportFactorSchema = z.object({
  sup_supportByAdmin: z.string().optional(),
  sup_supportBySchoolBoard: z.string().optional(),
  sup_supportByOthers: z.string().optional(),
  sup_supportByDescription: z.string().optional(),
  sup_supportByDate: z.string().optional(),
  sup_supportByEvidenceFiles: z.any().optional(),
  sup_supportByDriveLink: z.string().optional(),
});

// Awards schema
const awardSchema = z.object({
  awardType: z.string().optional(),
  awardLevel: z.string().optional(),
  awardOrganization: z.string().optional(),
  awardDate: z.string().optional(),
  awardEvidenceLink: z.string().optional(),
});

// Video schemas
const classroomVideoSchema = z.object({
  classroomVideoLink: z.string().optional(),
});

const performanceVideoSchema = z.object({
  performanceType: z.string().optional(), // 'internal', 'external', 'online'
  performanceVideoLink: z.string().optional(),
});

// Main form schema
export const register69Schema = z.object({
  // ข้อมูลพื้นฐาน
  schoolName: z.string().min(1, 'กรุณากรอกชื่อสถานศึกษา'),
  schoolProvince: z.string().min(1, 'กรุณาเลือกจังหวัด'),
  province: z.string().optional(),
  schoolLevel: schoolLevelEnum.refine((val) => val !== undefined && val !== '', {
    message: 'กรุณาเลือกระดับการศึกษา',
  }),
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

  // ผู้บริหารสถานศึกษา
  mgtFullName: z.string().min(1, 'กรุณากรอกชื่อผู้บริหาร'),
  mgtPosition: z.string().min(1, 'กรุณากรอกตำแหน่ง'),
  mgtPhone: z.string().min(1, 'กรุณากรอกเบอร์โทรศัพท์'),
  mgtEmail: z.string().email('กรุณากรอก email ให้ถูกต้อง').optional().or(z.literal('')),
  mgtImage: z.any().optional(),

  // ผู้สอนดนตรีไทย / ผู้รับผิดชอบ
  thaiMusicTeachers: z.array(thaiMusicTeacherSchema).default([]),
  teacher_score: z.number().default(0),

  // แผนการจัดการเรียนการสอนปัจจุบัน
  currentTeachingPlans: z.array(currentTeachingPlanSchema).default([]),

  // เครื่องดนตรีไทย (array)
  availableInstruments: z.array(availableInstrumentSchema).optional().default([]),

  // วิทยากร/ครูภูมิปัญญาไทย
  externalInstructors: z.array(externalInstructorSchema).default([]),

  // ระยะเวลาการเรียนการสอนในเวลาราชการ (array)
  inClassInstructionDurations: z.array(inClassInstructionDurationSchema).optional().default([]),

  // ระยะเวลาการเรียนการสอนนอกเวลาราชการ (array)
  outOfClassInstructionDurations: z.array(outOfClassInstructionDurationSchema).optional().default([]),

  // ระยะเวลาการเรียนการสอน (legacy text fields)
  inClassInstructionDuration: z.string().optional(),
  outOfClassInstructionDuration: z.string().optional(),
  instructionLocationOverview: z.string().optional(),

  // การสนับสนุน (ปัจจัยที่เกี่ยวข้อง - array)
  supportFactors: z.array(supportFactorSchema).optional().default([]),

  // การสนับสนุน (legacy fields - kept for backward compatibility)
  sup_supportByAdminName: z.string().optional(),
  sup_supportBySchoolBoard: z.string().optional(),
  sup_supportByLocalGov: z.string().optional(),
  sup_supportByCommunity: z.string().optional(),
  sup_supportByOthers: z.string().optional(),

  // การสนับสนุน (legacy)
  supportByAdmin: z.string().optional(),
  supportBySchoolBoard: z.string().optional(),
  supportByLocalGov: z.string().optional(),
  supportByCommunity: z.string().optional(),
  supportByOthers: z.string().optional(),

  // ความสามารถผู้สอน
  teacherSkillThaiMusicMajor: z.string().optional(),
  teacherSkillOtherMajorButTrained: z.string().optional(),

  // ความเพียงพอของเครื่องดนตรี
  instrumentSufficiency: z.boolean().default(false),
  instrumentSufficiencyDetail: z.string().optional(),
  instrumentINSufficiency: z.boolean().default(false),
  instrumentINSufficiencyDetail: z.string().optional(),

  // หลักสูตรและผลลัพธ์
  curriculumFramework: z.string().optional(),
  learningOutcomes: z.string().optional(),
  managementContext: z.string().optional(),
  equipmentAndBudgetSupport: z.string().optional(),
  awardsLastYear: z.string().optional(),
  awards: z.array(awardSchema).optional().default([]),

  // ภาพและสื่อ
  mediaPhotos: z.any().optional(),
  publicityLinks: z.string().optional(),
  photoGalleryLink: z.string().optional(),
  classroomVideos: z.array(classroomVideoSchema).optional().default([]),
  performanceVideos: z.array(performanceVideoSchema).optional().default([]),

  // แหล่งที่มาของข้อมูล
  heardFromSchoolName: z.string().optional(),
  heardFromSchoolDistrict: z.string().optional(),
  heardFromSchoolProvince: z.string().optional(),
  heardFromCulturalOffice: z.string().optional(),
  heardFromEducationArea: z.string().optional(),
  heardFromEducationAreaProvince: z.string().optional(),
  DCP_PR_Channel_FACEBOOK: z.boolean().default(false),
  DCP_PR_Channel_YOUTUBE: z.boolean().default(false),
  DCP_PR_Channel_Tiktok: z.boolean().default(false),
  heardFromOther: z.boolean().default(false),
  heardFromOtherDetail: z.string().optional(),

  // ปัญหาและข้อเสนอแนะ
  obstacles: z.string().optional(),
  suggestions: z.string().optional(),

  // การรับรองข้อมูล (validated on submit only)
  certifiedINFOByAdminName: z.boolean().refine((val) => val === true, {
    message: 'กรุณายืนยันความถูกต้องของข้อมูล',
  }),
});

export type Register69FormData = z.infer<typeof register69Schema>;
