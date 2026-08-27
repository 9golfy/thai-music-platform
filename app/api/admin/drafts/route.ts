import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

/**
 * GET /api/admin/drafts
 * Get all draft submissions with pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status') || 'all'; // all, active, expired
    const search = searchParams.get('search') || '';

    const { db } = await connectToDatabase();
    const draftsCollection = db.collection('draft_submissions');

    // Build query
    const query: any = {};
    
    // Filter by status
    if (status === 'active') {
      query.expiresAt = { $gt: new Date() };
      query.status = 'active';
    } else if (status === 'expired') {
      query.expiresAt = { $lte: new Date() };
    }

    // Search by email
    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }

    // Get total count
    const total = await draftsCollection.countDocuments(query);

    // Get drafts with pagination
    const drafts = await draftsCollection
      .find(query)
      .sort({ lastModified: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Format drafts
    const formattedDrafts = drafts.map((draft) => ({
      _id: draft._id.toString(),
      email: draft.email,
      phone: draft.phone,
      token: draft.token || draft.draftToken,
      submissionType: draft.submissionType,
      currentStep: draft.currentStep,
      status: draft.status,
      createdAt: draft.createdAt,
      lastModified: draft.lastModified,
      expiresAt: draft.expiresAt,
      saveCount: draft.saveCount || 0,
      isExpired: new Date(draft.expiresAt) < new Date(),
    }));

    return NextResponse.json({
      success: true,
      drafts: formattedDrafts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching drafts:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch drafts',
      },
      { status: 500 }
    );
  }
}
