/**
 * Fix Invalid Draft Steps
 * 
 * This script fixes drafts that have invalid currentStep values (> 7)
 * and cleans up expired drafts.
 * 
 * Usage:
 *   mongosh mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin fix-invalid-drafts.js
 */

use thai_music_school

print("=".repeat(70));
print("🔧 FIX INVALID DRAFT STEPS");
print("=".repeat(70));

// 1. Find drafts with invalid currentStep
print("\n📊 Step 1: Finding drafts with invalid currentStep (> 7)...\n");

const invalidDrafts = db.draft_submissions.find({
  currentStep: { $gt: 7 },
  status: "active"
}).toArray();

if (invalidDrafts.length === 0) {
  print("✅ No drafts with invalid currentStep found.\n");
} else {
  print(`⚠️  Found ${invalidDrafts.length} draft(s) with invalid currentStep:\n`);
  
  invalidDrafts.forEach((draft, index) => {
    print(`${index + 1}. Email: ${draft.email}`);
    print(`   Token: ${draft.draftToken || draft.token}`);
    print(`   Current Step: ${draft.currentStep} ❌`);
    print(`   School: ${draft.formData?.reg100_schoolName || draft.formData?.regSupport_schoolName || 'N/A'}`);
    print("");
  });
  
  // Fix invalid steps
  print("🔧 Fixing invalid currentStep values...\n");
  
  const fixResult = db.draft_submissions.updateMany(
    {
      currentStep: { $gt: 7 },
      status: "active"
    },
    {
      $set: {
        currentStep: 7,
        lastModified: new Date()
      }
    }
  );
  
  print(`✅ Fixed ${fixResult.modifiedCount} draft(s)\n`);
}

// 2. Clean up expired drafts
print("=".repeat(70));
print("🧹 Step 2: Cleaning up expired drafts...\n");

const now = new Date();
const expiredDrafts = db.draft_submissions.find({
  expiresAt: { $lt: now }
}).toArray();

if (expiredDrafts.length === 0) {
  print("✅ No expired drafts found.\n");
} else {
  print(`⚠️  Found ${expiredDrafts.length} expired draft(s):\n`);
  
  expiredDrafts.forEach((draft, index) => {
    const daysExpired = Math.floor((now - new Date(draft.expiresAt)) / (1000 * 60 * 60 * 24));
    print(`${index + 1}. Email: ${draft.email}`);
    print(`   Expired: ${daysExpired} day(s) ago`);
    print(`   Token: ${draft.draftToken || draft.token}`);
    print("");
  });
  
  // Delete expired drafts
  print("🗑️  Deleting expired drafts...\n");
  
  const deleteResult = db.draft_submissions.deleteMany({
    expiresAt: { $lt: now }
  });
  
  print(`✅ Deleted ${deleteResult.deletedCount} expired draft(s)\n`);
}

// 3. Show statistics
print("=".repeat(70));
print("📊 DRAFT STATISTICS");
print("=".repeat(70));

const stats = {
  total: db.draft_submissions.countDocuments({}),
  active: db.draft_submissions.countDocuments({ status: "active" }),
  submitted: db.draft_submissions.countDocuments({ status: "submitted" }),
  step7Ready: db.draft_submissions.countDocuments({ 
    currentStep: 7, 
    status: "active" 
  }),
  expiringSoon: db.draft_submissions.countDocuments({
    status: "active",
    expiresAt: { 
      $gte: now,
      $lt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) 
    }
  })
};

print("\n📈 Current Statistics:");
print(`   Total Drafts: ${stats.total}`);
print(`   Active: ${stats.active}`);
print(`   Submitted: ${stats.submitted}`);
print(`   Ready to Submit (Step 7): ${stats.step7Ready}`);
print(`   Expiring Soon (<7 days): ${stats.expiringSoon}`);

print("\n" + "=".repeat(70));
print("✅ SCRIPT COMPLETED");
print("=".repeat(70) + "\n");
