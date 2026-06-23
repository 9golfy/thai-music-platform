import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection('register_support_submissions');

    const submission = await collection.findOne({ _id: new ObjectId(id) });

    if (!submission) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูล' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      submission: {
        ...submission,
        _id: submission._id.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection('register_support_submissions');

    // First, get the submission to find the schoolId and teacher email
    const submission = await collection.findOne({
      _id: new ObjectId(id)
    });

    if (!submission) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลที่ต้องการลบ' },
        { status: 404 }
      );
    }

    // Delete the submission
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลที่ต้องการลบ' },
        { status: 404 }
      );
    }

    // Delete associated certificates
    const certificatesCollection = database.collection('certificates');
    await certificatesCollection.deleteMany({
      schoolId: submission.schoolId || id
    });

    // Delete associated teacher user account
    if (submission.teacherEmail) {
      const usersCollection = database.collection('users');
      const deleteUserResult = await usersCollection.deleteOne({
        email: submission.teacherEmail,
        role: 'teacher' // Only delete teacher accounts, not admin accounts
      });
      
      if (deleteUserResult.deletedCount > 0) {
        console.log(`✅ Deleted teacher user: ${submission.teacherEmail}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'ลบข้อมูลสำเร็จ',
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'เกิดข้อผิดพลาดในการลบข้อมูล',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = new MongoClient(uri);

  try {
    const body = await request.json();
    console.log('PUT request body:', JSON.stringify(body, null, 2));

    // ลบ _id ออกจาก body ก่อน update เพราะ MongoDB ไม่อนุญาตให้แก้ไข _id
    const { _id, ...updateData } = body;

    // Clean up data - remove any nested ObjectId or invalid MongoDB types
    const cleanData = JSON.parse(JSON.stringify(updateData));

    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection('register_support_submissions');

    console.log('Updating document with ID:', id);
    console.log('Update data:', JSON.stringify(cleanData, null, 2));

    // Prepare score fields - use admin-provided scores if present, otherwise calculate
    const getFieldValue = (fieldName: string) =>
      cleanData[`regsup_${fieldName}`] ?? cleanData[fieldName];

    // Check if admin manually edited scores (scores will be present in cleanData)
    const hasManualScores = cleanData.teacher_qualification_score !== undefined ||
                           cleanData.support_from_org_score !== undefined ||
                           cleanData.support_from_external_score !== undefined ||
                           cleanData.award_score !== undefined ||
                           cleanData.activity_within_province_internal_score !== undefined ||
                           cleanData.activity_within_province_external_score !== undefined ||
                           cleanData.activity_outside_province_score !== undefined ||
                           cleanData.pr_activity_score !== undefined;

    let scoreData: any = {};

    if (hasManualScores) {
      // Admin edited scores manually - use provided scores, don't recalculate
      console.log('✅ Using admin-provided scores (manual edit mode)');
      
      // Only include scores that were actually sent (preserve existing scores for others)
      if (cleanData.teacher_qualification_score !== undefined) {
        scoreData.teacher_qualification_score = cleanData.teacher_qualification_score;
      }
      if (cleanData.support_from_org_score !== undefined) {
        scoreData.support_from_org_score = cleanData.support_from_org_score;
      }
      if (cleanData.support_from_external_score !== undefined) {
        scoreData.support_from_external_score = cleanData.support_from_external_score;
      }
      if (cleanData.award_score !== undefined) {
        scoreData.award_score = cleanData.award_score;
      }
      if (cleanData.activity_within_province_internal_score !== undefined) {
        scoreData.activity_within_province_internal_score = cleanData.activity_within_province_internal_score;
      }
      if (cleanData.activity_within_province_external_score !== undefined) {
        scoreData.activity_within_province_external_score = cleanData.activity_within_province_external_score;
      }
      if (cleanData.activity_outside_province_score !== undefined) {
        scoreData.activity_outside_province_score = cleanData.activity_outside_province_score;
      }
      if (cleanData.pr_activity_score !== undefined) {
        scoreData.pr_activity_score = cleanData.pr_activity_score;
      }

      // Calculate total_score from the scores that were sent
      const currentDoc = await collection.findOne({ _id: new ObjectId(id) });
      const total_score =
        (scoreData.teacher_qualification_score ?? currentDoc?.teacher_qualification_score ?? 0) +
        (scoreData.support_from_org_score ?? currentDoc?.support_from_org_score ?? 0) +
        (scoreData.support_from_external_score ?? currentDoc?.support_from_external_score ?? 0) +
        (scoreData.award_score ?? currentDoc?.award_score ?? 0) +
        (scoreData.activity_within_province_internal_score ?? currentDoc?.activity_within_province_internal_score ?? 0) +
        (scoreData.activity_within_province_external_score ?? currentDoc?.activity_within_province_external_score ?? 0) +
        (scoreData.activity_outside_province_score ?? currentDoc?.activity_outside_province_score ?? 0) +
        (scoreData.pr_activity_score ?? currentDoc?.pr_activity_score ?? 0);
      
      scoreData.total_score = total_score;
    } else {
      // Normal edit mode - recalculate scores from data
      console.log('🔄 Recalculating scores from data (normal edit mode)');

      const teachers = getFieldValue('thaiMusicTeachers') || [];
      const uniqueQualifications = new Set<string>();
      if (Array.isArray(teachers)) {
        teachers.forEach((t: any) => {
          if (t.teacherQualification) uniqueQualifications.add(t.teacherQualification);
        });
      }
      scoreData.teacher_qualification_score = Math.min(uniqueQualifications.size * 5, 20);

      scoreData.support_from_org_score = getFieldValue('hasSupportFromOrg') ? 5 : 0;

      const externalSupport = getFieldValue('supportFromExternal') || [];
      const externalCount = Array.isArray(externalSupport) ? externalSupport.length : 0;
      scoreData.support_from_external_score = externalCount >= 3 ? 15 : externalCount === 2 ? 10 : externalCount === 1 ? 5 : 0;

      const awards = getFieldValue('awards') || [];
      let award_score = 0;
      if (Array.isArray(awards)) {
        awards.forEach((award: any) => {
          if (award.awardLevel === 'ประเทศ') award_score = Math.max(award_score, 20);
          else if (award.awardLevel === 'ภาค') award_score = Math.max(award_score, 15);
          else if (award.awardLevel === 'จังหวัด') award_score = Math.max(award_score, 10);
          else if (award.awardLevel === 'อำเภอ') award_score = Math.max(award_score, 5);
        });
      }
      scoreData.award_score = award_score;

      const internalActivities = getFieldValue('activitiesWithinProvinceInternal') || [];
      scoreData.activity_within_province_internal_score = Array.isArray(internalActivities) && internalActivities.length >= 3 ? 5 : 0;

      const externalActivities = getFieldValue('activitiesWithinProvinceExternal') || [];
      scoreData.activity_within_province_external_score = Array.isArray(externalActivities) && externalActivities.length >= 3 ? 5 : 0;

      const outsideActivities = getFieldValue('activitiesOutsideProvince') || [];
      scoreData.activity_outside_province_score = Array.isArray(outsideActivities) && outsideActivities.length >= 3 ? 5 : 0;

      const prActivities = getFieldValue('prActivities') || [];
      scoreData.pr_activity_score = Array.isArray(prActivities) && prActivities.length >= 3 ? 5 : 0;

      scoreData.total_score =
        scoreData.teacher_qualification_score +
        scoreData.support_from_org_score +
        scoreData.support_from_external_score +
        scoreData.award_score +
        scoreData.activity_within_province_internal_score +
        scoreData.activity_within_province_external_score +
        scoreData.activity_outside_province_score +
        scoreData.pr_activity_score;
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...cleanData,
          // Use scoreData which contains either manual or calculated scores
          ...scoreData,
          updatedAt: new Date(),
        },
      }
    );

    console.log('Update result:', result);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลที่ต้องการแก้ไข' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'แก้ไขข้อมูลสำเร็จ',
    });
  } catch (error) {
    console.error('Error updating submission:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      {
        success: false,
        message: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}