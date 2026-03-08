const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteAllTestData() {
  try {
    console.log('🗑️ Starting deletion of all test data...');

    // Get all test schools first to identify related data
    const testSchools = await prisma.register100.findMany({
      where: {
        OR: [
          { reg100_schoolName: { contains: 'ทดสอบ' } },
          { reg100_schoolName: { contains: 'Test' } },
          { reg100_schoolName: { contains: 'โรงเรียนสนับสนุน 9 ครู Full' } },
          { reg100_schoolName: { contains: 'โรงเรียนทดสอบ' } },
          { reg100_mgtEmail: 'thaimusicplatform@gmail.com' },
          { reg100_mgtEmail: 'fatcatdigitalco@gmail.com' },
          { reg100_mgtEmail: 'pacncancercenter@gmail.com' },
          { reg100_mgtEmail: 'kaibandon2021@gmail.com' }
        ]
      },
      select: { id: true, reg100_schoolName: true, schoolId: true }
    });

    const testSupportSchools = await prisma.registerSupport.findMany({
      where: {
        OR: [
          { regsup_schoolName: { contains: 'ทดสอบ' } },
          { regsup_schoolName: { contains: 'Test' } },
          { regsup_schoolName: { contains: 'โรงเรียนสนับสนุน 9 ครู Full' } },
          { regsup_schoolName: { contains: 'โรงเรียนทดสอบ' } },
          { regsup_mgtEmail: 'thaimusicplatform@gmail.com' },
          { regsup_mgtEmail: 'fatcatdigitalco@gmail.com' },
          { regsup_mgtEmail: 'pacncancercenter@gmail.com' },
          { regsup_mgtEmail: 'kaibandon2021@gmail.com' }
        ]
      },
      select: { id: true, regsup_schoolName: true, schoolId: true }
    });

    // Collect all school IDs for user deletion
    const allSchoolIds = [
      ...testSchools.map(s => s.schoolId),
      ...testSupportSchools.map(s => s.schoolId)
    ].filter(Boolean);

    console.log(`Found ${testSchools.length} register100 test schools`);
    console.log(`Found ${testSupportSchools.length} register-support test schools`);
    console.log(`School IDs to clean: ${allSchoolIds.join(', ')}`);

    // Delete users associated with test schools
    if (allSchoolIds.length > 0) {
      const deletedUsers = await prisma.user.deleteMany({
        where: {
          OR: [
            { schoolId: { in: allSchoolIds } },
            { email: 'thaimusicplatform@gmail.com' },
            { email: 'fatcatdigitalco@gmail.com' },
            { email: 'pacncancercenter@gmail.com' },
            { email: 'kaibandon2021@gmail.com' }
          ]
        }
      });
      console.log(`✅ Deleted ${deletedUsers.count} test users`);
    }

    // Delete register100 test data
    if (testSchools.length > 0) {
      const deletedReg100 = await prisma.register100.deleteMany({
        where: {
          id: { in: testSchools.map(s => s.id) }
        }
      });
      console.log(`✅ Deleted ${deletedReg100.count} register100 test records`);
    }

    // Delete register-support test data
    if (testSupportSchools.length > 0) {
      const deletedRegSupport = await prisma.registerSupport.deleteMany({
        where: {
          id: { in: testSupportSchools.map(s => s.id) }
        }
      });
      console.log(`✅ Deleted ${deletedRegSupport.count} register-support test records`);
    }

    // Delete any remaining test users by email pattern
    const deletedTestUsers = await prisma.user.deleteMany({
      where: {
        OR: [
          { email: { contains: 'test' } },
          { email: { contains: 'ทดสอบ' } },
          { phone: '0899297983' } // Test phone number
        ]
      }
    });
    console.log(`✅ Deleted ${deletedTestUsers.count} additional test users by pattern`);

    console.log('🎉 All test data deleted successfully!');
    console.log('\n📋 Summary:');
    console.log(`- Register100 records: ${testSchools.length} deleted`);
    console.log(`- Register-Support records: ${testSupportSchools.length} deleted`);
    console.log(`- Users: ${(allSchoolIds.length > 0 ? 'Multiple' : '0')} deleted`);
    console.log(`- School IDs cleaned: ${allSchoolIds.join(', ') || 'None'}`);

  } catch (error) {
    console.error('❌ Error deleting test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the deletion
deleteAllTestData();