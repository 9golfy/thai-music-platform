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
  teacherAbility: z.string().optional(),
  teacherImage: z.any().optional(),
  isFromMusicInstitute: z.string().optional(),
  musicInstituteEducation: z.array(z.object({
    graduationYear: z.string().optional(),
    major: z.string().optional(),
    completionYear: z.string().optional(),
  })).optional(),
  otherEducation: z.array(z.object({
    graduationYear: z.string().optional(),
    major: z.string().optional(),
    completionYear: z.string().optional(),
  })).optional(),
});

// Support factor schema (for Step 6)
const supportFactorSchema = z.object({
  sup_supportByAdmin: z.string().optional(),
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
  reg100_schoolName: z.string().min(1, 'กรุณากรอกชื่อสถานศึกษา'),
  reg100_schoolProvince: z.string().min(1, 'กรุณาเลือกจังหวัด'),
  reg100_province: z.string().optional(),
  reg100_schoolLevel: schoolLevelEnum,
  reg100_affiliation: z.string().optional(),
  reg100_affiliationDetail: z.string().optional(),
  reg100_schoolSize: schoolSizeEnum.optional(),
  reg100_staffCount: z.coerce.number().optional(),
  reg100_studentCount: z.coerce.number().optional(),
  reg100_studentCountByGrade: z.string().optional(),
  
  // สถานที่ตั้ง
  reg100_addressNo: z.string().optional(),
  reg100_moo: z.string().optional(),
  reg100_road: z.string().optional(),
  reg100_subDistrict: z.string().optional(),
  reg100_district: z.string().optional(),
  reg100_provinceAddress: z.string().optional(),
  reg100_postalCode: z.coerce.string().optional(),
  reg100_phone: z.string().optional(),
  reg100_fax: z.string().optional(),

  // Step 2: ผู้บริหารสถานศึกษา
  reg100_mgtFullName: z.string().min(1, 'กรุณากรอกชื่อผู้บริหาร'),
  reg100_mgtPosition: z.string().min(1, 'กรุณากรอกตำแหน่ง'),
  reg100_mgtAddress: z.string().optional(),
  reg100_mgtPhone: z.string().min(1, 'กรุณากรอกเบอร์โทรศัพท์'),
  reg100_mgtEmail: z.string().email('กรุณากรอก email ให้ถูกต้อง').optional().or(z.literal('')),
  reg100_mgtImage: z.any().optional(),

  // Step 3: แผนการสอน
  reg100_currentMusicTypes: z.array(z.object({
    grade: z.string().optional(),
    details: z.string().optional(),
  })).default([]),
  reg100_readinessItems: z.array(z.object({
    instrumentName: z.string().optional(),
    quantity: z.string().optional(),
    note: z.string().optional(),
  })).default([]),

  // Step 4: ผู้สอนดนตรีไทย
  reg100_thaiMusicTeachers: z.array(thaiMusicTeacherSchema).default([]),
  
  // ระยะเวลาการสอน
  reg100_inClassInstructionDurations: z.array(z.object({
    inClassGradeLevel: z.string().optional(),
    inClassStudentCount: z.coerce.number().optional(),
    inClassHoursPerSemester: z.coerce.number().optional(),
    inClassHoursPerYear: z.coerce.number().optional(),
  })).default([]),
  reg100_outOfClassInstructionDurations: z.array(z.object({
    outDay: z.string().optional(),
    outTimeFrom: z.string().optional(),
    outTimeTo: z.string().optional(),
    outLocation: z.string().optional(),
  })).default([]),
  
  // Teacher training checkboxes (คะแนน)
  reg100_teacher_training_score: z.number().default(0),
  reg100_teacher_qualification_score: z.number().default(0), // New: 5 points per unique qualification type
  
  reg100_teachingLocation: z.string().optional(),

  // Step 5: หลักสูตร
  reg100_isCompulsorySubject: z.boolean().default(false),
  reg100_compulsoryCurriculum: z.array(z.object({
    gradeLevel: z.string().optional(),
    studentCount: z.coerce.number().optional(),
    hoursPerSemester: z.string().optional(),
    hoursPerYear: z.string().optional(),
  })).default([]),
  
  reg100_hasElectiveSubject: z.boolean().default(false),
  reg100_electiveCurriculum: z.array(z.object({
    gradeLevel: z.string().optional(),
    studentCount: z.coerce.number().optional(),
    hoursPerSemester: z.string().optional(),
    hoursPerYear: z.string().optional(),
  })).default([]),
  
  reg100_hasLocalCurriculum: z.boolean().default(false),
  reg100_localCurriculum: z.array(z.object({
    gradeLevel: z.string().optional(),
    studentCount: z.coerce.number().optional(),
    hoursPerSemester: z.string().optional(),
    hoursPerYear: z.string().optional(),
  })).default([]),
  
  reg100_hasAfterSchoolTeaching: z.boolean().default(false),
  reg100_afterSchoolSchedule: z.array(z.object({
    day: z.string().optional(),
    timeFrom: z.string().optional(),
    timeTo: z.string().optional(),
    location: z.string().optional(),
  })).default([]),

  // Step 6: เครื่องดนตรี
  // ปัจจัยที่เกี่ยวข้อง
  reg100_supportFactors: z.array(supportFactorSchema).default([]),
  
  // การสนับสนุน
  reg100_hasSupportFromOrg: z.boolean().default(false),
  reg100_supportFromOrg: z.array(supportFromOrgSchema).default([]),
  reg100_support_from_org_score: z.number().default(0), // 5 คะแนนถ้าติ๊ก
  
  reg100_hasSupportFromExternal: z.boolean().default(false),
  reg100_supportFromExternal: z.array(supportFromExternalSchema).default([]),
  reg100_support_from_external_score: z.number().default(0), // 5/10/15 คะแนน
  
  // สถานศึกษามีเครื่องดนตรีไทยเพียงพอต่อการจัดการเรียนการสอน
  reg100_hasEnoughInstruments: z.string().optional(), // "เพียงพอ" or "ไม่เพียงพอ"
  reg100_enoughInstrumentsReason: z.string().optional(),
  reg100_notEnoughInstrumentsReason: z.string().optional(),
  
  // กรอบการเรียนการสอน
  reg100_curriculumFramework: z.string().optional(),
  reg100_learningOutcomes: z.string().optional(),
  reg100_managementContext: z.string().optional(),
  
  // รางวัล
  reg100_awards: z.array(awardSchema).default([]),
  reg100_award_score: z.number().default(0), // 5/10/15/20 คะแนน

  // Step 6: การสนับสนุน
  reg100_photoGalleryLink: z.string().optional(),
  reg100_videoLink: z.string().optional(),

  // Step 7: การเผยแพร่
  reg100_activitiesWithinProvinceInternal: z.array(activityWithinProvinceInternalSchema).default([]),
  reg100_activity_within_province_internal_score: z.number().default(0), // 5 คะแนนถ้า >= 3
  
  reg100_activitiesWithinProvinceExternal: z.array(activityWithinProvinceExternalSchema).default([]),
  reg100_activity_within_province_external_score: z.number().default(0), // 5 คะแนนถ้า >= 3
  
  reg100_activitiesOutsideProvince: z.array(activityOutsideProvinceSchema).default([]),
  reg100_activity_outside_province_score: z.number().default(0), // 5 คะแนนถ้า >= 3

  // Step 8: ประชาสัมพันธ์
  reg100_prActivities: z.array(prActivitySchema).default([]),
  reg100_pr_activity_score: z.number().default(0), // คะแนนถ้า >= 3
  
  // แหล่งที่มาของข้อมูล
  reg100_heardFromSchool: z.boolean().default(false),
  reg100_heardFromSchoolName: z.string().optional(),
  reg100_heardFromSchoolDistrict: z.string().optional(),
  reg100_heardFromSchoolProvince: z.string().optional(),
  reg100_DCP_PR_Channel_FACEBOOK: z.boolean().default(false),
  reg100_DCP_PR_Channel_YOUTUBE: z.boolean().default(false),
  reg100_DCP_PR_Channel_Tiktok: z.boolean().default(false),
  reg100_heardFromCulturalOffice: z.boolean().default(false),
  reg100_heardFromCulturalOfficeName: z.string().optional(),
  reg100_heardFromEducationArea: z.boolean().default(false),
  reg100_heardFromEducationAreaName: z.string().optional(),
  reg100_heardFromEducationAreaProvince: z.string().optional(),
  reg100_heardFromOther: z.boolean().default(false),
  reg100_heardFromOtherDetail: z.string().optional(),

  // ปัญหาและข้อเสนอแนะ
  reg100_obstacles: z.string().optional(),
  reg100_suggestions: z.string().optional(),

  // การรับรองข้อมูล (required for submission)
  reg100_certifiedByAdmin: z.boolean().refine(val => val === true, {
    message: "กรุณาติ๊กถูกเพื่อรับรองว่าข้อมูลเป็นความจริง"
  }),
  
  // Total score
  reg100_total_score: z.number().default(0),
});

export type Register100FormData = z.infer<typeof register100Schema>;
