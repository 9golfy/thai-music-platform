import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { randomUUID } from 'crypto';

/**
 * POST /api/admin/drafts/[id]/refresh-token
 * Refresh token for a draft submission
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { days = 30 } = body; // Default 30 days

    // Validate days
    if (typeof days !== 'number' || days < 1 || days > 90) {
      return NextResponse.json(
        {
          success: false,
          message: 'Days must be between 1 and 90',
        },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const draftsCollection = db.collection('draft_submissions');

    // Find draft
    const draft = await draftsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!draft) {
      return NextResponse.json(
        {
          success: false,
          message: 'Draft not found',
        },
        { status: 404 }
      );
    }

    // Generate new token
    const newToken = randomUUID();
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + days);

    // Update draft
    const result = await draftsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          token: newToken,
          draftToken: newToken,
          expiresAt: newExpiresAt,
          lastModified: new Date(),
          status: 'active',
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to refresh token',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
        expiresAt: newExpiresAt.toISOString(),
        draftLink: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://dcpschool100.net'}/draft/${newToken}`,
      },
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to refresh token',
      },
      { status: 500 }
    );
  }
}
