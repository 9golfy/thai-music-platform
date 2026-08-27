/**
 * Admin API to check draft status
 * GET /api/admin/check-draft?search=<email_or_token>
 * 
 * For customer support use only
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'dcp_admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const searchParams = request.nextUrl.searchParams;
    const searchValue = searchParams.get('search');
    
    if (!searchValue) {
      return NextResponse.json(
        { success: false, message: 'Search value required' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    const isEmail = searchValue.includes('@');
    
    if (isEmail) {
      // Search by email
      const [activeDrafts, submittedDrafts, expiredDrafts, supportSubmissions, register100Submissions] = await Promise.all([
        // Active drafts
        db.collection('draft_submissions')
          .find({ 
            email: searchValue.toLowerCase(),
            status: 'active'
          })
          .sort({ lastModified: -1 })
          .toArray(),
        
        // Submitted drafts
        db.collection('draft_submissions')
          .find({ 
            email: searchValue.toLowerCase(),
            status: 'submitted'
          })
          .sort({ lastModified: -1 })
          .limit(5)
          .toArray(),
        
        // Expired drafts
        db.collection('draft_submissions')
          .find({ 
            email: searchValue.toLowerCase(),
            expiresAt: { $lt: new Date() }
          })
          .sort({ lastModified: -1 })
          .limit(5)
          .toArray(),
        
        // Support submissions
        db.collection('register_support_submissions')
          .find({ teacherEmail: searchValue.toLowerCase() })
          .sort({ createdAt: -1 })
          .limit(5)
          .toArray(),
        
        // Register100 submissions
        db.collection('register100_submissions')
          .find({ teacherEmail: searchValue.toLowerCase() })
          .sort({ createdAt: -1 })
          .limit(5)
          .toArray()
      ]);
      
      return NextResponse.json({
        success: true,
        searchType: 'email',
        email: searchValue,
        data: {
          activeDrafts: activeDrafts.map(d => ({
            token: d.draftToken || d.token,
            type: d.submissionType,
            status: d.status,
            currentStep: d.currentStep,
            created: d.createdAt,
            lastModified: d.lastModified,
            expires: d.expiresAt,
            isExpired: new Date(d.expiresAt) < new Date()
          })),
          submittedDrafts: submittedDrafts.map(d => ({
            token: d.draftToken || d.token,
            type: d.submissionType,
            submitted: d.lastModified
          })),
          expiredDrafts: expiredDrafts.map(d => ({
            token: d.draftToken || d.token,
            type: d.submissionType,
            expired: d.expiresAt
          })),
          submissions: {
            support: supportSubmissions.map(s => ({
              schoolId: s.schoolId,
              schoolName: s.schoolName,
              created: s.createdAt
            })),
            register100: register100Submissions.map(s => ({
              schoolId: s.schoolId,
              schoolName: s.schoolName,
              created: s.createdAt
            }))
          }
        }
      });
      
    } else {
      // Search by token
      const draft = await db.collection('draft_submissions')
        .findOne({
          $or: [
            { draftToken: searchValue.toLowerCase() },
            { token: searchValue.toLowerCase() }
          ]
        });
      
      if (!draft) {
        return NextResponse.json({
          success: true,
          searchType: 'token',
          found: false,
          message: 'Draft not found. It may have been deleted, submitted, or expired.',
          possibleReasons: [
            'Draft was submitted and deleted',
            'Draft was manually deleted by user',
            'Draft expired and was cleaned up',
            'Invalid token'
          ]
        });
      }
      
      const isExpired = new Date(draft.expiresAt) < new Date();
      
      return NextResponse.json({
        success: true,
        searchType: 'token',
        found: true,
        data: {
          email: draft.email,
          phone: draft.phone || null,
          type: draft.submissionType,
          status: draft.status,
          currentStep: draft.currentStep,
          created: draft.createdAt,
          lastModified: draft.lastModified,
          expires: draft.expiresAt,
          isExpired,
          isSubmitted: draft.status === 'submitted',
          warnings: [
            ...(isExpired ? ['⚠️ This draft has expired'] : []),
            ...(draft.status === 'submitted' ? ['⚠️ This draft has been submitted'] : [])
          ]
        }
      });
    }
    
  } catch (error) {
    console.error('Error checking draft status:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
