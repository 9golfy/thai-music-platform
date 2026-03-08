// MongoDB Initialization Script
// This script runs when MongoDB container starts for the first time

print('🚀 Initializing Thai Music School Database...');

// Switch to the application database
db = db.getSiblingDB('thai_music_school');

// Create collections with proper indexes
print('📋 Creating collections and indexes...');

// Users collection with indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "schoolId": 1 });

// Submissions collections
db.register_support_submissions.createIndex({ "email": 1, "submissionType": 1 }, { unique: true });
db.register100_submissions.createIndex({ "email": 1, "submissionType": 1 }, { unique: true });

// Draft submissions
db.draft_submissions.createIndex({ "email": 1, "submissionType": 1 }, { unique: true });
db.draft_submissions.createIndex({ "draftToken": 1 }, { unique: true });
db.draft_submissions.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

// Certificates
db.certificates.createIndex({ "certificateNumber": 1 }, { unique: true });
db.certificates.createIndex({ "schoolId": 1 });

// User consents
db.user_consents.createIndex({ "email": 1 }, { unique: true });
db.user_consents.createIndex({ "consentDate": 1 });
db.user_consents.createIndex({ "consented": 1 });

print('✅ Database initialization completed!');

// Load data if backup files exist
const fs = require('fs');
const dataPath = '/docker-entrypoint-initdb.d/data';

try {
  if (fs.existsSync(dataPath)) {
    print('📥 Loading backup data...');
    
    // Load each collection
    const collections = [
      'users',
      'register_support_submissions', 
      'register100_submissions',
      'draft_submissions',
      'certificates',
      'certificate_templates',
      'user_consents'
    ];
    
    collections.forEach(collectionName => {
      const bsonFile = `${dataPath}/${collectionName}.bson`;
      if (fs.existsSync(bsonFile)) {
        print(`📄 Loading ${collectionName}...`);
        // Note: BSON files need to be restored using mongorestore
        // This script handles JSON files only
      }
      
      const jsonFile = `${dataPath}/${collectionName}.json`;
      if (fs.existsSync(jsonFile)) {
        print(`📄 Loading ${collectionName} from JSON...`);
        const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
        if (Array.isArray(data) && data.length > 0) {
          db[collectionName].insertMany(data);
          print(`✅ Loaded ${data.length} documents into ${collectionName}`);
        }
      }
    });
  }
} catch (error) {
  print(`⚠️ Data loading error: ${error.message}`);
}

print('🎉 Thai Music School Database ready!');