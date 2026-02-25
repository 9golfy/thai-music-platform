const { MongoClient } = require('mongodb');

/**
 * COMPREHENSIVE FIELD VALIDATION SCRIPT
 * 
 * This script validates that ALL fields from the register100 form
 * are correctly saved to MongoDB with no empty or missing data.
 */

const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'thai_music_school';
const COLLECTION_NAME = 'register100_submissions';

async function validateAllFields() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // Get the most recent submission
    const submission = await collection.findOne(
      { schoolName: 'โรงเรียนทดสอบครบทุกฟิลด์' },
      { sort: { _id: -1 } }
    );
    
    if (!submission) {
      console.error('❌ No submission found with schoolName "โรงเรียนทดสอบครบทุกฟิลด์"');
      return;
    }
    
    console.log('📋 Found submission ID:', submission._id.toString());
    console.log('📅 Submitted at:', submission.createdAt);
    console.log('🎯 Total Score:', submission.total_score);
    console.log('\n' + '='.repeat(80));
    console.log('VALIDATING ALL FIELDS');
    console.log('='.repeat(80) + '\n');
    
    let totalFields = 0;
    let filledFields = 0;
    let emptyFields = [];
    let errors = [];
    
    // Helper function to check if value is empty
    const isEmpty = (value) => {
      if (value === null || value === undefined) return true;
      if (typeof value === 'string' && value.trim() === '') return true;
      if (Array.isArray(value) && value.length === 0) return true;
      return false;
    };
    
    // Helper function to validate field
    const validateField = (fieldName, value, required = false) => {
      totalFields++;
      if (isEmpty(value)) {
        if (required) {
          errors.push(`❌ REQUIRED field "${fieldName}" is empty!`);
        }
        emptyFields.push(fieldName);
      } else {
        filledFields++;
        console.log(`✅ ${fieldName}: ${typeof value === 'object' ? JSON.stringify(value).substring(0, 50) + '...' : value}`);
      }
    };
    
    // Helper function to validate array field
    const validateArrayField = (fieldName, array, minItems = 0) => {
      totalFields++;
      if (!Array.isArray(array) || array.length === 0) {
        if (minItems > 0) {
          errors.push(`❌ Array field "${fieldName}" should have at least ${minItems} items`);
        }
        emptyFields.push(fieldName);
      } else {
        filledFields++;
        console.log(`✅ ${fieldName}: ${array.length} items`);
        
        // Validate each item in array
        array.forEach((item, index) => {
          Object.keys(item).forEach(key => {
            const itemFieldName = `${fieldName}[${index}].${key}`;
            validateField(itemFieldName, item[key]);
          });
        });
      }
    };
    
    console.log('\n📝 STEP 1: Basic Information');
    console.log('-'.repeat(80));
    validateField('schoolName', submission.schoolName, true);
    validateField('schoolProvince', submission.schoolProvince, true);
    validateField('schoolLevel', submission.schoolLevel, true);
    validateField('affiliation', submission.affiliation);
    validateField('staffCount', submission.staffCount);
    validateField('studentCount', submission.studentCount);
    validateField('schoolSize', submission.schoolSize);
    validateField('studentCountByGrade', submission.studentCountByGrade);
    validateField('addressNo', submission.addressNo);
    validateField('moo', submission.moo);
    validateField('road', submission.road);
    validateField('subDistrict', submission.subDistrict);
    validateField('district', submission.district);
    validateField('provinceAddress', submission.provinceAddress);
    validateField('postalCode', submission.postalCode);
    validateField('phone', submission.phone);
    validateField('fax', submission.fax);
    
    console.log('\n📝 STEP 2: School Administrator');
    console.log('-'.repeat(80));
    validateField('mgtFullName', submission.mgtFullName, true);
    validateField('mgtPosition', submission.mgtPosition, true);
    validateField('mgtPhone', submission.mgtPhone, true);
    validateField('mgtAddress', submission.mgtAddress);
    validateField('mgtEmail', submission.mgtEmail);
    validateField('mgtImage', submission.mgtImage);
    
    console.log('\n📝 STEP 3: Teaching Plan');
    console.log('-'.repeat(80));
    validateArrayField('currentMusicTypes', submission.currentMusicTypes);
    validateArrayField('readinessItems', submission.readinessItems);
    
    console.log('\n📝 STEP 4: Thai Music Teachers');
    console.log('-'.repeat(80));
    validateArrayField('thaiMusicTeachers', submission.thaiMusicTeachers);
    validateField('isCompulsorySubject', submission.isCompulsorySubject);
    validateField('hasAfterSchoolTeaching', submission.hasAfterSchoolTeaching);
    validateField('hasElectiveSubject', submission.hasElectiveSubject);
    validateField('hasLocalCurriculum', submission.hasLocalCurriculum);
    validateField('teacher_training_score', submission.teacher_training_score);
    validateField('teacher_qualification_score', submission.teacher_qualification_score);
    validateArrayField('inClassInstructionDurations', submission.inClassInstructionDurations);
    validateArrayField('outOfClassInstructionDurations', submission.outOfClassInstructionDurations);
    validateField('teachingLocation', submission.teachingLocation);
    
    console.log('\n📝 STEP 5: Support Factors and Awards');
    console.log('-'.repeat(80));
    validateArrayField('supportFactors', submission.supportFactors);
    validateField('hasSupportFromOrg', submission.hasSupportFromOrg);
    validateArrayField('supportFromOrg', submission.supportFromOrg);
    validateField('support_from_org_score', submission.support_from_org_score);
    validateField('hasSupportFromExternal', submission.hasSupportFromExternal);
    validateArrayField('supportFromExternal', submission.supportFromExternal);
    validateField('support_from_external_score', submission.support_from_external_score);
    validateField('curriculumFramework', submission.curriculumFramework);
    validateField('learningOutcomes', submission.learningOutcomes);
    validateField('managementContext', submission.managementContext);
    validateArrayField('awards', submission.awards);
    validateField('award_score', submission.award_score);
    
    console.log('\n📝 STEP 6: Photos and Videos');
    console.log('-'.repeat(80));
    validateField('photoGalleryLink', submission.photoGalleryLink);
    validateField('videoLink', submission.videoLink);
    
    console.log('\n📝 STEP 7: Activities');
    console.log('-'.repeat(80));
    validateArrayField('activitiesWithinProvinceInternal', submission.activitiesWithinProvinceInternal);
    validateField('activity_within_province_internal_score', submission.activity_within_province_internal_score);
    validateArrayField('activitiesWithinProvinceExternal', submission.activitiesWithinProvinceExternal);
    validateField('activity_within_province_external_score', submission.activity_within_province_external_score);
    validateArrayField('activitiesOutsideProvince', submission.activitiesOutsideProvince);
    validateField('activity_outside_province_score', submission.activity_outside_province_score);
    
    console.log('\n📝 STEP 8: PR and Other Information');
    console.log('-'.repeat(80));
    validateArrayField('prActivities', submission.prActivities);
    validateField('pr_activity_score', submission.pr_activity_score);
    validateField('heardFromSchool', submission.heardFromSchool);
    validateField('heardFromSchoolName', submission.heardFromSchoolName);
    validateField('heardFromSchoolDistrict', submission.heardFromSchoolDistrict);
    validateField('heardFromSchoolProvince', submission.heardFromSchoolProvince);
    validateField('DCP_PR_Channel_FACEBOOK', submission.DCP_PR_Channel_FACEBOOK);
    validateField('DCP_PR_Channel_YOUTUBE', submission.DCP_PR_Channel_YOUTUBE);
    validateField('DCP_PR_Channel_Tiktok', submission.DCP_PR_Channel_Tiktok);
    validateField('heardFromCulturalOffice', submission.heardFromCulturalOffice);
    validateField('heardFromCulturalOfficeName', submission.heardFromCulturalOfficeName);
    validateField('heardFromEducationArea', submission.heardFromEducationArea);
    validateField('heardFromEducationAreaName', submission.heardFromEducationAreaName);
    validateField('heardFromEducationAreaProvince', submission.heardFromEducationAreaProvince);
    validateField('heardFromOther', submission.heardFromOther);
    validateField('heardFromOtherDetail', submission.heardFromOtherDetail);
    validateField('obstacles', submission.obstacles);
    validateField('suggestions', submission.suggestions);
    validateField('certifiedINFOByAdminName', submission.certifiedINFOByAdminName, true);
    
    console.log('\n📊 SCORE BREAKDOWN');
    console.log('-'.repeat(80));
    console.log(`Teacher Training Score: ${submission.teacher_training_score} / 20`);
    console.log(`Teacher Qualification Score: ${submission.teacher_qualification_score} / 20`);
    console.log(`Support from Org Score: ${submission.support_from_org_score} / 5`);
    console.log(`Support from External Score: ${submission.support_from_external_score} / 15`);
    console.log(`Award Score: ${submission.award_score} / 20`);
    console.log(`Activity Internal Score: ${submission.activity_within_province_internal_score} / 5`);
    console.log(`Activity External Score: ${submission.activity_within_province_external_score} / 5`);
    console.log(`Activity Outside Score: ${submission.activity_outside_province_score} / 5`);
    console.log(`PR Activity Score: ${submission.pr_activity_score} / 5`);
    console.log(`TOTAL SCORE: ${submission.total_score} / 100`);
    
    console.log('\n' + '='.repeat(80));
    console.log('VALIDATION SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total Fields Checked: ${totalFields}`);
    console.log(`Filled Fields: ${filledFields}`);
    console.log(`Empty Fields: ${emptyFields.length}`);
    console.log(`Completion Rate: ${((filledFields / totalFields) * 100).toFixed(2)}%`);
    
    if (errors.length > 0) {
      console.log('\n❌ ERRORS FOUND:');
      errors.forEach(error => console.log(error));
    }
    
    if (emptyFields.length > 0) {
      console.log('\n⚠️  EMPTY FIELDS:');
      emptyFields.forEach(field => console.log(`  - ${field}`));
    }
    
    if (errors.length === 0 && emptyFields.length === 0) {
      console.log('\n✅ ALL FIELDS VALIDATED SUCCESSFULLY!');
      console.log('✅ 100% FIELD COMPLETION!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n✅ MongoDB connection closed');
  }
}

// Run validation
validateAllFields();

