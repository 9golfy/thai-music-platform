const { MongoClient } = require('mongodb');

// Use production MongoDB URI directly
const uri = 'mongodb://root:rootpass@mongodb:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

async function checkDeletedData() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('🔍 Checking for potentially deleted data in database...\n');
    
    const database = client.db(dbName);
    
    // Check all collections for soft delete patterns
    const collections = [
      'register100_submissions',
      'register_support_submissions', 
      'users',
      'certificates',
      'draft_submissions'
    ];
    
    for (const collectionName of collections) {
      console.log(`📊 Collection: ${collectionName}`);
      const collection = database.collection(collectionName);
      
      // Check total count
      const totalCount = await collection.countDocuments();
      console.log(`   Total documents: ${totalCount}`);
      
      // Check for soft delete patterns
      const softDeletePatterns = [
        { deleted: true },
        { isDeleted: true },
        { deletedAt: { $exists: true } },
        { status: 'deleted' },
        { active: false },
        { isActive: false }
      ];
      
      for (const pattern of softDeletePatterns) {
        const count = await collection.countDocuments(pattern);
        if (count > 0) {
          console.log(`   ⚠️  Found ${count} documents matching soft delete pattern:`, pattern);
          
          // Show sample documents
          const samples = await collection.find(pattern).limit(3).toArray();
          samples.forEach((doc, index) => {
            console.log(`      Sample ${index + 1}:`, {
              _id: doc._id,
              schoolName: doc.schoolName || doc.firstName || doc.name || 'N/A',
              createdAt: doc.createdAt || doc.submittedAt || 'N/A'
            });
          });
        }
      }
      
      // Check for documents with null/undefined critical fields (potential orphaned data)
      const orphanedCount = await collection.countDocuments({
        $or: [
          { schoolName: { $in: [null, undefined, ''] } },
          { email: { $in: [null, undefined, ''] } },
          { firstName: { $in: [null, undefined, ''] } }
        ]
      });
      
      if (orphanedCount > 0) {
        console.log(`   ⚠️  Found ${orphanedCount} potentially orphaned documents`);
      }
      
      console.log('');
    }
    
    // Check for test data that might not have been cleaned up
    console.log('🧪 Checking for test data...\n');
    
    const testPatterns = [
      { schoolName: /test|ทดสอบ|production/i },
      { email: /test|9golfy/i },
      { firstName: /test|ทดสอบ/i }
    ];
    
    for (const collectionName of collections) {
      const collection = database.collection(collectionName);
      
      for (const pattern of testPatterns) {
        const count = await collection.countDocuments(pattern);
        if (count > 0) {
          console.log(`📊 ${collectionName}: Found ${count} test documents matching:`, pattern);
          
          // Show samples
          const samples = await collection.find(pattern).limit(3).toArray();
          samples.forEach((doc, index) => {
            console.log(`   Sample ${index + 1}:`, {
              _id: doc._id,
              schoolName: doc.schoolName || doc.firstName || doc.name || 'N/A',
              email: doc.email || 'N/A',
              createdAt: doc.createdAt || doc.submittedAt || 'N/A'
            });
          });
        }
      }
    }
    
    // Check for recent deletions by looking at timestamps
    console.log('\n⏰ Checking for recent activity (last 24 hours)...\n');
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    for (const collectionName of collections) {
      const collection = database.collection(collectionName);
      
      // Check for recent creations
      const recentCreated = await collection.countDocuments({
        $or: [
          { createdAt: { $gte: yesterday } },
          { submittedAt: { $gte: yesterday } },
          { updatedAt: { $gte: yesterday } }
        ]
      });
      
      if (recentCreated > 0) {
        console.log(`📊 ${collectionName}: ${recentCreated} documents created/updated in last 24h`);
      }
    }
    
    console.log('\n✅ Data check completed!');
    
  } catch (error) {
    console.error('❌ Error checking data:', error);
  } finally {
    await client.close();
  }
}

checkDeletedData();