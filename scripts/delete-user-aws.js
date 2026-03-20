const { exec } = require('child_process');

const email = 'thaimusicplatform@gmail.com';

const command = `ssh -i "D:\\Fatcat\\ThaiMusic\\aws-credential\\thai-music-key.pem" ubuntu@18.138.63.84 "docker exec thai-music-mongo mongosh thai_music_school --quiet --eval 'db.users.deleteMany({email: \\"${email}\\"}); print(\\"Deleted users with email: ${email}\\")'"`;

console.log(`🗑️ Deleting user: ${email} from production...\n`);

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
  console.log('\n✅ User deleted successfully!');
  console.log('You can now run the test again.');
});
