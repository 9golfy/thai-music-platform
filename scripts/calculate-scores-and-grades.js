// Script to calculate totalScore and grade for all schools
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

// Grade calculation function
function calculateGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

// Calculate total score for register100
function calculateRegister100Score(submission) {
  let total = 0;
  
  // Step 1: School Info (no score)
  
  // Step 2: Personnel (20 points)
  if (submission.step2?.personnel) {
    const p = submission.step2.personnel;
    if (p.fullTimeTeachers) total += parseFloat(p.fullTimeTeachers) || 0;
    if (p.partTimeTeachers) total += parseFloat(p.partTimeTeachers) || 0;
    if (p.supportStaff) total += parseFloat(p.supportStaff) || 0;
  }
  
  // Step 3: Curriculum (20 points)
  if (submission.step3?.curriculum) {
    const c = submission.step3.curriculum;
    if (c.hasWrittenCurriculum) total += 5;
    if (c.teachingHoursPerWeek) total += parseFloat(c.teachingHoursPerWeek) || 0;
    if (c.studentCount) total += Math.min(parseFloat(c.studentCount) / 10, 10);
  }
  
  // Step 4: Facilities (20 points)
  if (submission.step4?.facilities) {
    const f = submission.step4.facilities;
    if (f.classrooms) total += Math.min(parseFloat(f.classrooms) * 2, 10);
    if (f.instruments) total += Math.min(parseFloat(f.instruments) / 5, 10);
  }
  
  // Step 5: Awards (20 points)
  if (submission.step5?.awards && Array.isArray(submission.step5.awards)) {
    submission.step5.awards.forEach(award => {
      if (award.level === 'international') total += 5;
      else if (award.level === 'national') total += 3;
      else if (award.level === 'regional') total += 2;
      else if (award.level === 'local') total += 1;
    });
  }
  
  // Step 6: Activities (10 points)
  if (submission.step6?.activities && Array.isArray(submission.step6.activities)) {
    total += Math.min(submission.step6.activities.length * 2, 10);
  }
  
  // Step 7: Budget (10 points)
  if (submission.step7?.budget) {
    const b = submission.step7.budget;
    if (b.annualBudget) {
      const budget = parseFloat(b.annualBudget) || 0;
      total += Math.min(budget / 100000, 10);
    }
  }
  
  return Math.min(total, 100);
}

// Calculate total score for register-support
function calculateRegisterSupportScore(submission) {
  let total = 0;
  
  // Similar calculation but adjusted for support schools
  // Step 2: Personnel (15 points)
  if (submission.step2?.personnel) {
    const p = submission.step2.personnel;
    if (p.fullTimeTeachers) total += Math.min(parseFloat(p.fullTimeTeachers) * 3, 10);
    if (p.partTimeTeachers) total += Math.min(parseFloat(p.partTimeTeachers) * 2, 5);
  }
  
  // Step 3: Curriculum (15 points)
  if (submission.step3?.curriculum) {
    const c = submission.step3.curriculum;
    if (c.hasWrittenCurriculum) total += 5;
    if (c.teachingHoursPerWeek) total += Math.min(parseFloat(c.teachingHoursPerWeek), 10);
  }
  
  // Step 4: Facilities (15 points)
  if (submission.step4?.facilities) {
    const f = submission.step4.facilities;
    if (f.classrooms) total += Math.min(parseFloat(f.classrooms) * 3, 10);
    if (f.instruments) total += Math.min(parseFloat(f.instruments) / 3, 5);
  }
  
  // Step 5: Awards (25 points)
  if (submission.step5?.awards && Array.isArray(submission.step5.awards)) {
    submission.step5.awards.forEach(award => {
      if (award.level === 'international') total += 7;
      else if (award.level === 'national') total += 5;
      else if (award.level === 'regional') total += 3;
      else if (award.level === 'local') total += 2;
    });
  }
  
  // Step 6: Activities (15 points)
  if (submission.step6?.activities && Array.isArray(submission.step6.activities)) {
    total += Math.min(submission.step6.activities.length * 3, 15);
  }
  
  // Step 7: Budget (15 points)
  if (submission.step7?.budget) {
    const b = submission.step7.budget;
    if (b.annualBudget) {
      const budget = parseFloat(b.annualBudget) || 0;
      total += Math.min(budget / 50000, 15);
    }
  }
  
  return Math.min(total, 100);
}

async function updateScoresAndGrades() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db(dbName);
    
    // Update register100 submissions
    console.log('\n=== Updating Register100 Submissions ===');
    const register100Collection = database.collection('register100_submissions');
    const register100Submissions = await register100Collection.find({}).toArray();
    
    let register100Updated = 0;
    for (const submission of register100Submissions) {
      const totalScore = calculateRegister100Score(submission);
      const grade = calculateGrade(totalScore);
      
      await register100Collection.updateOne(
        { _id: submission._id },
        { 
          $set: { 
            totalScore: totalScore,
            grade: grade,
            updatedAt: new Date()
          } 
        }
      );
      
      console.log(`Updated ${submission.schoolName}: Score=${totalScore.toFixed(2)}, Grade=${grade}`);
      register100Updated++;
    }
    
    console.log(`\nTotal Register100 updated: ${register100Updated}`);
    
    // Update register-support submissions
    console.log('\n=== Updating Register-Support Submissions ===');
    const registerSupportCollection = database.collection('register_support_submissions');
    const registerSupportSubmissions = await registerSupportCollection.find({}).toArray();
    
    let registerSupportUpdated = 0;
    for (const submission of registerSupportSubmissions) {
      const totalScore = calculateRegisterSupportScore(submission);
      const grade = calculateGrade(totalScore);
      
      await registerSupportCollection.updateOne(
        { _id: submission._id },
        { 
          $set: { 
            totalScore: totalScore,
            grade: grade,
            updatedAt: new Date()
          } 
        }
      );
      
      console.log(`Updated ${submission.schoolName}: Score=${totalScore.toFixed(2)}, Grade=${grade}`);
      registerSupportUpdated++;
    }
    
    console.log(`\nTotal Register-Support updated: ${registerSupportUpdated}`);
    console.log('\n✅ All scores and grades updated successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

updateScoresAndGrades();
