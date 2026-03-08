import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { generateSchoolId, getNextSchoolIdSequence } from '@/lib/utils/schoolId';
import { hashPassword, generateTeacherPassword } from '@/lib/auth/password';
import { sendTeacherLoginInfoEmail } from '@/lib/email/mailer';
import { sendEmailWithRateLimit } from '@/lib/email/rateLimiter';

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
      'isCompulsorySubject', 'regsup_isCompulsorySubject',
      'hasAfterSchoolTeaching', 'regsup_hasAfterSchoolTeaching',
      'hasElectiveSubject', 'regsup_hasElectiveSubject',
      'hasLocalCurriculum', 'regsup_hasLocalCurriculum',
      'hasSupportFromOrg', 'regsup_hasSupportFromOrg',
      'hasSupportFromExternal', 'regsup_hasSupportFromExternal',
      'DCP_PR_Channel_FACEBOOK', 'regsup_DCP_PR_Channel_FACEBOOK',
      'DCP_PR_Channel_YOUTUBE', 'regsup_DCP_PR_Channel_YOUTUBE',
      'DCP_PR_Channel_Tiktok', 'regsup_DCP_PR_Channel_Tiktok',
      'heardFromOther', 'regsup_heardFromOther',
      'certifiedINFOByAdminName', 'regsup_certifiedINFOByAdminName',
    ];

    booleanFields.forEach((field) => {
      if (data[field] !== undefined) {
        data[field] = data[field] === 'true' || data[field] === true;
      }
    });

    // Convert numeric strings to numbers
    const numericFields = [
      'staffCount', 'regsup_staffCount',
      'studentCount', 'regsup_studentCount',
      'supportTypeMemberCount', 'regsup_supportTypeMemberCount',
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
    if (data.regsup_awards && Array.isArray(data.regsup_awards)) {
      data.regsup_awards = data.regsup_awards.filter((award: any) => 
        award.awardName && award.awardName.trim() !== ''
      );
    }

    if (data.prActivities && Array.isArray(data.prActivities)) {
      data.prActivities = data.prActivities.filter((activity: any) => 
        activity.activityName && activity.activityName.trim() !== ''
      );
    }
    if (data.regsup_prActivities && Array.isArray(data.regsup_prActivities)) {
      data.regsup_prActivities = data.regsup_prActivities.filter((activity: any) => 
        activity.activityName && activity.activityName.trim() !== ''
      );
    }

    if (data.activitiesWithinProvinceInternal && Array.isArray(data.activitiesWithinProvinceInternal)) {
      data.activitiesWithinProvinceInternal = data.activitiesWithinProvinceInternal.filter((activity: any) => 
        activity.activityName && activity.activityName.trim() !== ''
      );
    }
    if (data.regsup_activitiesWithinProvinceInternal && Array.isArray(data.regsup_activitiesWithinProvinceInternal)) {
      data.regsup_activitiesWithinProvinceInternal = data.regsup_activitiesWithinProvinceInternal.filter((activity: any) => 
        activity.activityName && activity.activityName.trim() !== ''
      );
    }

    if (data.activitiesWithinProvinceExternal && Array.isArray(data.activitiesWithinProvinceExternal)) {
      data.activitiesWithinProvinceExternal = data.activitiesWithinProvinceExternal.filter((activity: any) => 
        activity.activityName && activity.activityName.trim() !== ''
      );
    }
    if (data.regsup_activitiesWithinProvinceExternal && Array.isArray(data.regsup_activitiesWithinProvinceExternal)) {
      data.regsup_activitiesWithinProvinceExternal = data.regsup_activitiesWithinProvinceExternal.filter((activity: any) => 
        activity.activityName && activity.activityName.trim() !== ''
      );
    }

    if (data.activitiesOutsideProvince && Array.isArray(data.activitiesOutsideProvince)) {
      data.activitiesOutsideProvince = data.activitiesOutsideProvince.filter((activity: any) => 
        activity.activityName && activity.activityName.trim() !== ''
      );
    }
    if (data.regsup_activitiesOutsideProvince && Array.isArray(data.regsup_activitiesOutsideProvince)) {
      data.regsup_activitiesOutsideProvince = data.regsup_activitiesOutsideProvince.filter((activity: any) => 
        activity.activityName && activity.activityName.trim() !== ''
      );
    }

    if (data.supportFromExternal && Array.isArray(data.supportFromExternal)) {
      data.supportFromExternal = data.supportFromExternal.filter((item: any) => 
        item.organization && item.organization.trim() !== ''
      );
    }
    if (data.regsup_supportFromExternal && Array.isArray(data.regsup_supportFromExternal)) {
      data.regsup_supportFromExternal = data.regsup_supportFromExternal.filter((item: any) => 
        item.organization && item.organization.trim() !== ''
      );
    }

    if (data.supportFromOrg && Array.isArray(data.supportFromOrg)) {
      data.supportFromOrg = data.supportFromOrg.filter((item: any) => 
        item.organization && item.organization.trim() !== ''
      );
    }
    if (data.regsup_supportFromOrg && Array.isArray(data.regsup_supportFromOrg)) {
      data.regsup_supportFromOrg = data.regsup_supportFromOrg.filter((item: any) => 
        item.organization && item.organization.trim() !== ''
      );
    }

    // Calculate scores
    const calculateScores = (submissionData: any) => {
      let scores = {
        teacher_training_score: 0,
        teacher_qualification_score: 0,
        support_from_org_score: 0,
        support_from_external_score: 0,
        award_score: 0,
        activity_within_province_internal_score: 0,
        activity_within_province_external_score: 0,
        activity_outside_province_score: 0,
        pr_activity_score: 0,
        total_score: 0
      };

      // Helper function to get field value with both naming conventions
      const getFieldValue = (fieldName: string) => {
        return submissionData[`regsup_${fieldName}`] ?? submissionData[fieldName];
      };

      // Step 4: Teacher Training Score (4 checkboxes × 5 points each = 20 max)
      let trainingScore = 0;
      if (getFieldValue('isCompulsorySubject')) trainingScore += 5;
      if (getFieldValue('hasAfterSchoolTeaching')) trainingScore += 5;
      if (getFieldValue('hasElectiveSubject')) trainingScore += 5;
      if (getFieldValue('hasLocalCurriculum')) trainingScore += 5;
      scores.teacher_training_score = trainingScore;

      // Step 4: Teacher Qualification Score (unique qualifications × 5 points each = 20 max)
      const teachers = getFieldValue('thaiMusicTeachers') || [];
      const uniqueQualifications = new Set();
      if (Array.isArray(teachers)) {
        teachers.forEach((teacher: any) => {
          if (teacher.teacherQualification) {
            uniqueQualifications.add(teacher.teacherQualification);
          }
        });
      }
      scores.teacher_qualification_score = Math.min(uniqueQualifications.size * 5, 20);

      // Step 5: Support from Organization Score (checkbox = 5 points)
      scores.support_from_org_score = getFieldValue('hasSupportFromOrg') ? 5 : 0;

      // Step 5: Support from External Score (1=5, 2=10, 3+=15)
      const externalSupport = getFieldValue('supportFromExternal') || [];
      const externalCount = Array.isArray(externalSupport) ? externalSupport.length : 0;
      if (externalCount >= 3) scores.support_from_external_score = 15;
      else if (externalCount === 2) scores.support_from_external_score = 10;
      else if (externalCount === 1) scores.support_from_external_score = 5;

      // Step 5: Award Score (highest level: อำเภอ=5, จังหวัด=10, ภาค=15, ประเทศ=20)
      const awards = getFieldValue('awards') || [];
      let maxAwardScore = 0;
      if (Array.isArray(awards)) {
        awards.forEach((award: any) => {
          if (award.awardLevel === 'ประเทศ') maxAwardScore = Math.max(maxAwardScore, 20);
          else if (award.awardLevel === 'ภาค') maxAwardScore = Math.max(maxAwardScore, 15);
          else if (award.awardLevel === 'จังหวัด') maxAwardScore = Math.max(maxAwardScore, 10);
          else if (award.awardLevel === 'อำเภอ') maxAwardScore = Math.max(maxAwardScore, 5);
        });
      }
      scores.award_score = maxAwardScore;

      // Step 7: Activity Scores (≥3 activities = 5 points each)
      const internalActivities = getFieldValue('activitiesWithinProvinceInternal') || [];
      scores.activity_within_province_internal_score = (Array.isArray(internalActivities) && internalActivities.length >= 3) ? 5 : 0;

      const externalActivities = getFieldValue('activitiesWithinProvinceExternal') || [];
      scores.activity_within_province_external_score = (Array.isArray(externalActivities) && externalActivities.length >= 3) ? 5 : 0;

      const outsideActivities = getFieldValue('activitiesOutsideProvince') || [];
      scores.activity_outside_province_score = (Array.isArray(outsideActivities) && outsideActivities.length >= 3) ? 5 : 0;

      // Step 8: PR Activity Score (≥3 activities = 5 points)
      const prActivities = getFieldValue('prActivities') || [];
      scores.pr_activity_score = (Array.isArray(prActivities) && prActivities.length >= 3) ? 5 : 0;

      // Calculate total score
      scores.total_score = scores.teacher_training_score + 
                          scores.teacher_qualification_score + 
                          scores.support_from_org_score + 
                          scores.support_from_external_score + 
                          scores.award_score + 
                          scores.activity_within_province_internal_score + 
                          scores.activity_within_province_external_score + 
                          scores.activity_outside_province_score + 
                          scores.pr_activity_score;

      return scores;
    };

    // Calculate and add scores to data
    const calculatedScores = calculateScores(data);
    Object.assign(data, calculatedScores);

    // Add metadata
    data.createdAt = new Date().toISOString();
    data.submittedAt = new Date().toISOString();
    data.status = 'pending';

    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db('thai_music_school');
    const collection = db.collection('register_support_submissions');
    const usersCollection = db.collection('users');
    
    // Generate School ID - pass database instead of collection for global uniqueness
    const sequence = await getNextSchoolIdSequence(db);
    data.schoolId = generateSchoolId(sequence);
    console.log('✅ Generated School ID:', data.schoolId);

    // Extract teacher info
    const teacherEmail = data.teacherEmail;
    const teacherPhone = data.teacherPhone;

    if (!teacherEmail || !teacherPhone) {
      return NextResponse.json(
        {
          success: false,
          message: 'Teacher email and phone are required',
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      email: teacherEmail.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'An account with this email already exists. Please use a different email or contact support.',
        },
        { status: 400 }
      );
    }

    // Generate password for teacher
    const teacherPassword = generateTeacherPassword();
    const hashedPassword = await hashPassword(teacherPassword);

    // Create user account
    const newUser = {
      email: teacherEmail.toLowerCase(),
      password: hashedPassword,
      role: 'teacher',
      firstName: data.mgtFullName || 'Teacher',
      lastName: '',
      phone: teacherPhone,
      schoolId: data.schoolId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userResult = await usersCollection.insertOne(newUser);
    console.log('✅ Created user account:', userResult.insertedId);
    
    // Insert document
    const result = await collection.insertOne(data);
    console.log('✅ Document inserted with ID:', result.insertedId);

    // Send email to teacher with login info
    const emailResult = await sendEmailWithRateLimit(
      () => sendTeacherLoginInfoEmail(
        teacherEmail,
        teacherPhone,
        data.schoolName,
        data.schoolId,
        teacherPassword,
        'register_support',
        result.insertedId.toString()
      ),
      'high' // High priority for teacher login info
    );

    if (!emailResult.success) {
      console.error('⚠️ Failed to send teacher login email:', emailResult.error);
      if (emailResult.rateLimited) {
        console.error('📧 Teacher login email was rate limited');
      }
      // Don't fail the request - submission was successful even if email failed
    }

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
      schoolId: data.schoolId,
      message: 'Form submitted successfully',
      emailSent: emailResult.success,
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
