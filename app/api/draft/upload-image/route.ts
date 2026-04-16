import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const draftToken = formData.get('draftToken') as string;
    const imageType = formData.get('imageType') as string; // 'manager' or 'teacher-0', 'teacher-1', etc.

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only JPG, JPEG, PNG allowed' },
        { status: 400 }
      );
    }

    // Validate file size (1MB)
    if (file.size > 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds 1MB limit' },
        { status: 400 }
      );
    }

    // Create draft-images directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'draft-images');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = path.extname(file.name);
    const fileName = `${draftToken || 'temp'}-${imageType}-${timestamp}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return public URL
    const publicUrl = `/draft-images/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error('Error uploading draft image:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
