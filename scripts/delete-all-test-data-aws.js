#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🗑️ Deleting all test data from production...\n');

const script = `
const { MongoClient } = require('mongodb');
(async () => {
  const client = new MongoClient('mongodb://thai-music-mongo:27017/thai_music_school');
  await client.connect();
  const db = client.db('thai_music_school');
  
  // Delete test submissions (keep only real school data)
  const submissionResult = await db.collection('register100_submissions').deleteMany({
    reg100_schoolName: /ทดสอบ|test|Test|Production/i
  });
  console.log('Test submissions deleted:', submissionResult.deletedCount);
  
  // Delete test users (keep only admin)
  const userResult = await db.collection('users').deleteMany({
    role: 'teacher',
    email: /test|@example\\.com/i
  });
  console.log('Test users deleted:', userResult.deletedCount);
  
  // Show remaining data
  const remainingSubmissions = await db.collection('register100_submissions').countDocuments();
  const remainingUsers = await db.collection('users').countDocuments();
  
  console.log('\\nRemaining data:');
  console.log('- Submissions:', remainingSubmissions);
  console.log('- Users:', remainingUsers);
  
  await client.close();
})();
`;

const command = `ssh -i "D:\\Fatcat\\ThaiMusic\\aws-credential\\thai-music-key.pem" ubuntu@18.138.63.84 "docker exec thai-music-web-prod node -e '${script.replace(/'/g, "'\\''").replace(/\n/g, ' ')}'"`;

try {
  const output = execSync(command, { encoding: 'utf8', stdio: 'inherit' });
  console.log('\n✅ Test data deleted successfully');
} catch (error) {
  console.error('❌ Error:', error.message);
}
