/**
 * Set OTP = 123456 for specific draft token
 */

const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const TOKEN = '4cc2b38f-d2bf-4cda-acb1-2caa464dc826';
const OTP = '123456';

async function main() {
  console.log('🔐 Generating bcrypt hash for OTP:', OTP);
  
  // Generate fresh hash
  const hashedOTP = await bcrypt.hash(OTP, 10);
  console.log('✅ Hash generated:', hashedOTP);
  
  // Test the hash
  const isValid = await bcrypt.compare(OTP, hashedOTP);
  console.log('✅ Hash validation:', isValid ? 'PASS' : 'FAIL');
  
  if (!isValid) {
    console.error('❌ Hash validation failed!');
    process.exit(1);
  }
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db('thai_music_school');
    const draftsCollection = db.collection('draft_submissions');
    
    const otpExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    
    // Find draft first
    const draft = await draftsCollection.findOne({
      token: TOKEN.toLowerCase()
    });
    
    if (!draft) {
      console.error('❌ Draft not found with token:', TOKEN);
      process.exit(1);
    }
    
    console.log('✅ Draft found:', draft._id);
    console.log('📧 Email:', draft.email);
    
    // Update with fresh hash
    const result = await draftsCollection.updateOne(
      { token: TOKEN.toLowerCase() },
      {
        $set: {
          otp: hashedOTP,
          otpPlainText: OTP,
          otpExpiresAt: otpExpiresAt,
          lastOtpRequestAt: new Date(),
          otpAttempts: 0, // Reset attempts
        },
        $inc: { otpRequestCount: 1 }
      }
    );
    
    console.log('═══════════════════════════════════════');
    console.log('✅ OTP updated successfully!');
    console.log('═══════════════════════════════════════');
    console.log('🔐 OTP CODE: ' + OTP);
    console.log('⏰ Expires at:', otpExpiresAt.toLocaleString('th-TH'));
    console.log('🔗 URL: https://dcpschool100.net/draft/' + TOKEN);
    console.log('═══════════════════════════════════════');
    console.log('Modified:', result.modifiedCount, 'document(s)');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
