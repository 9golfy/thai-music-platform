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
export const registerSupportSchema = z.object({
  // Step 1: ประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย
  regsup_supportType: z.enum(['สถานศึกษา', 'ชุมนุม', 'ชมรม', 'กลุ่ม', 'วงดนตรีไทย']).optional(),
  regsup_supportTypeName: z.string().optional(), // Keep for backward compatibility
  // NEW: Separate fields for each support type
  regsup_supportTypeSchoolName: z.string().optional(),
  regsup_supportTypeClubName: z.string().optional(),
  regsup_supportTypeAssociationName: z.string().optional(),
  regsup_supportTypeGroupName: z.string().optional(),
  regsup_supportTypeBandName: z.string().optional(),
  regsup_supportTypeMemberCount: z.coerce.number().optional(),
  
  // Step 1: ข้อมูลพื้นฐาน
  regsup_schoolName: z.string().min(1, 'กรุณากรอกชื่อสถานศึกษา'),
  regsup_schoolProvince: z.string().min(1, 'กรุณาเลือกจังหวัด'),
  regsup_province: z.string().optional(),
  regsup_schoolLevel: schoolLevelEnum,
  regsup_affiliation: z.string().optional(),
  regsup_affiliationDetail: z.string().optional(),
  regsup_schoolSize: schoolSizeEnum.optional(),
  regsup_staffCount: z.coerce.number().optional(),
  regsup_studentCount: z.coerce.number().optional(),
  regsup_studentCountByGrade: z.string().optional(),
  
  // สถานที่ตั้ง
  regsup_addressNo: z.string().optional(),
  regsup_moo: z.string().optional(),
  regsup_road: z.string().optional(),
  regsup_subDistrict: z.string().optional(),
  regsup_district: z.string().optional(),
  regsup_provinceAddress: z.string().optional(),
  regsup_postalCode: z.coerce.string().optional(),
  regsup_phone: z.string().optional(),
  regsup_fax: z.string().optional(),

  // Step 2: ผู้บริหารสถานศึกษา
  regsup_mgtFullName: z.string().min(1, 'กรุณากรอกชื่อผู้บริหาร'),
  regsup_mgtPosition: z.string().min(1, 'กรุณากรอกตำแหน่ง'),
  regsup_mgtAddress: z.string().optional(),
  regsup_mgtPhone: z.string().min(1, 'กรุณากรอกเบอร์โทรศัพท์'),
  regsup_mgtEmail: z.string().email('กรุณากรอก email ให้ถูกต้อง').optional().or(z.literal('')),
  regsup_mgtImage: z.any().optional(),

  // Step 3: แผนการสอน
  regsup_readinessItems: z.array(z.object({
    instrumentName: z.string().optional(),
    quantity: z.string().optional(),
    note: z.string().optional(),
  })).default([]),

  // Step 4: ผู้สอนดนตรีไทย
  regsup_thaiMusicTeachers: z.array(thaiMusicTeacherSchema).default([]),
  
  // Teacher training checkboxes (คะแนน)
  regsup_isCompulsorySubject: z.boolean().default(false),
  regsup_hasAfterSchoolTeaching: z.boolean().default(false),
  regsup_hasElectiveSubject: z.boolean().default(false),
  regsup_hasLocalCurriculum: z.boolean().default(false),
  regsup_teacher_training_score: z.number().default(0),
  regsup_teacher_qualification_score: z.number().default(0), // New: 5 points per unique qualification type
  
  // ระยะเวลาการสอน
  regsup_inClassInstructionDurations: z.array(z.object({
    inClassGradeLevel: z.string().optional(),
    inClassStudentCount: z.coerce.number().optional(),
    inClassHoursPerSemester: z.coerce.number().optional(),
    inClassHoursPerYear: z.coerce.number().optional(),
  })).default([]),
  regsup_outOfClassInstructionDurations: z.array(z.object({
    outDay: z.string().optional(),
    outTimeFrom: z.string().optional(),
    outTimeTo: z.string().optional(),
    outLocation: z.string().optional(),
  })).default([]),
  regsup_teachingLocation: z.string().optional(),

  // Step 5: เครื่องดนตรี
  // ปัจจัยที่เกี่ยวข้อง
  regsup_supportFactors: z.array(supportFactorSchema).default([]),
  
  // การสนับสนุน
  regsup_hasSupportFromOrg: z.boolean().default(false),
  regsup_supportFromOrg: z.array(supportFromOrgSchema).default([]),
  regsup_support_from_org_score: z.number().default(0), // 5 คะแนนถ้าติ๊ก
  
  regsup_hasSupportFromExternal: z.boolean().default(false),
  regsup_supportFromExternal: z.array(supportFromExternalSchema).default([]),
  regsup_support_from_external_score: z.number().default(0), // 5/10/15 คะแนน
  
  // สถานศึกษามีเครื่องดนตรีไทยเพียงพอต่อการจัดการเรียนการสอน
  regsup_hasEnoughInstruments: z.string().optional(), // "เพียงพอ" or "ไม่เพียงพอ"
  regsup_enoughInstrumentsReason: z.string().optional(),
  regsup_notEnoughInstrumentsReason: z.string().optional(),
  
  // กรอบการเรียนการสอน
  regsup_curriculumFramework: z.string().optional(),
  regsup_learningOutcomes: z.string().optional(),
  regsup_managementContext: z.string().optional(),
  
  // รางวัล
  regsup_awards: z.array(awardSchema).default([]),
  regsup_award_score: z.number().default(0), // 5/10/15/20 คะแนน

  // Step 6: การสนับสนุน
  regsup_photoGalleryLink: z.string().optional(),
  regsup_videoLink: z.string().optional(),

  // Step 7: การเผยแพร่
  regsup_activitiesWithinProvinceInternal: z.array(activityWithinProvinceInternalSchema).default([]),
  regsup_activity_within_province_internal_score: z.number().default(0), // 5 คะแนนถ้า >= 3
  
  regsup_activitiesWithinProvinceExternal: z.array(activityWithinProvinceExternalSchema).default([]),
  regsup_activity_within_province_external_score: z.number().default(0), // 5 คะแนนถ้า >= 3
  
  regsup_activitiesOutsideProvince: z.array(activityOutsideProvinceSchema).default([]),
  regsup_activity_outside_province_score: z.number().default(0), // 5 คะแนนถ้า >= 3

  // Step 8: ประชาสัมพันธ์
  regsup_prActivities: z.array(prActivitySchema).default([]),
  regsup_pr_activity_score: z.number().default(0), // คะแนนถ้า >= 3
  
  // แหล่งที่มาของข้อมูล
  regsup_heardFromSchool: z.boolean().default(false),
  regsup_heardFromSchoolName: z.string().optional(),
  regsup_heardFromSchoolDistrict: z.string().optional(),
  regsup_heardFromSchoolProvince: z.string().optional(),
  regsup_DCP_PR_Channel_FACEBOOK: z.boolean().default(false),
  regsup_DCP_PR_Channel_YOUTUBE: z.boolean().default(false),
  regsup_DCP_PR_Channel_Tiktok: z.boolean().default(false),
  regsup_heardFromCulturalOffice: z.boolean().default(false),
  regsup_heardFromCulturalOfficeName: z.string().optional(),
  regsup_heardFromEducationArea: z.boolean().default(false),
  regsup_heardFromEducationAreaName: z.string().optional(),
  regsup_heardFromEducationAreaProvince: z.string().optional(),
  regsup_heardFromOther: z.boolean().default(false),
  regsup_heardFromOtherDetail: z.string().optional(),

  // ปัญหาและข้อเสนอแนะ
  regsup_obstacles: z.string().optional(),
  regsup_suggestions: z.string().optional(),

  // การรับรองข้อมูล - Use custom validation in onSubmit instead of zod
  regsup_certifiedByAdmin: z.boolean().optional(),
  
  // Total score
  regsup_total_score: z.number().default(0),
});

export type RegisterSupportFormData = z.infer<typeof registerSupportSchema>;
