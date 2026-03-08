import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

/**
 * POST /api/admin/migrate-data
 * 
 * Migrate data from one database to another
 * This is for admin use only - requires authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { sourceData, targetCollections } = await request.json();

    if (!sourceData || !targetCollections) {
      return NextResponse.json(
        { success: false, error: 'Missing required data' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const results = [];

    // Migrate each collection
    for (const [collectionName, documents] of Object.entries(sourceData)) {
      if (!targetCollections.includes(collectionName)) {
        continue; // Skip collections not in target list
      }

      const collection = db.collection(collectionName);
      
      // Clear existing data (optional - remove if you want to merge)
      // await collection.deleteMany({});
      
      // Insert new data
      if (Array.isArray(documents) && documents.length > 0) {
        const result = await collection.insertMany(documents);
        results.push({
          collection: collectionName,
          inserted: result.insertedCount,
          success: true
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Data migration completed',
      results
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Migration failed'
      },
      { status: 500 }
    );
  }
}