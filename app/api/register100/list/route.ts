import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin';
const dbName = process.env.MONGO_DB || 'thai_music_school';

export async function GET(request: Request) {
  const client = new MongoClient(uri);

  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const loadAll = searchParams.get('loadAll') === 'true';
    const province = searchParams.get('province') || '';
    const level = searchParams.get('level') || '';
    const search = searchParams.get('search') || '';

    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection('register100_submissions');

    // Build MongoDB query
    const query: any = {};
    
    // Filter by province
    if (province) {
      query.reg100_schoolProvince = province;
    }
    
    // Filter by level
    if (level) {
      query.reg100_schoolLevel = level;
    }
    
    // Search by school name or school ID
    if (search) {
      const searchRegex = new RegExp(search.replace(/-/g, ''), 'i'); // Remove hyphens for flexible search
      
      // Use simple string matching for Thai characters
      // MongoDB regex with 'i' flag works for Thai, but we need to escape special regex characters
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      query.$or = [
        { reg100_schoolName: { $regex: escapedSearch, $options: 'i' } },
        { schoolId: { $regex: searchRegex } },
      ];
    }

    // Get all submissions sorted by createdAt descending (newest first)
    const submissions = await collection
      .find(query)
      .sort({ createdAt: -1, _id: -1 })
      .toArray();

    // Convert ObjectId to string
    const formattedSubmissions = submissions.map(sub => ({
      ...sub,
      _id: sub._id.toString(),
    }));

    // If loadAll=true, return everything (for export/filtering on frontend)
    if (loadAll) {
      return NextResponse.json({
        success: true,
        submissions: formattedSubmissions,
        count: formattedSubmissions.length,
        total: formattedSubmissions.length,
        page: 1,
        limit: formattedSubmissions.length,
        totalPages: 1,
      });
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSubmissions = formattedSubmissions.slice(startIndex, endIndex);
    const totalPages = Math.ceil(formattedSubmissions.length / limit);

    return NextResponse.json({
      success: true,
      submissions: paginatedSubmissions,
      count: paginatedSubmissions.length,
      total: formattedSubmissions.length,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
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
