/**
 * Check Draft by Email
 * 
 * This script searches for drafts by email address and displays detailed information.
 * 
 * Usage:
 *   mongosh mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin --eval "var searchEmail='user@example.com'" check-draft-by-email.js
 * 
 * Or interactively:
 *   mongosh mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin
 *   > load('check-draft-by-email.js')
 *   > checkDraftByEmail('user@example.com')
 */

use thai_music_school

function checkDraftByEmail(email) {
  if (!email) {
    print("❌ Please provide an email address");
    print("Usage: checkDraftByEmail('user@example.com')");
    return;
  }
  
  print("=".repeat(70));
  print(`🔍 SEARCHING FOR DRAFTS: ${email}`);
  print("=".repeat(70));
  
  // Search for exact match
  const drafts = db.draft_submissions.find({
    email: email
  }).toArray();
  
  if (drafts.length === 0) {
    print(`\n❌ No drafts found for email: ${email}\n`);
    
    // Try case-insensitive search
    print("🔍 Trying case-insensitive search...\n");
    const caseInsensitiveDrafts = db.draft_submissions.find({
      email: new RegExp(`^${email}$`, 'i')
    }).toArray();
    
    if (caseInsensitiveDrafts.length > 0) {
      print(`✅ Found ${caseInsensitiveDrafts.length} draft(s) with different case:\n`);
      caseInsensitiveDrafts.forEach((d, i) => {
        print(`${i + 1}. ${d.email} (Token: ${d.draftToken || d.token})`);
      });
    } else {
      // Try partial match
      print("🔍 Trying partial match...\n");
      const partialDrafts = db.draft_submissions.find({
        email: new RegExp(email.split('@')[0], 'i')
      }).toArray();
      
      if (partialDrafts.length > 0) {
        print(`✅ Found ${partialDrafts.length} similar email(s):\n`);
        partialDrafts.forEach((d, i) => {
          print(`${i + 1}. ${d.email} (Token: ${d.draftToken || d.token})`);
        });
      } else {
        print("❌ No similar emails found\n");
      }
    }
    
    print("=".repeat(70) + "\n");
    return;
  }
  
  // Display detailed information for each draft
  drafts.forEach((draft, index) => {
    if (index > 0) print("\n" + "-".repeat(70) + "\n");
    
    print(`\n📋 DRAFT #${index + 1} INFORMATION\n`);
    
    // Basic Info
    print("📧 BASIC INFO:");
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
    
    print("\n🏫 SCHOOL INFO:");
    print(`   School: ${schoolName}`);
    print(`   Province: ${province}`);
    print(`   Level: ${level}`);
    
    // Management Info
    if (draft.formData?.reg100_managementName || draft.formData?.regSupport_managementName) {
      const mgmtName = draft.formData?.reg100_managementName || 
                      draft.formData?.regSupport_managementName;
      const mgmtPosition = draft.formData?.reg100_managementPosition || 
                          draft.formData?.regSupport_managementPosition;
      const mgmtPhone = draft.formData?.reg100_managementPhone || 
                       draft.formData?.regSupport_managementPhone;
      const mgmtEmail = draft.formData?.reg100_managementEmail || 
                       draft.formData?.regSupport_managementEmail;
      
      print("\n👤 MANAGEMENT:");
      print(`   Name: ${mgmtName || 'N/A'}`);
      print(`   Position: ${mgmtPosition || 'N/A'}`);
      print(`   Phone: ${mgmtPhone || 'N/A'}`);
      print(`   Email: ${mgmtEmail || 'N/A'}`);
    }
    
    // Teachers Info
    const teachers = draft.formData?.reg100_thaiMusicTeachers || 
                    draft.formData?.regSupport_thaiMusicTeachers || 
                    [];
    
    if (teachers.length > 0) {
      print(`\n👨‍🏫 TEACHERS: ${teachers.length} person(s)`);
      teachers.forEach((teacher, i) => {
        print(`   ${i + 1}. ${teacher.name || 'N/A'} - ${teacher.position || 'N/A'}`);
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
    
    // Draft Link
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dcpschool100.net';
    print("\n🔗 DRAFT LINK:");
    print(`   ${appUrl}/draft/${draft.draftToken || draft.token}`);
  });
  
  print("\n" + "=".repeat(70) + "\n");
}

// If searchEmail is provided via --eval, run automatically
if (typeof searchEmail !== 'undefined') {
  checkDraftByEmail(searchEmail);
} else {
  print("\n📖 Function loaded: checkDraftByEmail(email)");
  print("Usage: checkDraftByEmail('user@example.com')\n");
}
