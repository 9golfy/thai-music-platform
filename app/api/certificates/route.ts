// Certificates API - List and Create
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { getSession } from '@/lib/auth/session';

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

// GET - List all certificates
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
    const certificatesCollection = database.collection('certificates');

    const certificates = await certificatesCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      certificates: certificates.map((cert) => ({
        ...cert,
        _id: cert._id.toString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch certificates' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// POST - Create new certificate
export async function POST(request: Request) {
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
    const { schoolId, certificateType, templateName } = body;

    if (!schoolId || !certificateType || !templateName) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    await client.connect();
    const database = client.db(dbName);

    // Get school name by schoolId field (not _id)
    const collectionName =
      certificateType === 'register100'
        ? 'register100_submissions'
        : 'register_support_submissions';
    const schoolsCollection = database.collection(collectionName);
    const school = await schoolsCollection.findOne({ schoolId: schoolId });

    if (!school) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลโรงเรียน' },
        { status: 404 }
      );
    }

    // Verify template exists
    const templatesCollection = database.collection('certificate_templates');
    const template = await templatesCollection.findOne({ 
      name: templateName, 
      isActive: true 
    });

    if (!template) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบ Template ที่เลือก' },
        { status: 404 }
      );
    }

    // Check if certificate already exists
    const certificatesCollection = database.collection('certificates');
    const existingCert = await certificatesCollection.findOne({
      schoolId: schoolId.toString(),
      isActive: true,
    });

    if (existingCert) {
      return NextResponse.json(
        { success: false, message: 'โรงเรียนนี้มีใบประกาศแล้ว' },
        { status: 400 }
      );
    }

    // Generate unique certificate number using timestamp + random
    const year = new Date().getFullYear() + 543; // Thai year
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    const certificateNumber = `CERT-${year}-${timestamp}${random}`;

    // Double check for uniqueness (very unlikely but safe)
    const existingCertNumber = await certificatesCollection.findOne({
      certificateNumber: certificateNumber
    });

    if (existingCertNumber) {
      // If by chance it exists, add more randomness
      const extraRandom = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const certificateNumber = `CERT-${year}-${timestamp}${random}${extraRandom}`;
    }

    // Get school name based on certificate type
    let schoolName = school.schoolName;
    if (certificateType === 'register-support' && school.regsup_schoolName) {
      schoolName = school.regsup_schoolName;
    } else if (certificateType === 'register100' && school.reg100_schoolName) {
      schoolName = school.reg100_schoolName;
    }

    // Create certificate
    const newCertificate = {
      schoolId: schoolId.toString(),
      schoolName: schoolName,
      certificateType,
      templateName, // Store template name instead of ID
      certificateNumber,
      issueDate: new Date(),
      isActive: true,
      createdBy: session.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await certificatesCollection.insertOne(newCertificate);

    return NextResponse.json({
      success: true,
      message: 'สร้างใบประกาศสำเร็จ',
      certificateId: result.insertedId.toString(),
      certificateNumber,
    });
  } catch (error) {
    console.error('Error creating certificate:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการสร้างใบประกาศ' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
