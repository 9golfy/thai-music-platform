const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

async function addSampleData() {
  console.log('=== Adding Sample Data for Charts ===\n');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db(dbName);
    
    // Add more register100 sample data
    const register100Collection = database.collection('register100_submissions');
    
    const register100Samples = [
      {
        schoolId: 'SCH-SAMPLE-001',
        reg100_schoolName: 'โรงเรียนตัวอย่าง A',
        reg100_schoolProvince: 'กรุงเทพมหานคร',
        total_score: 95,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        schoolId: 'SCH-SAMPLE-002', 
        reg100_schoolName: 'โรงเรียนตัวอย่าง B+',
        reg100_schoolProvince: 'เชียงใหม่',
        total_score: 87,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        schoolId: 'SCH-SAMPLE-003',
        reg100_schoolName: 'โรงเรียนตัวอย่าง B',
        reg100_schoolProvince: 'ขอนแก่น',
        total_score: 82,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        schoolId: 'SCH-SAMPLE-004',
        reg100_schoolName: 'โรงเรียนตัวอย่าง F',
        reg100_schoolProvince: 'สงขลา',
        total_score: 45,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Add more register-support sample data
    const registerSupportCollection = database.collection('register_support_submissions');
    
    const registerSupportSamples = [
      {
        schoolId: 'SCH-SUP-001',
        regsup_schoolName: 'โรงเรียนสนับสนุน A',
        schoolName: 'โรงเรียนสนับสนุน A',
        regsup_schoolProvince: 'กรุงเทพมหานคร',
        total_score: 92,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        schoolId: 'SCH-SUP-002',
        regsup_schoolName: 'โรงเรียนสนับสนุน B',
        schoolName: 'โรงเรียนสนับสนุน B',
        regsup_schoolProvince: 'เชียงใหม่',
        total_score: 85,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        schoolId: 'SCH-SUP-003',
        regsup_schoolName: 'โรงเรียนสนับสนุน B',
        schoolName: 'โรงเรียนสนับสนุน B',
        regsup_schoolProvince: 'ภูเก็ต',
        total_score: 83,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        schoolId: 'SCH-SUP-004',
        regsup_schoolName: 'โรงเรียนสนับสนุน C',
        schoolName: 'โรงเรียนสนับสนุน C',
        regsup_schoolProvince: 'ขอนแก่น',
        total_score: 75,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        schoolId: 'SCH-SUP-005',
        regsup_schoolName: 'โรงเรียนสนับสนุน C',
        schoolName: 'โรงเรียนสนับสนุน C',
        regsup_schoolProvince: 'นครราชสีมา',
        total_score: 72,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        schoolId: 'SCH-SUP-006',
        regsup_schoolName: 'โรงเรียนสนับสนุน F',
        schoolName: 'โรงเรียนสนับสนุน F',
        regsup_schoolProvince: 'สงขลา',
        total_score: 55,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Insert sample data
    console.log('Adding Register100 sample data...');
    await register100Collection.insertMany(register100Samples);
    console.log(`✅ Added ${register100Samples.length} register100 samples`);
    
    console.log('Adding Register Support sample data...');
    await registerSupportCollection.insertMany(registerSupportSamples);
    console.log(`✅ Added ${registerSupportSamples.length} register support samples`);
    
    console.log('\n✅ Sample data added successfully!');
    console.log('\nNew grade distribution should be:');
    console.log('Register100: A=2, B=2, C=0, F=1');
    console.log('Register Support: A=1, B=2, C=4, F=1');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

addSampleData().catch(console.error);