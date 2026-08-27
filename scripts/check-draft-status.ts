/**
 * Script to check draft status for customer support
 * Usage: npx tsx scripts/check-draft-status.ts <email_or_token>
 */

import { connectToDatabase } from '@/lib/mongodb';

async function checkDraftStatus(searchValue: string) {
  try {
    const { db } = await connectToDatabase();
    
    console.log('🔍 Searching for:', searchValue);
    console.log('='.repeat(60));
    
    // Determine if search value is email or token
    const isEmail = searchValue.includes('@');
    
    if (isEmail) {
      // Search by email
      console.log('\n📧 Searching by email...\n');
      
      // 1. Check active drafts
      const activeDrafts = await db.collection('draft_submissions')
        .find({ 
          email: searchValue.toLowerCase(),
          status: 'active'
        })
        .sort({ lastModified: -1 })
        .toArray();
      
      console.log(`✅ Active Drafts: ${activeDrafts.length}`);
      activeDrafts.forEach((draft, index) => {
        console.log(`\n  Draft ${index + 1}:`);
        console.log(`    Token: ${draft.draftToken || draft.token}`);
        console.log(`    Type: ${draft.submissionType}`);
        console.log(`    Status: ${draft.status}`);
        console.log(`    Created: ${draft.createdAt}`);
        console.log(`    Last Modified: ${draft.lastModified}`);
        console.log(`    Expires: ${draft.expiresAt}`);
        console.log(`    Expired: ${new Date(draft.expiresAt) < new Date() ? '❌ YES' : '✅ NO'}`);
      });
      
      // 2. Check submitted drafts
      const submittedDrafts = await db.collection('draft_submissions')
        .find({ 
          email: searchValue.toLowerCase(),
          status: 'submitted'
        })
        .sort({ lastModified: -1 })
        .limit(5)
        .toArray();
      
      console.log(`\n📤 Submitted Drafts: ${submittedDrafts.length}`);
      submittedDrafts.forEach((draft, index) => {
        console.log(`\n  Draft ${index + 1}:`);
        console.log(`    Token: ${draft.draftToken || draft.token}`);
        console.log(`    Type: ${draft.submissionType}`);
        console.log(`    Submitted: ${draft.lastModified}`);
      });
      
      // 3. Check expired drafts
      const expiredDrafts = await db.collection('draft_submissions')
        .find({ 
          email: searchValue.toLowerCase(),
          expiresAt: { $lt: new Date() }
        })
        .sort({ lastModified: -1 })
        .limit(5)
        .toArray();
      
      console.log(`\n⏰ Expired Drafts: ${expiredDrafts.length}`);
      expiredDrafts.forEach((draft, index) => {
        console.log(`\n  Draft ${index + 1}:`);
        console.log(`    Token: ${draft.draftToken || draft.token}`);
        console.log(`    Type: ${draft.submissionType}`);
        console.log(`    Expired: ${draft.expiresAt}`);
      });
      
      // 4. Check actual submissions
      console.log('\n📋 Checking actual submissions...\n');
      
      const supportSubmissions = await db.collection('register_support_submissions')
        .find({ teacherEmail: searchValue.toLowerCase() })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray();
      
      console.log(`  Register Support: ${supportSubmissions.length} submissions`);
      supportSubmissions.forEach((sub, index) => {
        console.log(`    ${index + 1}. School: ${sub.schoolName}, Created: ${sub.createdAt}`);
      });
      
      const register100Submissions = await db.collection('register100_submissions')
        .find({ teacherEmail: searchValue.toLowerCase() })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray();
      
      console.log(`  Register 100: ${register100Submissions.length} submissions`);
      register100Submissions.forEach((sub, index) => {
        console.log(`    ${index + 1}. School: ${sub.schoolName}, Created: ${sub.createdAt}`);
      });
      
    } else {
      // Search by token
      console.log('\n🔑 Searching by token...\n');
      
      const draft = await db.collection('draft_submissions')
        .findOne({
          $or: [
            { draftToken: searchValue.toLowerCase() },
            { token: searchValue.toLowerCase() }
          ]
        });
      
      if (!draft) {
        console.log('❌ Draft NOT FOUND');
        console.log('\nPossible reasons:');
        console.log('  1. Draft was submitted and deleted');
        console.log('  2. Draft was manually deleted by user');
        console.log('  3. Draft expired and was cleaned up');
        console.log('  4. Invalid token');
        
        // Try to find in submitted drafts
        const submittedDraft = await db.collection('draft_submissions')
          .findOne({
            $or: [
              { draftToken: searchValue.toLowerCase() },
              { token: searchValue.toLowerCase() }
            ],
            status: 'submitted'
          });
        
        if (submittedDraft) {
          console.log('\n✅ Found in submitted drafts!');
          console.log(`  Email: ${submittedDraft.email}`);
          console.log(`  Submitted: ${submittedDraft.lastModified}`);
        }
      } else {
        console.log('✅ Draft FOUND\n');
        console.log(`  Email: ${draft.email}`);
        console.log(`  Phone: ${draft.phone || 'N/A'}`);
        console.log(`  Type: ${draft.submissionType}`);
        console.log(`  Status: ${draft.status}`);
        console.log(`  Current Step: ${draft.currentStep}`);
        console.log(`  Created: ${draft.createdAt}`);
        console.log(`  Last Modified: ${draft.lastModified}`);
        console.log(`  Expires: ${draft.expiresAt}`);
        console.log(`  Expired: ${new Date(draft.expiresAt) < new Date() ? '❌ YES' : '✅ NO'}`);
        
        if (draft.status === 'submitted') {
          console.log('\n⚠️  This draft has been submitted');
        }
        
        if (new Date(draft.expiresAt) < new Date()) {
          console.log('\n⚠️  This draft has expired');
        }
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Check complete');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

// Get search value from command line
const searchValue = process.argv[2];

if (!searchValue) {
  console.error('❌ Please provide email or token');
  console.log('\nUsage:');
  console.log('  npx tsx scripts/check-draft-status.ts <email>');
  console.log('  npx tsx scripts/check-draft-status.ts <token>');
  console.log('\nExamples:');
  console.log('  npx tsx scripts/check-draft-status.ts user@example.com');
  console.log('  npx tsx scripts/check-draft-status.ts abc123def456');
  process.exit(1);
}

checkDraftStatus(searchValue);
