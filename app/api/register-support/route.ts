import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/thai_music_school';

export async function POST(request: NextRequest) {
  let client: MongoClient | null = null;

  try {
    const formData = await request.formData();
    
    // Parse form data
    const data: any = {};
    const files: { [key: string]: File } = {};

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        files[key] = value;
      } else {
        try {
          // Try to parse JSON arrays
          data[key] = JSON.parse(value as string);
        } catch {
          // If not JSON, store as string
          data[key] = value;
        }
      }
    }

    // Convert boolean strings to actual booleans
    const booleanFields = [
      'isCompulsorySubject',
      'hasAfterSchoolTeaching',
      'hasElectiveSubject',
      'hasLocalCurriculum',
      'hasSupportFromOrg',
      'hasSupportFromExternal',
      'DCP_PR_Channel_FACEBOOK',
      'DCP_PR_Channel_YOUTUBE',
      'DCP_PR_Channel_Tiktok',
      'heardFromOther',
      'certifiedINFOByAdminName',
    ];

    booleanFields.forEach((field) => {
      if (data[field] !== undefined) {
        data[field] = data[field] === 'true' || data[field] === true;
      }
    });

    // Convert numeric strings to numbers
    const numericFields = [
      'staffCount',
      'studentCount',
      'supportTypeMemberCount',
      'teacher_training_score',
      'teacher_qualification_score',
      'support_from_org_score',
      'support_from_external_score',
      'award_score',
      'activity_within_province_internal_score',
      'activity_within_province_external_score',
      'activity_outside_province_score',
      'pr_activity_score',
      'total_score',
    ];

    numericFields.forEach((field) => {
      if (data[field] !== undefined && data[field] !== '') {
        data[field] = Number(data[field]);
      }
    });

    // Handle file uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.log('Upload directory already exists or error creating:', error);
    }

    // Save management image
    if (files.mgtImage) {
      const file = files.mgtImage;
      const timestamp = Date.now();
      const filename = `mgt_support_${timestamp}_${file.name}`;
      const filepath = path.join(uploadDir, filename);
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);
      
      data.mgtImage = `/uploads/${filename}`;
      console.log('✅ Saved mgtImage:', filename);
    }

    // Save teacher images
    if (data.thaiMusicTeachers && Array.isArray(data.thaiMusicTeachers)) {
      for (let i = 0; i < data.thaiMusicTeachers.length; i++) {
        const fileKey = `teacherImage_${i}`;
        if (files[fileKey]) {
          const file = files[fileKey];
          const timestamp = Date.now();
          const filename = `teacher_support_${i}_${timestamp}_${file.name}`;
          const filepath = path.join(uploadDir, filename);
          
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          await writeFile(filepath, buffer);
          
          data.thaiMusicTeachers[i].teacherImage = `/uploads/${filename}`;
          console.log(`✅ Saved teacherImage_${i}:`, filename);
        }
      }
    }

    // Filter out empty array entries before saving
    if (data.awards && Array.isArray(data.awards)) {
      data.awards = data.awards.filter((award: any) => 
        award.awardName && award.awardName.trim() !== ''
      );
    }

    if (data.prActivities && Array.isArray(data.prActivities)) {
      data.prActivities = data.prActivities.filter((activity: any) => 
        activity.activityName && activity.activityName.trim() !== ''
      );
    }

    if (data.activitiesWithinProvinceInternal && Array.isArray(data.activitiesWithinProvinceInternal)) {
      data.activitiesWithinProvinceInternal = data.activitiesWithinProvinceInternal.filter((activity: any) => 
        activity.activityName && activity.activityName.trim() !== ''
      );
    }

    if (data.activitiesWithinProvinceExternal && Array.isArray(data.activitiesWithinProvinceExternal)) {
      data.activitiesWithinProvinceExternal = data.activitiesWithinProvinceExternal.filter((activity: any) => 
        activity.activityName && activity.activityName.trim() !== ''
      );
    }

    if (data.activitiesOutsideProvince && Array.isArray(data.activitiesOutsideProvince)) {
      data.activitiesOutsideProvince = data.activitiesOutsideProvince.filter((activity: any) => 
        activity.activityName && activity.activityName.trim() !== ''
      );
    }

    if (data.supportFromExternal && Array.isArray(data.supportFromExternal)) {
      data.supportFromExternal = data.supportFromExternal.filter((item: any) => 
        item.organization && item.organization.trim() !== ''
      );
    }

    if (data.supportFromOrg && Array.isArray(data.supportFromOrg)) {
      data.supportFromOrg = data.supportFromOrg.filter((item: any) => 
        item.organization && item.organization.trim() !== ''
      );
    }

    // Add metadata
    data.createdAt = new Date().toISOString();
    data.submittedAt = new Date().toISOString();
    data.status = 'pending';

    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db('thai_music_school');
    const collection = db.collection('register_support_submissions');
    
    // Insert document
    const result = await collection.insertOne(data);
    
    console.log('✅ Document inserted with ID:', result.insertedId);

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
      message: 'Form submitted successfully',
    });

  } catch (error) {
    console.error('❌ Error processing form:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
