/**
 * Setup User Consents Collection
 * 
 * Creates the user_consents collection with proper indexes
 * for tracking user consent across devices.
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';

async function setupUserConsents() {
  console.log('🔧 Setting up user_consents collection...\n');
  
  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const collection = db.collection('user_consents');
    
    // Create indexes for efficient querying
    console.log('📊 Creating indexes...');
    
    // Compound index for email + submissionType (unique)
    await collection.createIndex(
      { email: 1, submissionType: 1 }, 
      { unique: true, name: 'email_submissionType_unique' }
    );
    console.log('✅ Created unique index: email + submissionType');
    
    // Index for consent date (for analytics)
    await collection.createIndex(
      { consentDate: 1 }, 
      { name: 'consentDate_index' }
    );
    console.log('✅ Created index: consentDate');
    
    // Index for consented status
    await collection.createIndex(
      { consented: 1 }, 
      { name: 'consented_index' }
    );
    console.log('✅ Created index: consented');
    
    // Check existing documents
    const count = await collection.countDocuments();
    console.log(`\n📋 Current consent records: ${count}`);
    
    if (count > 0) {
      const recent = await collection.find({})
        .sort({ consentDate: -1 })
        .limit(3)
        .toArray();
      
      console.log('\n📝 Recent consent records:');
      recent.forEach((record, index) => {
        console.log(`   ${index + 1}. ${record.email} (${record.submissionType}) - ${record.consentDate.toISOString()}`);
      });
    }
    
    console.log('\n✅ User consents collection setup complete!');
    console.log('\n📖 Collection Schema:');
    console.log('   - email: string (lowercase)');
    console.log('   - submissionType: "register100" | "register-support"');
    console.log('   - consented: boolean');
    console.log('   - consentDate: Date');
    console.log('   - ipAddress: string');
    console.log('   - userAgent: string');
    
  } catch (error) {
    console.error('❌ Error setting up user consents:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Disconnected from MongoDB');
    }
  }
}

// Run the setup
setupUserConsents().catch(console.error);