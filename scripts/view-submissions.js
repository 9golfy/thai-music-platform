const { MongoClient } = require('mongodb');

async function viewSubmissions() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const database = client.db('thai_music_school');
    const collection = database.collection('register100_submissions');

    // Get all submissions sorted by score
    const submissions = await collection
      .find({})
      .sort({ total_score: -1 })
      .toArray();

    console.log(`📊 Total Submissions: ${submissions.length}\n`);
    console.log('='.repeat(120));
    console.log(
      `${'#'.padEnd(5)} | ${'School Name'.padEnd(40)} | ${'Province'.padEnd(15)} | ${'Score'.padEnd(8)} | ${'Created'.padEnd(20)}`
    );
    console.log('='.repeat(120));

    submissions.forEach((sub, index) => {
      const schoolName = (sub.schoolName || 'N/A').substring(0, 40).padEnd(40);
      const province = (sub.schoolProvince || 'N/A').substring(0, 15).padEnd(15);
      const score = String(sub.total_score || 0).padEnd(8);
      const created = sub.createdAt ? new Date(sub.createdAt).toLocaleString('th-TH') : 'N/A';
      
      console.log(
        `${String(index + 1).padEnd(5)} | ${schoolName} | ${province} | ${score} | ${created.padEnd(20)}`
      );
    });

    console.log('='.repeat(120));
    console.log('\n📈 Score Statistics:');
    
    const scores = submissions.map(s => s.total_score || 0);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    console.log(`   - Highest Score: ${maxScore}`);
    console.log(`   - Lowest Score: ${minScore}`);
    console.log(`   - Average Score: ${avgScore.toFixed(2)}`);

    console.log('\n📊 Score Distribution:');
    const scoreRanges = {
      '90-100': 0,
      '70-89': 0,
      '50-69': 0,
      '30-49': 0,
      '0-29': 0
    };

    scores.forEach(score => {
      if (score >= 90) scoreRanges['90-100']++;
      else if (score >= 70) scoreRanges['70-89']++;
      else if (score >= 50) scoreRanges['50-69']++;
      else if (score >= 30) scoreRanges['30-49']++;
      else scoreRanges['0-29']++;
    });

    Object.entries(scoreRanges).forEach(([range, count]) => {
      const percentage = ((count / submissions.length) * 100).toFixed(1);
      const bar = '█'.repeat(Math.floor(count / 2));
      console.log(`   ${range.padEnd(10)}: ${String(count).padStart(3)} (${percentage.padStart(5)}%) ${bar}`);
    });

    console.log('\n💡 Tips:');
    console.log('   - ดูรายละเอียดโรงเรียนใดโรงเรียนหนึ่ง: node tests/check-register100-mongodb.js');
    console.log('   - ตรวจสอบคะแนน: node tests/verify-scores.js');
    console.log('   - ใช้ MongoDB Compass สำหรับ GUI: https://www.mongodb.com/try/download/compass');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n✅ MongoDB connection closed');
  }
}

viewSubmissions();
