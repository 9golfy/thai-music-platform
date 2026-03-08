/**
 * Clear Register100 Database
 * 
 * This script deletes all records from the register100 collection
 * Use before running regression tests to ensure clean state
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'registerForm';
const COLLECTION_NAME = 'register100';

async function clearRegister100DB() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Count records before deletion
    const countBefore = await collection.countDocuments();
    console.log(`📊 Found ${countBefore} records in ${COLLECTION_NAME} collection`);

    if (countBefore === 0) {
      console.log('✅ Collection is already empty');
      return;
    }

    // Ask for confirmation
    console.log('\n⚠️  WARNING: This will delete ALL records from register100 collection!');
    console.log('Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Delete all records
    console.log('🗑️  Deleting all records...');
    const result = await collection.deleteMany({});
    
    console.log(`✅ Deleted ${result.deletedCount} records`);

    // Verify deletion
    const countAfter = await collection.countDocuments();
    console.log(`📊 Records remaining: ${countAfter}`);

    if (countAfter === 0) {
      console.log('\n✅ Database cleared successfully!');
      console.log('🧪 Ready for regression testing');
    } else {
      console.log('\n⚠️  Warning: Some records may still remain');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
clearRegister100DB();
