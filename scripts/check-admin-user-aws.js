#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔍 Checking admin user in production database...\n');

const command = `ssh -i "D:\\Fatcat\\ThaiMusic\\aws-credential\\thai-music-key.pem" ubuntu@18.138.63.84 "docker exec thai-music-mongo mongosh thai_music_school --quiet --eval 'printjson(db.users.find({role: \\"dcp_admin\\"}).toArray())'"`;

try {
  const output = execSync(command, { encoding: 'utf8' });
  console.log('Admin users found:');
  console.log(output);
  
  if (output.includes('[]') || output.trim() === '[]') {
    console.log('\n❌ No admin users found in production database!');
    console.log('\n💡 You need to create an admin user first.');
    console.log('Run: node scripts/create-admin-user-aws.js');
  } else {
    console.log('\n✅ Admin users exist in production database');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}
