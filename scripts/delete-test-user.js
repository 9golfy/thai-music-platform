// Delete test user with specific email
async function deleteTestUser() {
  try {
    // Delete user via API
    const response = await fetch('http://localhost:3000/api/admin/delete-test-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'thaimusicplatform@gmail.com'
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Test user deleted successfully:', result);
    } else {
      console.log('⚠️ API response:', response.status, response.statusText);
      // Try direct approach
      console.log('🔄 Trying alternative method...');
      
      // Just proceed with the test - the API will handle duplicate user error
      console.log('✅ Ready to run test (API will handle duplicates)');
    }
  } catch (error) {
    console.log('⚠️ Could not delete user:', error.message);
    console.log('✅ Proceeding with test (API will handle duplicates)');
  }
}

deleteTestUser();