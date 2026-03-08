const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';

async function checkRegisterSupportData() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('thai_music_school');
    const collection = db.collection('register_support_submissions');
    
    // Get the specific record
    const id = '69abcc45bdfd421b3126102f';
    const submission = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!submission) {
      console.log('❌ No submission found with ID:', id);
      return;
    }
    
    console.log('\n📋 Submission Data Structure:');
    console.log('='.repeat(50));
    
    // Show all field names
    const fieldNames = Object.keys(submission).sort();
    console.log('\n🔍 All field names in the document:');
    fieldNames.forEach(field => {
      const value = submission[field];
      const type = Array.isArray(value) ? `array[${value.length}]` : typeof value;
      console.log(`  ${field}: ${type}`);
    });
    
    // Check specific fields that should be displayed
    console.log('\n📊 Key Display Fields:');
    console.log('School Name:', submission.regsup_schoolName || submission.schoolName || 'NOT FOUND');
    console.log('School Province:', submission.regsup_schoolProvince || submission.schoolProvince || 'NOT FOUND');
    console.log('School Level:', submission.regsup_schoolLevel || submission.schoolLevel || 'NOT FOUND');
    console.log('School ID:', submission.schoolId || 'NOT FOUND');
    console.log('Teacher Email:', submission.teacherEmail || 'NOT FOUND');
    console.log('Teacher Phone:', submission.teacherPhone || 'NOT FOUND');
    
    // Check score fields
    console.log('\n🎯 Score Fields:');
    console.log('Total Score:', submission.total_score || submission.regsup_total_score || 'NOT FOUND');
    console.log('Teacher Training Score:', submission.teacher_training_score || submission.regsup_teacher_training_score || 'NOT FOUND');
    console.log('Teacher Qualification Score:', submission.teacher_qualification_score || submission.regsup_teacher_qualification_score || 'NOT FOUND');
    console.log('Support Org Score:', submission.support_from_org_score || submission.regsup_support_from_org_score || 'NOT FOUND');
    console.log('Support External Score:', submission.support_from_external_score || submission.regsup_support_from_external_score || 'NOT FOUND');
    console.log('Award Score:', submission.award_score || submission.regsup_award_score || 'NOT FOUND');
    
    // Check if there are any fields with regsup_ prefix
    console.log('\n🏷️ Fields with regsup_ prefix:');
    const regsupFields = fieldNames.filter(field => field.startsWith('regsup_'));
    if (regsupFields.length > 0) {
      regsupFields.forEach(field => {
        const value = submission[field];
        const preview = typeof value === 'string' ? value.substring(0, 50) + (value.length > 50 ? '...' : '') : value;
        console.log(`  ${field}: ${preview}`);
      });
    } else {
      console.log('  No fields with regsup_ prefix found');
    }
    
    // Check teachers array
    console.log('\n👨‍🏫 Teachers Data:');
    if (submission.regsup_thaiMusicTeachers) {
      console.log(`Found ${submission.regsup_thaiMusicTeachers.length} teachers with regsup_ prefix`);
    } else if (submission.thaiMusicTeachers) {
      console.log(`Found ${submission.thaiMusicTeachers.length} teachers without prefix`);
    } else {
      console.log('No teachers data found');
    }
    
    // Check Step 8 data (PR Activities & Certification)
    console.log('\n📢 Step 8 - PR Activities & Certification:');
    console.log('PR Activities:', submission.regsup_prActivities?.length || 0, 'items');
    if (submission.regsup_prActivities && submission.regsup_prActivities.length > 0) {
      submission.regsup_prActivities.forEach((activity, index) => {
        console.log(`  ${index + 1}. ${activity.activityName || 'No name'} - ${activity.platform || 'No platform'}`);
      });
    }
    
    // Check information sources
    console.log('\n📋 Information Sources:');
    console.log('Heard from School:', submission.regsup_heardFromSchool || false);
    if (submission.regsup_heardFromSchool) {
      console.log('  School Name:', submission.regsup_heardFromSchoolName || 'Not specified');
      console.log('  School District:', submission.regsup_heardFromSchoolDistrict || 'Not specified');
      console.log('  School Province:', submission.regsup_heardFromSchoolProvince || 'Not specified');
    }
    
    console.log('Heard from Cultural Office:', submission.regsup_heardFromCulturalOffice || false);
    if (submission.regsup_heardFromCulturalOffice) {
      console.log('  Office Name:', submission.regsup_heardFromCulturalOfficeName || 'Not specified');
    }
    
    console.log('Heard from Education Area:', submission.regsup_heardFromEducationArea || false);
    if (submission.regsup_heardFromEducationArea) {
      console.log('  Area Name:', submission.regsup_heardFromEducationAreaName || 'Not specified');
      console.log('  Area Province:', submission.regsup_heardFromEducationAreaProvince || 'Not specified');
    }
    
    console.log('Heard from Other:', submission.regsup_heardFromOther || false);
    if (submission.regsup_heardFromOther) {
      console.log('  Other Detail:', submission.regsup_heardFromOtherDetail || 'Not specified');
    }
    
    // Check PR Channels
    console.log('\n📺 PR Channels:');
    console.log('Facebook:', submission.regsup_DCP_PR_Channel_FACEBOOK || false);
    console.log('YouTube:', submission.regsup_DCP_PR_Channel_YOUTUBE || false);
    console.log('TikTok:', submission.regsup_DCP_PR_Channel_Tiktok || false);
    
    // Check certification/consent
    console.log('\n✅ Certification/Consent:');
    console.log('Certified by Admin Name:', submission.regsup_certifiedINFOByAdminName || false);
    console.log('Legacy certified field:', submission.certifiedINFOByAdminName || false);
    
    // Check obstacles and suggestions
    console.log('\n💭 Feedback:');
    console.log('Obstacles:', submission.regsup_obstacles ? 'Provided' : 'Not provided');
    console.log('Suggestions:', submission.regsup_suggestions ? 'Provided' : 'Not provided');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n✅ Connection closed');
  }
}

checkRegisterSupportData();