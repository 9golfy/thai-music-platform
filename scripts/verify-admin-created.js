#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔍 Verifying admin user in production...\n');

const command = `ssh -i "D:\\Fatcat\\ThaiMusic\\aws-credential\\thai-music-key.pem" ubuntu@18.138.63.84 "docker exec thai-music-mongo mongosh thai_music_school --quiet --eval 'printjson(db.users.find({email: \\"root@thaimusic.com\\"}).toArray())'"`;

try {
  const output = execSync(command, { encoding: 'utf8' });
  console.log('Admin user details:');
  console.log(output);
  
  if (output.includes('root@thaimusic.com')) {
    console.log('\n✅ Admin user exists!');
    console.log('\n📝 Login credentials:');
    console.log('   URL: http://18.138.63.84:3000/dcp-admin');
    console.log('   Username: root@thaimusic.com');
    console.log('   Password: admin123');
  } else {
    console.log('\n❌ Admin user not found');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}
