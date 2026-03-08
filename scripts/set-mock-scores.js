// Script to set mock scores and grades for testing
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

async function setMockScores() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db(dbName);
    
    // Update register100 submissions with mock scores
    console.log('\n=== Setting Mock Scores for Register100 ===');
    const register100Collection = database.collection('register100_submissions');
    const register100Submissions = await register100Collection.find({}).toArray();
    
    const scores = [100, 95, 85, 75, 65, 55, 45]; // Different scores for variety
    let index = 0;
    
    for (const submission of register100Submissions) {
      const score = scores[index % scores.length];
      let grade;
      if (score >= 90) grade = 'A';
      else if (score >= 80) grade = 'B';
      else if (score >= 70) grade = 'C';
      else if (score >= 60) grade = 'D';
      else grade = 'F';
      
      await register100Collection.updateOne(
        { _id: submission._id },
        { 
          $set: { 
            totalScore: score,
            grade: grade,
            updatedAt: new Date()
          } 
        }
      );
      
      console.log(`${submission.schoolName}: Score=${score}, Grade=${grade}`);
      index++;
    }
    
    // Update register-support submissions with mock scores
    console.log('\n=== Setting Mock Scores for Register-Support ===');
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportSubmissions = await registerSupportCollection.find({}).toArray();
    
    index = 0;
    for (const submission of registerSupportSubmissions) {
      const score = scores[index % scores.length];
      let grade;
      if (score >= 90) grade = 'A';
      else if (score >= 80) grade = 'B';
      else if (score >= 70) grade = 'C';
      else if (score >= 60) grade = 'D';
      else grade = 'F';
      
      await registerSupportCollection.updateOne(
        { _id: submission._id },
        { 
          $set: { 
            totalScore: score,
            grade: grade,
            updatedAt: new Date()
          } 
        }
      );
      
      console.log(`${submission.schoolName}: Score=${score}, Grade=${grade}`);
      index++;
    }
    
    console.log('\n✅ Mock scores set successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

setMockScores();
