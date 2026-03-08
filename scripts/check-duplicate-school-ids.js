// Script to check for duplicate school IDs
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = 'thai_music_school';

async function checkDuplicates() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db(dbName);
    
    // Get all school IDs from both collections
    const register100Collection = database.collection('register100_submissions');
    const registerSupportCollection = database.collection('register_support_submissions');
    
    const register100Schools = await register100Collection.find({}).toArray();
    const registerSupportSchools = await registerSupportCollection.find({}).toArray();
    
    console.log('\n=== Register100 Schools ===');
    console.log(`Total: ${register100Schools.length}`);
    register100Schools.forEach(s => {
      console.log(`${s.schoolId} - ${s.schoolName} (Score: ${s.totalScore}, Grade: ${s.grade})`);
    });
    
    console.log('\n=== Register-Support Schools ===');
    console.log(`Total: ${registerSupportSchools.length}`);
    registerSupportSchools.forEach(s => {
      console.log(`${s.schoolId} - ${s.schoolName} (Score: ${s.totalScore}, Grade: ${s.grade})`);
    });
    
    // Check for duplicates
    console.log('\n=== Checking for Duplicate School IDs ===');
    const register100Ids = new Set(register100Schools.map(s => s.schoolId));
    const registerSupportIds = new Set(registerSupportSchools.map(s => s.schoolId));
    
    const duplicates = [];
    register100Ids.forEach(id => {
      if (registerSupportIds.has(id)) {
        duplicates.push(id);
      }
    });
    
    if (duplicates.length > 0) {
      console.log(`❌ Found ${duplicates.length} duplicate school IDs:`);
      duplicates.forEach(id => {
        const school100 = register100Schools.find(s => s.schoolId === id);
        const schoolSupport = registerSupportSchools.find(s => s.schoolId === id);
        console.log(`\n  ${id}:`);
        console.log(`    Register100: ${school100.schoolName} (Score: ${school100.totalScore}, Grade: ${school100.grade})`);
        console.log(`    Register-Support: ${schoolSupport.schoolName} (Score: ${schoolSupport.totalScore}, Grade: ${schoolSupport.grade})`);
      });
    } else {
      console.log('✅ No duplicate school IDs found');
    }
    
    // Check specifically for SCH-20260301-0001
    console.log('\n=== Checking SCH-20260301-0001 ===');
    const school100_0001 = register100Schools.find(s => s.schoolId === 'SCH-20260301-0001');
    const schoolSupport_0001 = registerSupportSchools.find(s => s.schoolId === 'SCH-20260301-0001');
    
    if (school100_0001) {
      console.log('Found in Register100:');
      console.log(`  Name: ${school100_0001.schoolName}`);
      console.log(`  Score: ${school100_0001.totalScore}`);
      console.log(`  Grade: ${school100_0001.grade}`);
    }
    
    if (schoolSupport_0001) {
      console.log('Found in Register-Support:');
      console.log(`  Name: ${schoolSupport_0001.schoolName}`);
      console.log(`  Score: ${schoolSupport_0001.totalScore}`);
      console.log(`  Grade: ${schoolSupport_0001.grade}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkDuplicates();
