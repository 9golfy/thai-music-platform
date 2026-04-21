// Certificate Templates API - Manage template name to image mappings
import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getSession } from '@/lib/auth/session';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'thai_music_school';

// GET - List all saved templates
export async function GET() {
  const session = await getSession();

  if (!session || !['root', 'admin', 'super_admin'].includes(session.role)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    const templatesCollection = database.collection('certificate_templates');

    const templates = await templatesCollection
      .find({ isActive: true })
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      templates: templates.map((t) => ({
        ...t,
        _id: t._id.toString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch templates' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// POST - Save/Update template
export async function POST(request: Request) {
  const session = await getSession();

  if (!session || !['root', 'admin', 'super_admin'].includes(session.role)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized - กรุณาเข้าสู่ระบบใหม่' },
      { status: 401 }
    );
  }

  const client = new MongoClient(uri);

  try {
    const body = await request.json();
    const { name, imageUrl } = body;

    if (!name || !imageUrl) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // Extract base64 data
    const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Determine file extension from base64 header
    const matches = imageUrl.match(/^data:image\/(\w+);base64,/);
    const extension = matches ? matches[1] : 'png';
    
    // Create filename
    const filename = `${name}-${Date.now()}.${extension}`;
    const filepath = `./public/certificates/templates/${filename}`;
    const publicPath = `/certificates/templates/${filename}`;

    // Save file to disk
    const fs = require('fs').promises;
    const path = require('path');
    
    // Ensure directory exists
    const dir = path.dirname(filepath);
    await fs.mkdir(dir, { recursive: true });
    
    // Write file
    await fs.writeFile(filepath, buffer);
    
    console.log(`Saved template image to: ${filepath}`);

    await client.connect();
    const database = client.db(dbName);
    const templatesCollection = database.collection('certificate_templates');

    // Check if template with this name already exists
    const existingTemplate = await templatesCollection.findOne({ name, isActive: true });

    if (existingTemplate) {
      // Delete old file if exists
      if (existingTemplate.imageUrl && existingTemplate.imageUrl.startsWith('/certificates/')) {
        try {
          const oldFilepath = `./public${existingTemplate.imageUrl}`;
          await fs.unlink(oldFilepath);
          console.log(`Deleted old template file: ${oldFilepath}`);
        } catch (err) {
          console.warn('Could not delete old file:', err);
        }
      }

      // Update existing template
      const result = await templatesCollection.updateOne(
        { name, isActive: true },
        {
          $set: {
            imageUrl: publicPath,
            updatedBy: session.userId,
            updatedAt: new Date(),
          },
        }
      );

      console.log(`Updated template "${name}":`, result);

      return NextResponse.json({
        success: true,
        message: 'อัพเดต template สำเร็จ',
      });
    } else {
      // Create new template
      const newTemplate = {
        name,
        imageUrl: publicPath,
        isActive: true,
        createdBy: session.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await templatesCollection.insertOne(newTemplate);
      console.log(`Created template "${name}":`, result);

      return NextResponse.json({
        success: true,
        message: 'บันทึก template สำเร็จ',
      });
    }
  } catch (error: any) {
    console.error('Error saving template:', error);
    
    // More specific error messages
    let errorMessage = 'เกิดข้อผิดพลาดในการบันทึก template';
    
    if (error.code === 'EACCES') {
      errorMessage = 'ไม่มีสิทธิ์เขียนไฟล์ กรุณาติดต่อผู้ดูแลระบบ';
    } else if (error.code === 'ENOSPC') {
      errorMessage = 'พื้นที่เก็บข้อมูลเต็ม กรุณาติดต่อผู้ดูแลระบบ';
    }
    
    return NextResponse.json(
      { success: false, message: errorMessage, error: error.message },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// DELETE - Delete template by name
export async function DELETE(request: Request) {
  const session = await getSession();

  if (!session || !['root', 'admin', 'super_admin'].includes(session.role)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const client = new MongoClient(uri);

  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'กรุณาระบุชื่อ Template' },
        { status: 400 }
      );
    }

    await client.connect();
    const database = client.db(dbName);
    const templatesCollection = database.collection('certificate_templates');

    // Find template to get imageUrl before deleting
    const template = await templatesCollection.findOne({ name, isActive: true });

    if (!template) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบ Template ที่ต้องการลบ' },
        { status: 404 }
      );
    }

    // Delete image file if exists
    if (template.imageUrl && template.imageUrl.startsWith('/certificates/')) {
      try {
        const fs = require('fs').promises;
        const filepath = `./public${template.imageUrl}`;
        await fs.unlink(filepath);
        console.log(`Deleted template file: ${filepath}`);
      } catch (err) {
        console.warn('Could not delete template file:', err);
      }
    }

    // Soft delete - set isActive to false
    await templatesCollection.updateOne(
      { name, isActive: true },
      {
        $set: {
          isActive: false,
          deletedBy: session.userId,
          deletedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: 'ลบ Template สำเร็จ',
    });
  } catch (error: any) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลบ Template', error: error.message },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
