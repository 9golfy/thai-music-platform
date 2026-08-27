/**
 * Search Token Across All Databases
 * 
 * Usage:
 *   mongosh "mongodb://root:rootpass@localhost:27017?authSource=admin" \
 *     --eval "var searchToken='7ade1ea6-8478-43af-a854-53ec8dfddd06'" \
 *     < scripts/search-all-databases.js
 */

// Token to search
const token = typeof searchToken !== 'undefined' ? searchToken : '7ade1ea6-8478-43af-a854-53ec8dfddd06';

print("=".repeat(70));
print(`🔍 SEARCHING TOKEN ACROSS ALL DATABASES`);
print(`Token: ${token}`);
print("=".repeat(70));

// Get all databases
const databases = db.adminCommand('listDatabases').databases;

print(`\n📊 Found ${databases.length} database(s)\n`);

let foundCount = 0;

databases.forEach((database) => {
  const dbName = database.name;
  
  // Skip system databases
  if (dbName === 'admin' || dbName === 'config' || dbName === 'local') {
    return;
  }
  
  print(`\n🔍 Searching in database: ${dbName}`);
  print("-".repeat(70));
  
  // Switch to database
  db = db.getSiblingDB(dbName);
  
  // Get all collections
  const collections = db.getCollectionNames();
  
  collections.forEach((collectionName) => {
    // Search in collection
    const result = db.getCollection(collectionName).findOne({
      $or: [
        { draftToken: token },
        { token: token }
      ]
    });
    
    if (result) {
      foundCount++;
      print(`\n✅ FOUND in collection: ${collectionName}`);
      print("=".repeat(70));
      
      // Display basic info
      print(`\n📧 BASIC INFO:`);
      print(`   Database: ${dbName}`);
      print(`   Collection: ${collectionName}`);
      print(`   Email: ${result.email || 'N/A'}`);
      print(`   Phone: ${result.phone || 'N/A'}`);
      print(`   Token: ${result.draftToken || result.token}`);
      print(`   Type: ${result.submissionType || 'N/A'}`);
      print(`   Status: ${result.status || 'N/A'}`);
      print(`   Current Step: ${result.currentStep || 'N/A'}`);
      
      // School info
      const schoolName = result.formData?.reg100_schoolName || 
                        result.formData?.regSupport_schoolName || 
                        result.schoolName ||
                        'N/A';
      const province = result.formData?.reg100_schoolProvince || 
                      result.formData?.regSupport_schoolProvince || 
                      result.province ||
                      'N/A';
      
      print(`\n🏫 SCHOOL INFO:`);
      print(`   School: ${schoolName}`);
      print(`   Province: ${province}`);
      
      // Management
      const mgmtName = result.formData?.reg100_mgtFullName || 
                      result.formData?.regSupport_mgtFullName || 
                      'N/A';
      const mgmtEmail = result.formData?.reg100_mgtEmail || 
                       result.formData?.regSupport_mgtEmail || 
                       'N/A';
      
      if (mgmtName !== 'N/A') {
        print(`\n👤 MANAGEMENT:`);
        print(`   Name: ${mgmtName}`);
        print(`   Email: ${mgmtEmail}`);
      }
      
      // Dates
      if (result.createdAt) {
        const now = new Date();
        const expiresAt = result.expiresAt ? new Date(result.expiresAt) : null;
        const daysLeft = expiresAt ? Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24)) : null;
        
        print(`\n📅 DATES:`);
        print(`   Created: ${new Date(result.createdAt).toISOString()}`);
        if (result.lastModified) {
          print(`   Last Modified: ${new Date(result.lastModified).toISOString()}`);
        }
        if (expiresAt) {
          print(`   Expires: ${expiresAt.toISOString()}`);
          if (daysLeft !== null) {
            if (daysLeft > 0) {
              print(`   Days Left: ✅ ${daysLeft} days`);
            } else {
              print(`   Days Left: ❌ Expired ${Math.abs(daysLeft)} days ago`);
            }
          }
        }
      }
      
      // OTP Info
      if (result.otpRequestCount !== undefined) {
        print(`\n📧 OTP INFO:`);
        print(`   OTP Request Count: ${result.otpRequestCount || 0}`);
        print(`   OTP Attempts: ${result.otpAttempts || 0}`);
        if (result.lastOtpRequestAt) {
          print(`   Last OTP Request: ${new Date(result.lastOtpRequestAt).toISOString()}`);
        }
      }
      
      // Stats
      if (result.saveCount !== undefined) {
        print(`\n📊 STATS:`);
        print(`   Save Count: ${result.saveCount || 0}`);
      }
      
      // Validation
      print(`\n⚠️  VALIDATION:`);
      if (result.currentStep > 7) {
        print(`   ❌ Invalid Step: ${result.currentStep} (should be 1-7)`);
      } else if (result.currentStep === 7) {
        print(`   ✅ Ready to Submit (Step 7)`);
      } else if (result.currentStep) {
        print(`   ⏳ In Progress (Step ${result.currentStep}/7)`);
      }
      
      print("\n" + "=".repeat(70));
    }
  });
});

// Summary
print("\n" + "=".repeat(70));
print("📊 SEARCH SUMMARY");
print("=".repeat(70));
print(`Token searched: ${token}`);
print(`Databases scanned: ${databases.length}`);
print(`Records found: ${foundCount}`);

if (foundCount === 0) {
  print("\n❌ Token not found in any database!");
  print("\nPossible reasons:");
  print("1. Token is incorrect or has typo");
  print("2. Draft has been deleted");
  print("3. Draft link is from different environment (dev/staging/production)");
  print("4. Database connection is to wrong server");
}

print("=".repeat(70) + "\n");
