#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔧 Creating admin user in production database...\n');

// Create admin user with credentials shown on login page
const createUserScript = `
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

(async () => {
  const client = new MongoClient('mongodb://thai-music-mongo:27017/thai_music_school');
  await client.connect();
  const db = client.db('thai_music_school');
  const usersCollection = db.collection('users');
  
  // Check if admin already exists
  const existing = await usersCollection.findOne({ email: 'root@thaimusic.com' });
  if (existing) {
    console.log('Admin user already exists');
    await client.close();
    return;
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  // Create admin user
  const adminUser = {
    email: 'root@thaimusic.com',
    password: hashedPassword,
    role: 'dcp_admin',
    firstName: 'Admin',
    lastName: 'System',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const result = await usersCollection.insertOne(adminUser);
  console.log('Admin user created:', result.insertedId);
  
  await client.close();
})();
`;

const command = `ssh -i "D:\\Fatcat\\ThaiMusic\\aws-credential\\thai-music-key.pem" ubuntu@18.138.63.84 "docker exec thai-music-web-prod node -e '${createUserScript.replace(/'/g, "'\\''").replace(/\n/g, ' ')}'"`;

try {
  console.log('Creating admin user...');
  const output = execSync(command, { encoding: 'utf8', stdio: 'inherit' });
  
  console.log('\n✅ Admin user created successfully!');
  console.log('\n📝 Login credentials:');
  console.log('   Username: root@thaimusic.com');
  console.log('   Password: admin123');
  console.log('\n🌐 Login URL: http://18.138.63.84:3000/dcp-admin');
  
} catch (error) {
  console.error('\n❌ Error creating admin user:', error.message);
  console.log('\n💡 Alternative: Use the API endpoint');
  console.log('   POST http://18.138.63.84:3000/api/admin/create-super-admin');
}
