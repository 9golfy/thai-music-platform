import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ API: Clearing all draft submissions...');
    
    const { db } = await connectToDatabase();
    const collection = db.collection('draft_submissions');
    
    // Count existing drafts first
    const count = await collection.countDocuments();
    console.log(`📊 Found ${count} draft submissions`);
    
    if (count === 0) {
      return NextResponse.json({
        success: true,
        message: 'No drafts to delete',
        deletedCount: 0
      });
    }
    
    // Show some examples before deleting
    const samples = await collection.find({}).limit(3).toArray();
    console.log('📋 Sample drafts to be deleted:');
    samples.forEach((draft, index) => {
      console.log(`   ${index + 1}. Token: ${draft.token}`);
      console.log(`      Email: ${draft.email}`);
      console.log(`      Type: ${draft.submissionType}`);
      console.log(`      Created: ${draft.createdAt}`);
    });
    
    // Delete all drafts
    const result = await collection.deleteMany({});
    
    console.log(`✅ Successfully deleted ${result.deletedCount} draft submissions`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} draft submissions`,
      deletedCount: result.deletedCount
    });
    
  } catch (error) {
    console.error('❌ Error clearing drafts:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to clear drafts',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}