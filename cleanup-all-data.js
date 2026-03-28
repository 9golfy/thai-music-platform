// Complete cleanup script - using correct collection names
print("🧹 Starting complete database cleanup...\n");

// Delete from register_support_submissions (with underscores)
const registerSupportResult = db.register_support_submissions.deleteMany({});
print("✅ register_support_submissions: " + registerSupportResult.deletedCount + " deleted");

// Delete from register100_submissions (with underscores)
const register100Result = db.register100_submissions.deleteMany({});
print("✅ register100_submissions: " + register100Result.deletedCount + " deleted");

// Delete from registerSupport (camelCase - if exists)
const registerSupportCamelResult = db.registerSupport.deleteMany({});
print("✅ registerSupport: " + registerSupportCamelResult.deletedCount + " deleted");

// Delete from register100 (camelCase - if exists)
const register100CamelResult = db.register100.deleteMany({});
print("✅ register100: " + register100CamelResult.deletedCount + " deleted");

// Delete all certificates
const certificatesResult = db.certificates.deleteMany({});
print("✅ certificates: " + certificatesResult.deletedCount + " deleted");

const templatesResult = db.certificateTemplates.deleteMany({});
print("✅ certificateTemplates: " + templatesResult.deletedCount + " deleted");

// Delete all users except System Admin
const usersResult = db.users.deleteMany({
  email: { $ne: "root@thaimusic.com" }
});
print("✅ users: " + usersResult.deletedCount + " deleted (kept System Admin)");

// Delete all drafts
const draftsResult = db.drafts.deleteMany({});
print("✅ drafts: " + draftsResult.deletedCount + " deleted");

// Show summary
print("\n📊 Database Summary After Cleanup:");
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
print("users:                           " + db.users.countDocuments());
print("register_support_submissions:    " + db.register_support_submissions.countDocuments());
print("register100_submissions:         " + db.register100_submissions.countDocuments());
print("registerSupport:                 " + db.registerSupport.countDocuments());
print("register100:                     " + db.register100.countDocuments());
print("certificates:                    " + db.certificates.countDocuments());
print("certificateTemplates:            " + db.certificateTemplates.countDocuments());
print("drafts:                          " + db.drafts.countDocuments());

// Show System Admin
print("\n👤 System Admin Account:");
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
db.users.find(
  {email: "root@thaimusic.com"},
  {email: 1, role: 1, name: 1}
).forEach(printjson);

print("\n✅ Cleanup completed successfully!");
