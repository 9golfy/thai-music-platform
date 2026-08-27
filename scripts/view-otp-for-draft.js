/**
 * View OTP for Draft Token
 * 
 * ดูรหัส OTP ที่บันทึกไว้ใน database (ถ้ามี otpPlainText field)
 * 
 * Usage: node scripts/view-otp-for-draft.js <token>
 * Example: node scripts/view-otp-for-draft.js 4cc2b38f-d2bf-4cda-acb1-2caa464dc826
 */

const { MongoClient } = require('mongodb');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('❌ Error: Please provide a draft token');
    console.log('Usage: node scripts/view-otp-for-draft.js <token>');
    console.log('Example: node scripts/view-otp-for-draft.js 4cc2b38f-d2bf-4cda-acb1-2caa464dc826');
    process.exit(1);
  }
  
  const token = args[0];
  
  console.log('🔗 Token:', token);
  console.log('📡 Connecting to MongoDB...');
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db('thai_music_school');
    const draftsCollection = db.collection('draft_submissions');
    
    // Find draft
    const draft = await draftsCollection.findOne(
      { token: token.toLowerCase() },
      {
        projection: {
          email: 1,
          phone: 1,
          type: 1,
          status: 1,
          otp: 1,
          otpPlainText: 1,
          otpExpiresAt: 1,
          otpRequestCount: 1,
          lastOtpRequestAt: 1,
          expiresAt: 1,
          createdAt: 1,
        }
      }
    );
    
    if (!draft) {
      console.error('❌ Draft not found');
      process.exit(1);
    }
    
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:', draft.email);
    console.log('📱 Phone:', draft.phone);
    console.log('📝 Type:', draft.type);
    console.log('📊 Status:', draft.status);
    console.log('═══════════════════════════════════════\n');
    
    // Check if draft expired
    const now = new Date();
    if (draft.expiresAt && new Date(draft.expiresAt) < now) {
      console.log('⚠️  Draft is EXPIRED');
      console.log('    Created:', new Date(draft.createdAt).toLocaleString('th-TH'));
      console.log('    Expired:', new Date(draft.expiresAt).toLocaleString('th-TH'));
    } else {
      console.log('✅ Draft is ACTIVE');
      console.log('    Expires:', new Date(draft.expiresAt).toLocaleString('th-TH'));
    }
    
    console.log('\n═══════════════════════════════════════');
    console.log('           OTP INFORMATION');
    console.log('═══════════════════════════════════════\n');
    
    // Check if OTP exists
    if (!draft.otp) {
      console.log('❌ No OTP has been generated yet');
      console.log('\n💡 Generate OTP with:');
      console.log('   node scripts/generate-otp-for-draft.js ' + token);
    } else {
      // Check if OTP expired
      const otpExpired = draft.otpExpiresAt && new Date(draft.otpExpiresAt) < now;
      
      if (otpExpired) {
        console.log('⚠️  OTP is EXPIRED');
        console.log('    Expired at:', new Date(draft.otpExpiresAt).toLocaleString('th-TH'));
        console.log('\n💡 Generate new OTP with:');
        console.log('   node scripts/generate-otp-for-draft.js ' + token);
      } else {
        console.log('✅ OTP is ACTIVE');
        console.log('    Expires at:', new Date(draft.otpExpiresAt).toLocaleString('th-TH'));
        
        const timeLeft = Math.ceil((new Date(draft.otpExpiresAt) - now) / (60 * 1000));
        console.log('    Time left:', timeLeft, 'minutes');
      }
      
      console.log('\n🔐 OTP Hash (bcrypt):', draft.otp.substring(0, 20) + '...');
      
      // Check if plain text OTP is available
      if (draft.otpPlainText) {
        console.log('\n═══════════════════════════════════════');
        console.log('🔐 OTP CODE: ' + draft.otpPlainText);
        console.log('═══════════════════════════════════════');
        
        if (otpExpired) {
          console.log('\n⚠️  This OTP has expired, generate a new one!');
        }
      } else {
        console.log('\n⚠️  Plain text OTP not available (security feature)');
        console.log('    OTP is hashed with bcrypt and cannot be decoded');
        console.log('\n💡 To see the plain text OTP, generate a new one with:');
        console.log('   node scripts/generate-otp-for-draft.js ' + token);
      }
      
      console.log('\n📊 Request count:', draft.otpRequestCount || 0);
      if (draft.lastOtpRequestAt) {
        console.log('📅 Last request:', new Date(draft.lastOtpRequestAt).toLocaleString('th-TH'));
      }
    }
    
    console.log('\n🔗 Draft URL: https://dcpschool100.net/draft/' + token);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✅ MongoDB connection closed');
  }
}

main();
