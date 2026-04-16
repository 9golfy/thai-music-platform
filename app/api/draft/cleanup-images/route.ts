import { NextRequest, NextResponse } from 'next/server';
import { unlink, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { draftToken } = await request.json();

    if (!draftToken) {
      return NextResponse.json(
        { success: false, message: 'No draft token provided' },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), 'public', 'draft-images');
    
    if (!existsSync(uploadDir)) {
      return NextResponse.json({
        success: true,
        message: 'No draft images directory found',
        deletedCount: 0,
      });
    }

    // Read all files in draft-images directory
    const files = await readdir(uploadDir);
    
    // Filter files that match the draft token
    const filesToDelete = files.filter(file => file.startsWith(draftToken));
    
    // Delete matching files
    let deletedCount = 0;
    for (const file of filesToDelete) {
      try {
        const filePath = path.join(uploadDir, file);
        await unlink(filePath);
        deletedCount++;
        console.log(`🗑️ Deleted draft image: ${file}`);
      } catch (error) {
        console.error(`Error deleting file ${file}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedCount} draft images`,
      deletedCount,
    });
  } catch (error) {
    console.error('Error cleaning up draft images:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to cleanup draft images' },
      { status: 500 }
    );
  }
}

// Cleanup old draft images (older than 7 days)
export async function DELETE() {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'draft-images');
    
    if (!existsSync(uploadDir)) {
      return NextResponse.json({
        success: true,
        message: 'No draft images directory found',
        deletedCount: 0,
      });
    }

    const files = await readdir(uploadDir);
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    let deletedCount = 0;
    for (const file of files) {
      if (file === '.gitignore') continue;
      
      try {
        const filePath = path.join(uploadDir, file);
        const stats = await import('fs/promises').then(fs => fs.stat(filePath));
        
        // Delete if older than 7 days
        if (stats.mtimeMs < sevenDaysAgo) {
          await unlink(filePath);
          deletedCount++;
          console.log(`🗑️ Deleted old draft image: ${file}`);
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedCount} old draft images`,
      deletedCount,
    });
  } catch (error) {
    console.error('Error cleaning up old draft images:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to cleanup old draft images' },
      { status: 500 }
    );
  }
}
