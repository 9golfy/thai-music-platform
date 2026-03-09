const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function cleanupOrphanedCertificates() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db(dbName);
    
    // Get all certificates
    const certificatesCollection = database.collection('certificates');
    const certificates = await certificatesCollection.find({}).toArray();
    
    console.log(`Found ${certificates.length} certificates`);
    
    if (certificates.length === 0) {
      console.log('No certificates to check');
      return;
    }

    // Get all existing school IDs from both collections
    const register100Collection = database.collection('register100_submissions');
    const registerSupportCollection = database.collection('register_support_submissions');
    
    const register100Schools = await register100Collection.find({}, { projection: { schoolId: 1, _id: 1 } }).toArray();
    const registerSupportSchools = await registerSupportCollection.find({}, { projection: { schoolId: 1, _id: 1 } }).toArray();
    
    // Create a set of valid school IDs (both schoolId field and _id)
    const validSchoolIds = new Set();
    
    register100Schools.forEach(school => {
      if (school.schoolId) validSchoolIds.add(school.schoolId);
      validSchoolIds.add(school._id.toString());
    });
    
    registerSupportSchools.forEach(school => {
      if (school.schoolId) validSchoolIds.add(school.schoolId);
      validSchoolIds.add(school._id.toString());
    });
    
    console.log(`Found ${validSchoolIds.size} valid school IDs`);
    console.log('Valid school IDs:', Array.from(validSchoolIds));
    
    // Find orphaned certificates
    const orphanedCertificates = [];
    
    for (const cert of certificates) {
      if (!validSchoolIds.has(cert.schoolId)) {
        orphanedCertificates.push(cert);
        console.log(`Orphaned certificate found: ${cert.certificateNumber} for schoolId: ${cert.schoolId}`);
      }
    }
    
    console.log(`Found ${orphanedCertificates.length} orphaned certificates`);
    
    if (orphanedCertificates.length > 0) {
      // Delete orphaned certificates
      const orphanedIds = orphanedCertificates.map(cert => cert._id);
      const deleteResult = await certificatesCollection.deleteMany({
        _id: { $in: orphanedIds }
      });
      
      console.log(`Deleted ${deleteResult.deletedCount} orphaned certificates`);
      
      // List deleted certificates
      orphanedCertificates.forEach(cert => {
        console.log(`- Deleted: ${cert.certificateNumber} (${cert.schoolName}) - schoolId: ${cert.schoolId}`);
      });
    } else {
      console.log('No orphaned certificates found');
    }
    
    // Final count
    const remainingCertificates = await certificatesCollection.countDocuments();
    console.log(`Remaining certificates: ${remainingCertificates}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

cleanupOrphanedCertificates();