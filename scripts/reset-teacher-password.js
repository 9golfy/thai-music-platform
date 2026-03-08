const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

async function resetTeacherPassword() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db(dbName);
    const usersCollection = database.collection('users');

    // Find the teacher
    const teacher = await usersCollection.findOne({
      email: 'thaimusicplatform@gmail.com',
      role: 'teacher'
    });

    if (!teacher) {
      console.log('❌ Teacher not found');
      return;
    }

    console.log('📧 Found teacher:', teacher.email);
    console.log('🏫 School ID:', teacher.schoolId);

    // Hash new password
    const newPassword = '123456';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    const result = await usersCollection.updateOne(
      { _id: teacher._id },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        } 
      }
    );

    if (result.modifiedCount === 1) {
      console.log('✅ Password reset successfully!');
      console.log('📝 Login credentials:');
      console.log('   Email: thaimusicplatform@gmail.com');
      console.log('   Password: 123456');
      console.log('   School ID: ' + teacher.schoolId);
      console.log('🔗 Login URL: http://localhost:3000/teacher-login');
    } else {
      console.log('❌ Failed to reset password');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

resetTeacherPassword();