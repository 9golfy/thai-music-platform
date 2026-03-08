/**
 * Check current OTP request count for an email
 * Usage: node scripts/check-otp-count.js [email]
 */

const { MongoClient } = require('mongodb');

const email = process.argv[2] || '9golfy@gmail.com';

async function checkOTPCount() {
  // Use the same connection as the app
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('registerform'); // Specify database name
    const draftsCollection = db.collection('draft_submissions');
    
    console.log(`🔍 Checking OTP count for: ${email}`);
    
    // Find all drafts for this email
    const drafts = await draftsCollection.find({ email }).toArray();
    
    console.log(`📊 Found ${drafts.length} draft(s) for this email:`);
    
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    
    drafts.forEach((draft, index) => {
      console.log(`\n--- Draft ${index + 1} ---`);
      console.log(`Token: ${draft.draftToken || draft.token}`);
      console.log(`Submission Type: ${draft.submissionType}`);
      console.log(`Status: ${draft.status}`);
      console.log(`Created: ${draft.createdAt}`);
      console.log(`Last OTP Request: ${draft.lastOtpRequestAt || 'Never'}`);
      console.log(`OTP Request Count: ${draft.otpRequestCount || 0}`);
      console.log(`Save Count: ${draft.saveCount || 0}`);
      
      // Check if within rate limit window
      if (draft.lastOtpRequestAt) {
        const isWithinOneHour = new Date(draft.lastOtpRequestAt) >= oneHourAgo;
        const isWithinThirtyMinutes = new Date(draft.lastOtpRequestAt) >= thirtyMinutesAgo;
        console.log(`Within 1 hour: ${isWithinOneHour}`);
        console.log(`Within 30 minutes: ${isWithinThirtyMinutes}`);
      }
    });
    
    // Calculate total OTP requests in the last 30 minutes (new limit)
    const recentDrafts = await draftsCollection.find({
      email,
      lastOtpRequestAt: { $gte: thirtyMinutesAgo }
    }).toArray();
    
    const totalOTPRequests = recentDrafts.reduce(
      (sum, draft) => sum + (draft.otpRequestCount || 0),
      0
    );
    
    console.log(`\n🎯 RATE LIMIT STATUS:`);
    console.log(`Total OTP requests in last 30 minutes: ${totalOTPRequests}`);
    console.log(`Current limit: 10 requests per 30 minutes`);
    console.log(`Remaining requests: ${Math.max(0, 10 - totalOTPRequests)}`);
    console.log(`Rate limited: ${totalOTPRequests >= 10 ? 'YES' : 'NO'}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

checkOTPCount();