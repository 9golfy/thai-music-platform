import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const draftsCollection = db.collection('draft_submissions');
    
    // Get the latest draft
    const latestDraft = await draftsCollection
      .findOne(
        { status: 'active' },
        { sort: { createdAt: -1 } }
      );
    
    if (!latestDraft) {
      return NextResponse.json({
        success: false,
        error: 'No drafts found'
      });
    }
    
    return NextResponse.json({
      success: true,
      draft: latestDraft
    });
    
  } catch (error) {
    console.error('Error fetching latest draft:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}