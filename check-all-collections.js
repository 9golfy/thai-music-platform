// Check all collections in database
print("📊 All Collections in Database:");
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

db.getCollectionNames().forEach(function(collectionName) {
  const count = db[collectionName].countDocuments();
  print(collectionName + ": " + count + " documents");
});

print("\n📝 Detailed Data:");
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

// Check registerSupport
print("\n1. RegisterSupport Collection:");
const registerSupportCount = db.registerSupport.countDocuments();
print("   Total: " + registerSupportCount);
if (registerSupportCount > 0) {
  print("   Sample data:");
  db.registerSupport.find().limit(3).forEach(function(doc) {
    print("   - " + doc.schoolName + " (" + doc.teacherEmail + ")");
  });
}

// Check register100
print("\n2. Register100 Collection:");
const register100Count = db.register100.countDocuments();
print("   Total: " + register100Count);
if (register100Count > 0) {
  print("   Sample data:");
  db.register100.find().limit(3).forEach(function(doc) {
    print("   - " + doc.schoolName + " (" + doc.teacherEmail + ")");
  });
}

// Check users
print("\n3. Users Collection:");
const usersCount = db.users.countDocuments();
print("   Total: " + usersCount);
db.users.find({}, {email: 1, role: 1, name: 1}).forEach(function(doc) {
  print("   - " + doc.email + " (" + doc.role + ")");
});

// Check certificates
print("\n4. Certificates Collection:");
const certificatesCount = db.certificates.countDocuments();
print("   Total: " + certificatesCount);

// Check drafts
print("\n5. Drafts Collection:");
const draftsCount = db.drafts.countDocuments();
print("   Total: " + draftsCount);
