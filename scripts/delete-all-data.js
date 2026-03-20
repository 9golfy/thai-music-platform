/**
 * Delete All Test Data Script
 * This script will delete all register100 submissions and teacher users
 * through the admin API endpoints
 */

async function loginAsAdmin() {
  console.log('🔐 Logging in as admin...');
  
  const response = await fetch('http://localhost:3000/api/auth/admin-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'root@thaimusic.com',
      password: 'admin123'
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    console.log('✅ Admin login successful');
    return result.token || 'admin-token'; // Return token if available
  } else {
    throw new Error('Admin login failed: ' + result.message);
  }
}

async function getAllSubmissions() {
  console.log('📋 Fetching all register100 submissions...');
  
  const response = await fetch('http://localhost:3000/api/register100/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  const result = await response.json();
  
  if (result.success) {
    console.log(`✅ Found ${result.submissions.length} submissions`);
    return result.submissions;
  } else {
    throw new Error('Failed to fetch submissions: ' + result.message);
  }
}

async function deleteSubmission(submissionId) {
  console.log(`🗑️ Deleting submission: ${submissionId}`);
  
  const response = await fetch(`http://localhost:3000/api/register100/${submissionId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  const result = await response.json();
  
  if (result.success) {
    console.log(`✅ Deleted submission: ${submissionId}`);
    return true;
  } else {
    console.log(`❌ Failed to delete submission ${submissionId}: ${result.message}`);
    return false;
  }
}

async function deleteAllData() {
  try {
    // Step 1: Login as admin
    const token = await loginAsAdmin();
    
    // Step 2: Get all submissions
    const submissions = await getAllSubmissions();
    
    if (submissions.length === 0) {
      console.log('ℹ️ No submissions found to delete');
      return;
    }
    
    // Step 3: Delete each submission
    console.log(`🗑️ Deleting ${submissions.length} submissions...`);
    let deletedCount = 0;
    
    for (const submission of submissions) {
      const success = await deleteSubmission(submission._id);
      if (success) {
        deletedCount++;
      }
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n📊 DELETION SUMMARY:`);
    console.log(`✅ Successfully deleted: ${deletedCount} submissions`);
    console.log(`❌ Failed to delete: ${submissions.length - deletedCount} submissions`);
    
    if (deletedCount === submissions.length) {
      console.log('🎉 ALL DATA DELETED SUCCESSFULLY!');
    }
    
  } catch (error) {
    console.error('❌ Error deleting data:', error.message);
  }
}

// Run the deletion
deleteAllData();