// Step-to-fields mapping for per-step validation
// This ensures "ถัดไป" validates only the current step's fields

import { Register69FormData } from '@/lib/validators/register69.schema';

export type StepFieldKey = keyof Register69FormData;

export const STEP_FIELDS: Record<number, StepFieldKey[]> = {
  1: [
    // ข้อมูลพื้นฐาน
    'schoolName',
    'province',
    'schoolLevel',
    'affiliation',
    'schoolSize',
    'staffCount',
    'studentCount',
    'studentCountByGrade',
    // สถานที่ตั้ง
    'addressNo',
    'moo',
    'road',
    'subDistrict',
    'district',
    'provinceAddress',
    'postalCode',
    'phone',
    'fax',
  ],
  2: [
    // ผู้บริหารสถานศึกษา
    'mgtFullName',
    'mgtPosition',
    'mgtPhone',
    'mgtEmail',
  ],
  3: [
    // ผู้สอนดนตรีไทย / ผู้รับผิดชอบ
    'thaiMusicTeachers',
  ],
  4: [
    // แผนการจัดการเรียนการสอนปัจจุบัน
    'currentTeachingPlans',
    // ระยะเวลาการเรียนการสอน
    'inClassInstructionDuration',
    'outOfClassInstructionDuration',
    'instructionLocationOverview',
  ],
  5: [
    // เครื่องดนตรีไทย
    'availableInstruments',
    // ความเพียงพอของเครื่องดนตรี
    'instrumentSufficiency',
    'instrumentSufficiencyDetail',
    'instrumentINSufficiency',
    'instrumentINSufficiencyDetail',
    // วิทยากร/ครูภูมิปัญญาไทย
    'externalInstructors',
  ],
  6: [
    // การสนับสนุน
    'supportByAdmin',
    'supportBySchoolBoard',
    'supportByLocalGov',
    'supportByCommunity',
    'supportByOthers',
    // ความสามารถผู้สอน
    'teacherSkillThaiMusicMajor',
    'teacherSkillOtherMajorButTrained',
    // หลักสูตรและผลลัพธ์
    'curriculumFramework',
    'learningOutcomes',
    'managementContext',
    'equipmentAndBudgetSupport',
    'awardsLastYear',
    // ปัญหาและข้อเสนอแนะ
    'obstacles',
    'suggestions',
  ],
  7: [
    // ภาพและสื่อ
    'mediaPhotos',
    'publicityLinks',
    // แหล่งที่มาของข้อมูล
    'heardFromSchoolName',
    'heardFromSchoolDistrict',
    'heardFromSchoolProvince',
    'DCP_PR_Channel_FACEBOOK',
    'DCP_PR_Channel_YOUTUBE',
    'DCP_PR_Channel_Tiktok',
    'heardFromOther',
    'heardFromOtherDetail',
    // การรับรองข้อมูล
    'certifiedINFOByAdminName',
  ],
};

export const STEP_TITLES = [
  { number: 1, title: 'ข้อมูลพื้นฐาน' },
  { number: 2, title: 'ผู้บริหาร' },
  { number: 3, title: 'ผู้สอนดนตรีไทย' },
  { number: 4, title: 'แผนการสอน' },
  { number: 5, title: 'เครื่องดนตรี' },
  { number: 6, title: 'การสนับสนุน' },
  { number: 7, title: 'ประชาสัมพันธ์' },
];
