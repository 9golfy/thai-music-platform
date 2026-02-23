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
    
    // Extract all form fields
    const data: Record<string, any> = {};
    const files: Record<string, any> = {};
    
    // Debug: Log all formData entries
    console.log('📋 FormData entries:');
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`  - ${key}: [File] ${value.name} (${value.size} bytes, ${value.type})`);
      } else {
        console.log(`  - ${key}: ${typeof value === 'string' && value.length > 100 ? value.substring(0, 100) + '...' : value}`);
      }
    });
    
    formData.forEach((value, key) => {
      if (value instanceof File) {
        // Handle file uploads
        if (key === 'mgtImage') {
          files.mgtImage = value;
          console.log(`✅ Manager image detected: ${value.name}`);
        } else if (key === 'mediaPhotos') {
          if (!files.mediaPhotos) {
            files.mediaPhotos = [];
          }
          files.mediaPhotos.push(value);
          console.log(`✅ Media photo detected: ${value.name}`);
        } else if (key.startsWith('teacherImage_')) {
          if (!files.teacherImages) {
            files.teacherImages = [];
          }
          files.teacherImages.push({ key, file: value });
          console.log(`✅ Teacher image detected: ${key} - ${value.name}`);
        }
      } else {
        // Try to parse JSON arrays
        try {
          data[key] = JSON.parse(value as string);
        } catch {
          // If not JSON, store as is
          data[key] = value;
        }
      }
    });

    // Validate required fields
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

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
      console.log('📁 Created uploads directory:', uploadsDir);
    }

    // Helper function to save file and return path
    async function saveFile(file: File, prefix: string): Promise<string> {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const ext = file.name.split('.').pop();
      const filename = `${prefix}_${timestamp}_${randomStr}.${ext}`;
      const filepath = join(uploadsDir, filename);
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);
      
      console.log(`✅ File saved: ${filename}`);
      return `/uploads/${filename}`;
    }

    // Save files to disk
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

    // Connect to MongoDB
    const { db } = await connectToDatabase();
    
    // Create document
    const doc = {
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      
      // Basic info
      schoolName: data.schoolName,
      schoolProvince: data.schoolProvince,
      schoolLevel: data.schoolLevel,
      affiliation: data.affiliation,
      staffCount: data.staffCount,
      studentCount: data.studentCount,
      
      // Address
      addressNo: data.addressNo,
      moo: data.moo,
      road: data.road,
      subDistrict: data.subDistrict,
      district: data.district,
      provinceAddress: data.provinceAddress,
      postalCode: data.postalCode,
      phone: data.phone,
      fax: data.fax,
      
      // Management
      mgtFullName: data.mgtFullName,
      mgtPosition: data.mgtPosition,
      mgtPhone: data.mgtPhone,
      mgtEmail: data.mgtEmail,
      
      // Arrays
      thaiMusicTeachers: data.thaiMusicTeachers || [],
      currentTeachingPlans: data.currentTeachingPlans || [],
      availableInstruments: data.availableInstruments || [],
      externalInstructors: data.externalInstructors || [],
      inClassInstructionDurations: data.inClassInstructionDurations || [],
      outOfClassInstructionDurations: data.outOfClassInstructionDurations || [],
      supportFactors: data.supportFactors || [],
      awards: data.awards || [],
      classroomVideos: data.classroomVideos || [],
      performanceVideos: data.performanceVideos || [],
      
      // Step 5 fields
      teacherSkillThaiMusicMajor: data.teacherSkillThaiMusicMajor,
      curriculumFramework: data.curriculumFramework,
      
      // Step 6 fields
      photoGalleryLink: data.photoGalleryLink,
      
      // Booleans
      instrumentSufficiency: data.instrumentSufficiency === 'true' || data.instrumentSufficiency === true,
      instrumentINSufficiency: data.instrumentINSufficiency === 'true' || data.instrumentINSufficiency === true,
      DCP_PR_Channel_FACEBOOK: data.DCP_PR_Channel_FACEBOOK === 'true' || data.DCP_PR_Channel_FACEBOOK === true,
      DCP_PR_Channel_YOUTUBE: data.DCP_PR_Channel_YOUTUBE === 'true' || data.DCP_PR_Channel_YOUTUBE === true,
      DCP_PR_Channel_Tiktok: data.DCP_PR_Channel_Tiktok === 'true' || data.DCP_PR_Channel_Tiktok === true,
      heardFromOther: data.heardFromOther === 'true' || data.heardFromOther === true,
      certifiedINFOByAdminName: true,
      
      // File metadata at root level (matching DB structure)
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
      
      // Nested files object for additional file metadata
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
    
    // Insert into MongoDB
    const result = await db.collection('register69_submissions').insertOne(doc);
    
    const submissionId = result.insertedId.toString();
    
    console.log('Form submission saved to MongoDB:', {
      id: submissionId,
      schoolName: data.schoolName,
      mgtFullName: data.mgtFullName,
      filesReceived: {
        mgtImage: !!files.mgtImage,
        mgtImagePath: mgtImagePath || 'none',
        mediaPhotosCount: mediaPhotosPaths.length,
        teacherImagesCount: teacherImagesPaths.length,
      },
    });

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
