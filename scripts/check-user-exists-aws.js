const { exec } = require('child_process');

const command = `ssh -i "D:\\Fatcat\\ThaiMusic\\aws-credential\\thai-music-key.pem" ubuntu@18.138.63.84 "docker exec thai-music-mongo mongosh thai_music_school --quiet --eval 'db.users.find({email: \\"thaimusicplatform@gmail.com\\"}).toArray()'"`;

console.log('🔍 Checking if user exists in production...\n');

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }
  if (stderr) {
    console.error('⚠️ stderr:', stderr);
  }
  
  console.log('📊 Result:');
  console.log(stdout);
  
  try {
    const users = JSON.parse(stdout);
    if (users.length > 0) {
      console.log(`\n✅ Found ${users.length} user(s) with email thaimusicplatform@gmail.com`);
      users.forEach((user, i) => {
        console.log(`\nUser ${i + 1}:`);
        console.log(`  - ID: ${user._id}`);
        console.log(`  - Email: ${user.email}`);
        console.log(`  - Role: ${user.role}`);
        console.log(`  - School ID: ${user.schoolId || 'N/A'}`);
      });
    } else {
      console.log('\n❌ No users found with this email');
    }
  } catch (e) {
    console.log('⚠️ Could not parse result as JSON');
  }
});
