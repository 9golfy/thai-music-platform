import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  console.log('📥 API Route called - Processing form submission...');
  try {
    const formData = await request.formData();
    console.log('✅ FormData received, processing fields...');
    
    const data: Record<string, any> = {};
    const files: Record<string, any> = {};
    
    console.log('📦 Processing FormData entries...');
    formData.forEach((value, key) => {
      console.log(`  - Key: "${key}", Type: ${value instanceof File ? 'File' : 'String'}, Value: ${value instanceof File ? value.name : (typeof value === 'string' && value.length > 50 ? value.substring(0, 50) + '...' : value)}`);
      
      if (value instanceof File) {
        console.log(`    ✅ File detected: ${value.name} (${value.size} bytes)`);
        if (key === 'mgtImage') {
          files.mgtImage = value;
          console.log('    📁 Stored as mgtImage');
        } else if (key === 'mediaPhotos') {
          if (!files.mediaPhotos) files.mediaPhotos = [];
          files.mediaPhotos.push(value);
          console.log('    📁 Stored as mediaPhotos');
        } else if (key.startsWith('teacherImage_')) {
          if (!files.teacherImages) files.teacherImages = [];
          files.teacherImages.push({ key, file: value });
          console.log(`    📁 Stored as teacherImages[${key}]`);
        }
      } else {
        try {
          data[key] = JSON.parse(value as string);
        } catch {
          data[key] = value;
        }
      }
    });
    
    console.log('📊 Files summary:');
    console.log('  - mgtImage:', files.mgtImage ? `${files.mgtImage.name} (${files.mgtImage.size} bytes)` : 'null');
    console.log('  - mediaPhotos:', files.mediaPhotos ? `${files.mediaPhotos.length} files` : 'null');
    console.log('  - teacherImages:', files.teacherImages ? `${files.teacherImages.length} files` : 'null');

    if (!data.schoolName) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกชื่อสถานศึกษา' },
        { status: 400 }
      );
    }

    if (!data.mgtFullName || !data.mgtPosition || !data.mgtPhone) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกข้อมูลผู้บริหารให้ครบถ้วน' },
        { status: 400 }
      );
    }

    if (data.certifiedINFOByAdminName !== 'true' && data.certifiedINFOByAdminName !== true) {
      return NextResponse.json(
        { success: false, message: 'กรุณายืนยันความถูกต้องของข้อมูล' },
        { status: 400 }
      );
    }

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    async function saveFile(file: File, prefix: string): Promise<string> {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const ext = file.name.split('.').pop();
      const filename = `${prefix}_${timestamp}_${randomStr}.${ext}`;
      const filepath = join(uploadsDir, filename);
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);
      
      return `/uploads/${filename}`;
    }

    let mgtImagePath = null;
    if (files.mgtImage) {
      mgtImagePath = await saveFile(files.mgtImage, 'manager');
    }

    const mediaPhotosPaths = [];
    if (files.mediaPhotos) {
      for (const photo of files.mediaPhotos) {
        const path = await saveFile(photo, 'media');
        mediaPhotosPaths.push(path);
      }
    }

    const teacherImagesPaths = [];
    if (files.teacherImages) {
      for (const item of files.teacherImages) {
        const path = await saveFile(item.file, `teacher_${item.key}`);
        teacherImagesPaths.push({
          key: item.key,
          path: path,
          name: item.file.name,
        });
      }
    }

    const { db } = await connectToDatabase();
    
    const doc = {
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      schoolName: data.schoolName,
      schoolProvince: data.schoolProvince,
      schoolLevel: data.schoolLevel,
      affiliation: data.affiliation,
      staffCount: data.staffCount,
      studentCount: data.studentCount,
      addressNo: data.addressNo,
      moo: data.moo,
      road: data.road,
      subDistrict: data.subDistrict,
      district: data.district,
      provinceAddress: data.provinceAddress,
      postalCode: data.postalCode,
      phone: data.phone,
      fax: data.fax,
      mgtFullName: data.mgtFullName,
      mgtPosition: data.mgtPosition,
      mgtPhone: data.mgtPhone,
      mgtEmail: data.mgtEmail,
      thaiMusicTeachers: data.thaiMusicTeachers || [],
      teacher_score: data.teacher_score || 0,
      currentTeachingPlans: data.currentTeachingPlans || [],
      availableInstruments: data.availableInstruments || [],
      externalInstructors: data.externalInstructors || [],
      inClassInstructionDurations: data.inClassInstructionDurations || [],
      outOfClassInstructionDurations: data.outOfClassInstructionDurations || [],
      supportFactors: data.supportFactors || [],
      awards: data.awards || [],
      classroomVideos: data.classroomVideos || [],
      performanceVideos: data.performanceVideos || [],
      teacherSkillThaiMusicMajor: data.teacherSkillThaiMusicMajor,
      curriculumFramework: data.curriculumFramework,
      photoGalleryLink: data.photoGalleryLink,
      instrumentSufficiency: data.instrumentSufficiency === 'true' || data.instrumentSufficiency === true,
      instrumentINSufficiency: data.instrumentINSufficiency === 'true' || data.instrumentINSufficiency === true,
      DCP_PR_Channel_FACEBOOK: data.DCP_PR_Channel_FACEBOOK === 'true' || data.DCP_PR_Channel_FACEBOOK === true,
      DCP_PR_Channel_YOUTUBE: data.DCP_PR_Channel_YOUTUBE === 'true' || data.DCP_PR_Channel_YOUTUBE === true,
      DCP_PR_Channel_Tiktok: data.DCP_PR_Channel_Tiktok === 'true' || data.DCP_PR_Channel_Tiktok === true,
      heardFromOther: data.heardFromOther === 'true' || data.heardFromOther === true,
      certifiedINFOByAdminName: true,
      mgtImage: mgtImagePath ? {
        path: mgtImagePath,
        name: (files.mgtImage as File).name,
        size: (files.mgtImage as File).size,
        type: (files.mgtImage as File).type,
      } : null,
      mediaPhotos: mediaPhotosPaths.map((path, index) => ({
        path: path,
        name: files.mediaPhotos[index].name,
        size: files.mediaPhotos[index].size,
        type: files.mediaPhotos[index].type,
      })),
      files: {
        mgtImage: mgtImagePath ? {
          path: mgtImagePath,
          name: (files.mgtImage as File).name,
          size: (files.mgtImage as File).size,
          type: (files.mgtImage as File).type,
        } : null,
        mediaPhotos: mediaPhotosPaths.map((path, index) => ({
          path: path,
          name: files.mediaPhotos[index].name,
          size: files.mediaPhotos[index].size,
          type: files.mediaPhotos[index].type,
        })),
        teacherImages: teacherImagesPaths,
      },
    };
    
    const result = await db.collection('register100_submissions').insertOne(doc);
    const submissionId = result.insertedId.toString();
    
    console.log('Form submission saved:', submissionId);

    return NextResponse.json({
      success: true,
      id: submissionId,
      message: 'ส่งแบบฟอร์มสำเร็จ',
    });
  } catch (error) {
    console.error('Error processing form submission:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการประมวลผลข้อมูล' },
      { status: 500 }
    );
  }
}
