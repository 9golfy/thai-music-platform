/**
 * Search Draft by Token
 * 
 * Usage:
 *   mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" \
 *     --eval "var searchToken='7ade1ea6-8478-43af-a854-53ec8dfddd06'" \
 *     < scripts/search-by-token.js
 */

use thai_music_school

// Token to search
const token = typeof searchToken !== 'undefined' ? searchToken : '7ade1ea6-8478-43af-a854-53ec8dfddd06';

print("=".repeat(70));
print(`🔍 SEARCHING FOR TOKEN: ${token}`);
print("=".repeat(70));

// Search in draft_submissions
const draft = db.draft_submissions.findOne({
  $or: [
    { draftToken: token },
    { token: token }
  ]
});

if (!draft) {
  print("\n❌ Draft not found!\n");
  print("Possible reasons:");
  print("1. Token is incorrect");
  print("2. Draft has been deleted");
  print("3. Draft has been submitted and moved to submissions collection");
  print("\nTrying to search in submissions...\n");
  
  // Try to find in register100_submissions
  const reg100 = db.register100_submissions.findOne({
    $or: [
      { draftToken: token },
      { token: token }
    ]
  });
  
  if (reg100) {
    print("✅ Found in register100_submissions (Already submitted!)");
    print(`   School: ${reg100.formData?.reg100_schoolName || 'N/A'}`);
    print(`   School ID: ${reg100.schoolId}`);
    print(`   Status: ${reg100.status}`);
    print(`   Submitted: ${reg100.createdAt}`);
  } else {
    // Try to find in register_support_submissions
    const regSupport = db.register_support_submissions.findOne({
      $or: [
        { draftToken: token },
        { token: token }
      ]
    });
    
    if (regSupport) {
      print("✅ Found in register_support_submissions (Already submitted!)");
      print(`   School: ${regSupport.formData?.regSupport_schoolName || 'N/A'}`);
      print(`   School ID: ${regSupport.schoolId}`);
      print(`   Status: ${regSupport.status}`);
      print(`   Submitted: ${regSupport.createdAt}`);
    } else {
      print("❌ Not found in any collection");
    }
  }
  
  print("\n" + "=".repeat(70) + "\n");
} else {
  print("\n✅ DRAFT FOUND!\n");
  print("=".repeat(70));
  
  // Basic Info
  print("\n📧 BASIC INFO:");
  print(`   Email: ${draft.email}`);
  print(`   Phone: ${draft.phone || 'N/A'}`);
  print(`   Token: ${draft.draftToken || draft.token}`);
  print(`   Type: ${draft.submissionType}`);
  print(`   Status: ${draft.status}`);
  print(`   Current Step: ${draft.currentStep} / 7`);
  
  // School Info
  const schoolName = draft.formData?.reg100_schoolName || 
                    draft.formData?.regSupport_schoolName || 
                    'N/A';
  const province = draft.formData?.reg100_schoolProvince || 
                  draft.formData?.regSupport_schoolProvince || 
                  'N/A';
  const level = draft.formData?.reg100_schoolLevel || 
               draft.formData?.regSupport_schoolLevel || 
               'N/A';
  const studentCount = draft.formData?.reg100_studentCount || 
                      draft.formData?.regSupport_studentCount || 
                      'N/A';
  const staffCount = draft.formData?.reg100_staffCount || 
                    draft.formData?.regSupport_staffCount || 
                    'N/A';
  
  print("\n🏫 SCHOOL INFO:");
  print(`   School: ${schoolName}`);
  print(`   Province: ${province}`);
  print(`   Level: ${level}`);
  print(`   Students: ${studentCount}`);
  print(`   Staff: ${staffCount}`);
  
  // Management Info
  const mgmtName = draft.formData?.reg100_mgtFullName || 
                  draft.formData?.regSupport_mgtFullName || 
                  'N/A';
  const mgmtPosition = draft.formData?.reg100_mgtPosition || 
                      draft.formData?.regSupport_mgtPosition || 
                      'N/A';
  const mgmtPhone = draft.formData?.reg100_mgtPhone || 
                   draft.formData?.regSupport_mgtPhone || 
                   'N/A';
  const mgmtEmail = draft.formData?.reg100_mgtEmail || 
                   draft.formData?.regSupport_mgtEmail || 
                   'N/A';
  
  if (mgmtName !== 'N/A') {
    print("\n👤 MANAGEMENT:");
    print(`   Name: ${mgmtName}`);
    print(`   Position: ${mgmtPosition}`);
    print(`   Phone: ${mgmtPhone}`);
    print(`   Email: ${mgmtEmail}`);
  }
  
  // Teachers Info
  const teachers = draft.formData?.reg100_thaiMusicTeachers || 
                  draft.formData?.regSupport_thaiMusicTeachers || 
                  [];
  
  if (teachers.length > 0) {
    print(`\n👨‍🏫 TEACHERS: ${teachers.length} person(s)`);
    teachers.forEach((teacher, i) => {
      print(`   ${i + 1}. ${teacher.teacherFullName || teacher.name || 'N/A'}`);
      print(`      Position: ${teacher.teacherPosition || teacher.position || 'N/A'}`);
      print(`      Email: ${teacher.teacherEmail || teacher.email || 'N/A'}`);
      print(`      Phone: ${teacher.teacherPhone || teacher.phone || 'N/A'}`);
    });
  }
  
  // OTP Info
  print("\n📧 OTP INFO:");
  print(`   OTP Request Count: ${draft.otpRequestCount || 0}`);
  print(`   Last OTP Request: ${draft.lastOtpRequestAt ? new Date(draft.lastOtpRequestAt).toISOString() : 'N/A'}`);
  print(`   OTP Attempts: ${draft.otpAttempts || 0}`);
  print(`   OTP Expires At: ${draft.otpExpiresAt ? new Date(draft.otpExpiresAt).toISOString() : 'N/A'}`);
  
  // Dates
  const now = new Date();
  const expiresAt = new Date(draft.expiresAt);
  const daysLeft = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));
  
  print("\n📅 DATES:");
  print(`   Created: ${new Date(draft.createdAt).toISOString()}`);
  print(`   Last Modified: ${new Date(draft.lastModified).toISOString()}`);
  print(`   Expires: ${expiresAt.toISOString()}`);
  
  if (daysLeft > 0) {
    print(`   Days Left: ✅ ${daysLeft} days`);
  } else {
    print(`   Days Left: ❌ Expired ${Math.abs(daysLeft)} days ago`);
  }
  
  // Stats
  print("\n📊 STATS:");
  print(`   Save Count: ${draft.saveCount || 0}`);
  
  // Validation Issues
  print("\n⚠️  VALIDATION:");
  if (draft.currentStep > 7) {
    print(`   ❌ Invalid Step: ${draft.currentStep} (should be 1-7)`);
  } else if (draft.currentStep === 7) {
    print(`   ✅ Ready to Submit (Step 7)`);
  } else {
    print(`   ⏳ In Progress (Step ${draft.currentStep}/7)`);
  }
  
  if (draft.otpRequestCount > 10 && draft.otpAttempts === 0) {
    print(`   ⚠️  High OTP requests (${draft.otpRequestCount}) but never entered OTP`);
    print(`   💡 Suggestion: Email might be in Spam folder`);
  }
  
  if (daysLeft <= 3 && daysLeft > 0) {
    print(`   ⚠️  Expiring soon (${daysLeft} days left)`);
  }
  
  // Draft Link
  const appUrl = 'https://dcpschool100.net';
  print("\n🔗 DRAFT LINK:");
  print(`   ${appUrl}/draft/${draft.draftToken || draft.token}`);
  
  print("\n" + "=".repeat(70) + "\n");
}
