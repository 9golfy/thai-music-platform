/**
 * Generate OTP for Draft Token
 * 
 * Usage: node scripts/generate-otp-for-draft.js <token>
 * Example: node scripts/generate-otp-for-draft.js 4cc2b38f-d2bf-4cda-acb1-2caa464dc826
 */

const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hash OTP with bcrypt
async function hashOTP(otp) {
  const saltRounds = 10;
  return await bcrypt.hash(otp, saltRounds);
}

// Get OTP expiry time (10 minutes from now)
function getOTPExpiryTime() {
  return new Date(Date.now() + 10 * 60 * 1000);
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('❌ Error: Please provide a draft token');
    console.log('Usage: node scripts/generate-otp-for-draft.js <token>');
    console.log('Example: node scripts/generate-otp-for-draft.js 4cc2b38f-d2bf-4cda-acb1-2caa464dc826');
    process.exit(1);
  }
  
  const token = args[0];
  
  console.log('🔗 Token:', token);
  console.log('📡 Connecting to MongoDB...');
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('thai_music_school');
    const draftsCollection = db.collection('draft_submissions');
    
    // Find draft
    const draft = await draftsCollection.findOne({
      token: token.toLowerCase()
    });
    
    if (!draft) {
      console.error('❌ Draft not found');
      process.exit(1);
    }
    
    console.log('📧 Email:', draft.email);
    console.log('📱 Phone:', draft.phone);
    console.log('📝 Type:', draft.type);
    console.log('📊 Status:', draft.status);
    
    // Check if expired
    const now = new Date();
    if (draft.expiresAt && new Date(draft.expiresAt) < now) {
      console.log('⚠️  Warning: Draft is expired');
    }
    
    // Generate OTP
    console.log('\n🔐 Generating OTP...');
    const otp = generateOTP();
    const hashedOTP = await hashOTP(otp);
    const otpExpiresAt = getOTPExpiryTime();
    
    // Update draft with new OTP
    await draftsCollection.updateOne(
      { _id: draft._id },
      {
        $set: {
          otp: hashedOTP,
          otpExpiresAt: otpExpiresAt,
          lastOtpRequestAt: now,
          // เก็บ plain text OTP ชั่วคราวเพื่อดูได้ (จะลบหลังจาก verify)
          otpPlainText: otp,
        },
        $inc: {
          otpRequestCount: 1,
        },
      }
    );
    
    console.log('✅ OTP generated and saved to database');
    console.log('\n═══════════════════════════════════════');
    console.log('🔐 OTP CODE: ' + otp);
    console.log('═══════════════════════════════════════');
    console.log('⏰ Expires at:', otpExpiresAt.toLocaleString('th-TH'));
    console.log('🔗 Draft URL: https://dcpschool100.net/draft/' + token);
    console.log('\n📝 Instructions:');
    console.log('1. Go to: https://dcpschool100.net/draft/' + token);
    console.log('2. Enter this OTP code: ' + otp);
    console.log('3. OTP will expire in 10 minutes');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✅ MongoDB connection closed');
  }
}

main();
