// Certificate Templates API - Manage template name to image mappings
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { getSession } from '@/lib/auth/session';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'thai_music_school';

// GET - List all saved templates
export async function GET() {
  const session = await getSession();

  if (!session || !['root', 'admin'].includes(session.role)) {
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

  if (!session || !['root', 'admin'].includes(session.role)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
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

    await client.connect();
    const database = client.db(dbName);
    const templatesCollection = database.collection('certificate_templates');

    // Check if template with this name already exists
    const existingTemplate = await templatesCollection.findOne({ name, isActive: true });

    if (existingTemplate) {
      // Update existing template
      await templatesCollection.updateOne(
        { name, isActive: true },
        {
          $set: {
            imageUrl,
            updatedBy: session.userId,
            updatedAt: new Date(),
          },
        }
      );

      return NextResponse.json({
        success: true,
        message: 'อัพเดต template สำเร็จ',
      });
    } else {
      // Create new template
      const newTemplate = {
        name,
        imageUrl,
        isActive: true,
        createdBy: session.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await templatesCollection.insertOne(newTemplate);

      return NextResponse.json({
        success: true,
        message: 'บันทึก template สำเร็จ',
      });
    }
  } catch (error) {
    console.error('Error saving template:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการบันทึก template' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
