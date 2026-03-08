/**
 * Script to delete test school data from MongoDB
 * Run with: npx ts-node scripts/delete-test-school.ts SCH-20260307-0004
 */

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';

async function deleteTestSchool(schoolId: string) {
  console.log(`🗑️  Deleting test school data for: ${schoolId}`);
  console.log('='.repeat(70));
  
  let client: MongoClient | null = null;
  
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db('thai_music_school');
    
    // Delete from register_support_submissions collection
    const supportCollection = db.collection('register_support_submissions');
    const supportResult = await supportCollection.deleteMany({ schoolId });
    console.log(`✅ Deleted ${supportResult.deletedCount} register-support submissions`);
    
    // Delete from register100_submissions collection (if exists)
    const register100Collection = db.collection('register100_submissions');
    const register100Result = await register100Collection.deleteMany({ schoolId });
    console.log(`✅ Deleted ${register100Result.deletedCount} register100 submissions`);
    
    // Delete from users collection (teacher accounts)
    const usersCollection = db.collection('users');
    const usersResult = await usersCollection.deleteMany({ schoolId });
    console.log(`✅ Deleted ${usersResult.deletedCount} user accounts`);
    
    // Delete from drafts collection (if exists)
    const draftsCollection = db.collection('drafts');
    const draftsResult = await draftsCollection.deleteMany({ 
      'formData.schoolId': schoolId 
    });
    console.log(`✅ Deleted ${draftsResult.deletedCount} draft submissions`);
    
    const totalDeleted = supportResult.deletedCount + register100Result.deletedCount + usersResult.deletedCount + draftsResult.deletedCount;
    
    if (totalDeleted === 0) {
      console.log(`⚠️  No records found for school ID: ${schoolId}`);
    } else {
      console.log(`\n🎉 Successfully deleted ${totalDeleted} total records for school: ${schoolId}`);
    }
    
  } catch (error) {
    console.error('❌ Error deleting school data:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Get school ID from command line arguments
const schoolId = process.argv[2];

if (!schoolId) {
  console.error('❌ Please provide a school ID as argument');
  console.log('Usage: npx ts-node scripts/delete-test-school.ts SCH-20260307-0004');
  process.exit(1);
}

deleteTestSchool(schoolId).catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});