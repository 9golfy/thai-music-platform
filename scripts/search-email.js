/**
 * Search Email Across All Collections
 * 
 * Usage:
 *   mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" \
 *     --eval "var searchEmail='sawvakon05012561@gmail.com'" \
 *     < scripts/search-email.js
 */

use thai_music_school

// Email to search
const email = typeof searchEmail !== 'undefined' ? searchEmail : 'sawvakon05012561@gmail.com';

print("=".repeat(70));
print(`🔍 SEARCHING FOR EMAIL: ${email}`);
print("=".repeat(70));

// 1. Search in draft_submissions
print("\n📋 1. Searching in draft_submissions...\n");
const drafts = db.draft_submissions.find({
  email: email
}).toArray();

if (drafts.length > 0) {
  print(`✅ Found ${drafts.length} record(s) in draft_submissions:\n`);
  drafts.forEach((d, i) => {
    print(`${i + 1}. Token: ${d.draftToken || d.token}`);
    print(`   Type: ${d.submissionType}`);
    print(`   Status: ${d.status}`);
    print(`   Current Step: ${d.currentStep}`);
    print(`   School: ${d.formData?.reg100_schoolName || d.formData?.regSupport_schoolName || 'N/A'}`);
    print(`   Created: ${d.createdAt}`);
    print(`   Expires: ${d.expiresAt}`);
    print("");
  });
} else {
  print("❌ Not found in draft_submissions\n");
}

// 2. Search in register100_submissions
print("📋 2. Searching in register100_submissions...\n");
const reg100 = db.register100_submissions.find({
  $or: [
    { email: email },
    { 'formData.reg100_mgtEmail': email },
    { 'formData.reg100_thaiMusicTeachers.teacherEmail': email }
  ]
}).toArray();

if (reg100.length > 0) {
  print(`✅ Found ${reg100.length} record(s) in register100_submissions:\n`);
  reg100.forEach((r, i) => {
    print(`${i + 1}. School ID: ${r.schoolId}`);
    print(`   School: ${r.formData?.reg100_schoolName || 'N/A'}`);
    print(`   Status: ${r.status}`);
    print(`   Email: ${r.email || 'N/A'}`);
    print(`   Management Email: ${r.formData?.reg100_mgtEmail || 'N/A'}`);
    print(`   Created: ${r.createdAt}`);
    print("");
  });
} else {
  print("❌ Not found in register100_submissions\n");
}

// 3. Search in register_support_submissions
print("📋 3. Searching in register_support_submissions...\n");
const regSupport = db.register_support_submissions.find({
  $or: [
    { email: email },
    { 'formData.regSupport_mgtEmail': email },
    { 'formData.regSupport_thaiMusicTeachers.teacherEmail': email }
  ]
}).toArray();

if (regSupport.length > 0) {
  print(`✅ Found ${regSupport.length} record(s) in register_support_submissions:\n`);
  regSupport.forEach((r, i) => {
    print(`${i + 1}. School ID: ${r.schoolId}`);
    print(`   School: ${r.formData?.regSupport_schoolName || 'N/A'}`);
    print(`   Status: ${r.status}`);
    print(`   Email: ${r.email || 'N/A'}`);
    print(`   Management Email: ${r.formData?.regSupport_mgtEmail || 'N/A'}`);
    print(`   Created: ${r.createdAt}`);
    print("");
  });
} else {
  print("❌ Not found in register_support_submissions\n");
}

// 4. Search in users
print("📋 4. Searching in users...\n");
const users = db.users.find({
  email: email
}).toArray();

if (users.length > 0) {
  print(`✅ Found ${users.length} record(s) in users:\n`);
  users.forEach((u, i) => {
    print(`${i + 1}. Name: ${u.firstName} ${u.lastName}`);
    print(`   Email: ${u.email}`);
    print(`   Role: ${u.role}`);
    print(`   School ID: ${u.schoolId || 'N/A'}`);
    print(`   Active: ${u.isActive}`);
    print(`   Created: ${u.createdAt}`);
    print("");
  });
} else {
  print("❌ Not found in users\n");
}

// 5. Try case-insensitive search
print("=".repeat(70));
print("🔍 Trying case-insensitive search...\n");

const draftsCaseInsensitive = db.draft_submissions.find({
  email: new RegExp(`^${email}$`, 'i')
}).toArray();

if (draftsCaseInsensitive.length > 0 && draftsCaseInsensitive.length !== drafts.length) {
  print(`✅ Found ${draftsCaseInsensitive.length} additional record(s) with different case:\n`);
  draftsCaseInsensitive.forEach((d, i) => {
    print(`${i + 1}. Email: ${d.email}`);
    print(`   Token: ${d.draftToken || d.token}`);
    print("");
  });
}

// 6. Try partial match
print("=".repeat(70));
print("🔍 Trying partial match (username part)...\n");

const username = email.split('@')[0];
const partialMatches = db.draft_submissions.find({
  email: new RegExp(username, 'i')
}).toArray();

if (partialMatches.length > 0) {
  print(`✅ Found ${partialMatches.length} similar email(s):\n`);
  partialMatches.forEach((d, i) => {
    print(`${i + 1}. Email: ${d.email}`);
    print(`   Token: ${d.draftToken || d.token}`);
    print(`   School: ${d.formData?.reg100_schoolName || d.formData?.regSupport_schoolName || 'N/A'}`);
    print("");
  });
} else {
  print("❌ No similar emails found\n");
}

// Summary
print("=".repeat(70));
print("📊 SEARCH SUMMARY");
print("=".repeat(70));
print(`Email searched: ${email}`);
print(`Draft submissions: ${drafts.length}`);
print(`Register100 submissions: ${reg100.length}`);
print(`Register-support submissions: ${regSupport.length}`);
print(`Users: ${users.length}`);
print(`Total found: ${drafts.length + reg100.length + regSupport.length + users.length}`);
print("=".repeat(70) + "\n");
