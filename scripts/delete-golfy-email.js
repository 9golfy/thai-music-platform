#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🗑️ Deleting old data for 9golfy@gmail.com...\n');

const script = `
const { MongoClient } = require('mongodb');
(async () => {
  const client = new MongoClient('mongodb://thai-music-mongo:27017/thai_music_school');
  await client.connect();
  const db = client.db('thai_music_school');
  
  const userResult = await db.collection('users').deleteMany({email: '9golfy@gmail.com'});
  console.log('Users deleted:', userResult.deletedCount);
  
  const submissionResult = await db.collection('register100_submissions').deleteMany({teacherEmail: '9golfy@gmail.com'});
  console.log('Submissions deleted:', submissionResult.deletedCount);
  
  await client.close();
})();
`;

const command = `ssh -i "D:\\Fatcat\\ThaiMusic\\aws-credential\\thai-music-key.pem" ubuntu@18.138.63.84 "docker exec thai-music-web-prod node -e '${script.replace(/'/g, "'\\''").replace(/\n/g, ' ')}'"`;

try {
  const output = execSync(command, { encoding: 'utf8', stdio: 'inherit' });
  console.log('\n✅ Old data deleted successfully');
} catch (error) {
  console.error('❌ Error:', error.message);
}
