require('dotenv').config();
const { MongoClient } = require('mongodb');

// Use localhost instead of docker container name for local scripts
const uri = 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

async function deleteExistingEmails() {
  console.log('🗑️ Deleting existing test email accounts...\n');

  const testEmails = [
    'kaibandon2021@gmail.com',
    'thaimusicplatform@gmail.com'
  ];

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db(dbName);
    
    // Delete users with test emails
    const usersCollection = database.collection('users');
    
    for (const email of testEmails) {
      console.log(`🔍 Looking for user with email: ${email}`);
      
      const user = await usersCollection.findOne({ email: email });
      if (user) {
        console.log(`👤 Found user: ${user.email} (School ID: ${user.schoolId})`);
        
        // Delete associated submissions
        if (user.schoolId) {
          // Delete register100 submissions
          const register100Collection = database.collection('register100_submissions');
          const register100Result = await register100Collection.deleteMany({ schoolId: user.schoolId });
          console.log(`📋 Deleted ${register100Result.deletedCount} register100 submissions`);
          
          // Delete register-support submissions
          const registerSupportCollection = database.collection('register_support_submissions');
          const registerSupportResult = await registerSupportCollection.deleteMany({ schoolId: user.schoolId });
          console.log(`📋 Deleted ${registerSupportResult.deletedCount} register-support submissions`);
          
          // Delete certificates
          const certificatesCollection = database.collection('certificates');
          const certificatesResult = await certificatesCollection.deleteMany({ schoolId: user.schoolId });
          console.log(`🏆 Deleted ${certificatesResult.deletedCount} certificates`);
        }
        
        // Delete the user
        const userResult = await usersCollection.deleteOne({ email: email });
        console.log(`👤 Deleted ${userResult.deletedCount} user account`);
        
      } else {
        console.log(`❌ No user found with email: ${email}`);
      }
      console.log('');
    }
    
    // Also delete any orphaned data
    console.log('🧹 Cleaning up orphaned data...');
    
    // Delete any submissions without valid schoolId
    const register100Collection = database.collection('register100_submissions');
    const orphanedRegister100 = await register100Collection.deleteMany({ 
      $or: [
        { schoolId: { $exists: false } },
        { schoolId: null },
        { schoolId: '' }
      ]
    });
    console.log(`🗑️ Deleted ${orphanedRegister100.deletedCount} orphaned register100 submissions`);
    
    const registerSupportCollection = database.collection('register_support_submissions');
    const orphanedRegisterSupport = await registerSupportCollection.deleteMany({ 
      $or: [
        { schoolId: { $exists: false } },
        { schoolId: null },
        { schoolId: '' }
      ]
    });
    console.log(`🗑️ Deleted ${orphanedRegisterSupport.deletedCount} orphaned register-support submissions`);
    
    console.log('\n✅ Cleanup completed!');
    
    // Show remaining data
    const remainingUsers = await usersCollection.countDocuments({ role: 'teacher' });
    const remainingRegister100 = await register100Collection.countDocuments();
    const remainingRegisterSupport = await registerSupportCollection.countDocuments();
    const remainingCertificates = await database.collection('certificates').countDocuments();
    
    console.log('\n📊 Remaining data:');
    console.log(`👥 Teacher users: ${remainingUsers}`);
    console.log(`📋 Register100 submissions: ${remainingRegister100}`);
    console.log(`📋 Register-support submissions: ${remainingRegisterSupport}`);
    console.log(`🏆 Certificates: ${remainingCertificates}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

deleteExistingEmails();