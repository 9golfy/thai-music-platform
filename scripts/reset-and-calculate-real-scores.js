// Script to calculate REAL scores based on actual data
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

function calculateGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

// Calculate score based on actual data structure
function calculateRegister100Score(school) {
  let score = 0;
  
  // Count teachers (max 20 points)
  if (school.thaiMusicTeachers && Array.isArray(school.thaiMusicTeachers)) {
    score += Math.min(school.thaiMusicTeachers.length * 5, 20);
  }
  
  // Count instruments (max 20 points)
  if (school.readinessItems && Array.isArray(school.readinessItems)) {
    const totalInstruments = school.readinessItems.reduce((sum, item) => {
      return sum + (parseInt(item.quantity) || 0);
    }, 0);
    score += Math.min(totalInstruments * 2, 20);
  }
  
  // Music types taught (max 15 points)
  if (school.currentMusicTypes && Array.isArray(school.currentMusicTypes)) {
    score += Math.min(school.currentMusicTypes.length * 5, 15);
  }
  
  // Student count (max 15 points)
  if (school.studentCount) {
    score += Math.min(school.studentCount / 100, 15);
  }
  
  // Staff count (max 15 points)
  if (school.staffCount) {
    score += Math.min(school.staffCount / 10, 15);
  }
  
  // School size bonus (max 15 points)
  if (school.schoolSize === 'LARGE') score += 15;
  else if (school.schoolSize === 'MEDIUM') score += 10;
  else if (school.schoolSize === 'SMALL') score += 5;
  
  return Math.min(Math.round(score), 100);
}

function calculateRegisterSupportScore(school) {
  let score = 0;
  
  // Count teachers (max 25 points)
  if (school.thaiMusicTeachers && Array.isArray(school.thaiMusicTeachers)) {
    score += Math.min(school.thaiMusicTeachers.length * 8, 25);
  }
  
  // Count instruments (max 25 points)
  if (school.readinessItems && Array.isArray(school.readinessItems)) {
    const totalInstruments = school.readinessItems.reduce((sum, item) => {
      return sum + (parseInt(item.quantity) || 0);
    }, 0);
    score += Math.min(totalInstruments * 2.5, 25);
  }
  
  // Music types taught (max 20 points)
  if (school.currentMusicTypes && Array.isArray(school.currentMusicTypes)) {
    score += Math.min(school.currentMusicTypes.length * 7, 20);
  }
  
  // Student count (max 15 points)
  if (school.studentCount) {
    score += Math.min(school.studentCount / 80, 15);
  }
  
  // Staff count (max 15 points)
  if (school.staffCount) {
    score += Math.min(school.staffCount / 8, 15);
  }
  
  return Math.min(Math.round(score), 100);
}

async function calculateRealScores() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db(dbName);
    
    // Calculate for Register100
    console.log('\n=== Calculating Real Scores for Register100 ===');
    const register100Collection = database.collection('register100_submissions');
    const register100Schools = await register100Collection.find({}).toArray();
    
    for (const school of register100Schools) {
      const totalScore = calculateRegister100Score(school);
      const grade = calculateGrade(totalScore);
      
      await register100Collection.updateOne(
        { _id: school._id },
        { 
          $set: { 
            totalScore,
            grade,
            updatedAt: new Date()
          } 
        }
      );
      
      console.log(`${school.schoolId} - ${school.schoolName}: ${totalScore} (${grade})`);
    }
    
    // Calculate for Register-Support
    console.log('\n=== Calculating Real Scores for Register-Support ===');
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportSchools = await registerSupportCollection.find({}).toArray();
    
    for (const school of registerSupportSchools) {
      const totalScore = calculateRegisterSupportScore(school);
      const grade = calculateGrade(totalScore);
      
      await registerSupportCollection.updateOne(
        { _id: school._id },
        { 
          $set: { 
            totalScore,
            grade,
            updatedAt: new Date()
          } 
        }
      );
      
      console.log(`${school.schoolId} - ${school.schoolName}: ${totalScore} (${grade})`);
    }
    
    console.log('\n✅ Real scores calculated successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

calculateRealScores();
