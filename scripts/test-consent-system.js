/**
 * Test Consent System
 * 
 * Tests the cross-device consent tracking system
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';

async function testConsentSystem() {
  console.log('🧪 Testing Consent System...\n');
  
  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const consentsCollection = db.collection('user_consents');
    
    // Test email
    const testEmail = '9golfy@gmail.com';
    const submissionType = 'register100';
    
    console.log(`\n🔍 Checking consent for: ${testEmail}`);
    
    // Check current consent status
    const existingConsent = await consentsCollection.findOne({
      email: testEmail.toLowerCase(),
      submissionType,
      consented: true,
    });
    
    if (existingConsent) {
      console.log('✅ User has previously consented');
      console.log(`   📅 Consent Date: ${existingConsent.consentDate}`);
      console.log(`   🌐 IP Address: ${existingConsent.ipAddress}`);
      console.log(`   🖥️  User Agent: ${existingConsent.userAgent?.substring(0, 50)}...`);
    } else {
      console.log('❌ User has not consented yet');
      
      // Simulate saving consent
      console.log('\n💾 Simulating consent save...');
      const consentRecord = {
        email: testEmail.toLowerCase(),
        submissionType,
        consented: true,
        consentDate: new Date(),
        ipAddress: '127.0.0.1',
        userAgent: 'Test Script',
      };
      
      await consentsCollection.updateOne(
        { 
          email: testEmail.toLowerCase(), 
          submissionType 
        },
        { 
          $set: consentRecord 
        },
        { 
          upsert: true 
        }
      );
      
      console.log('✅ Consent saved successfully');
    }
    
    // Show all consents for this email
    const allConsents = await consentsCollection.find({
      email: testEmail.toLowerCase()
    }).toArray();
    
    console.log(`\n📋 All consents for ${testEmail}:`);
    if (allConsents.length === 0) {
      console.log('   (No consents found)');
    } else {
      allConsents.forEach((consent, index) => {
        console.log(`   ${index + 1}. ${consent.submissionType} - ${consent.consentDate.toISOString()}`);
      });
    }
    
    console.log('\n🧪 TEST SCENARIOS:');
    console.log('─'.repeat(50));
    console.log('1. FIRST TIME USER (new browser/device):');
    console.log('   - ConsentModal should appear');
    console.log('   - After clicking "ยอมรับ", consent saved to DB');
    console.log('   - Modal disappears');
    
    console.log('\n2. RETURNING USER (same browser):');
    console.log('   - localStorage has consent = true');
    console.log('   - ConsentModal should NOT appear');
    
    console.log('\n3. RETURNING USER (different browser/device):');
    console.log('   - localStorage empty, but DB has consent record');
    console.log('   - ConsentModal should NOT appear');
    console.log('   - Consent status copied to localStorage');
    
    console.log('\n4. DRAFT RESTORATION (incognito/new device):');
    console.log('   - User enters OTP, gets draft data');
    console.log('   - ConsentModal checks DB using email from draft');
    console.log('   - If consented before, modal skipped');
    console.log('   - Form shows with restored data immediately');
    
    console.log('\n✅ Expected Behavior:');
    console.log('- Users only see consent modal ONCE per submission type');
    console.log('- Consent persists across all devices and browsers');
    console.log('- Draft restoration works seamlessly without consent interruption');
    
  } catch (error) {
    console.error('❌ Error testing consent system:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Run the test
testConsentSystem().catch(console.error);