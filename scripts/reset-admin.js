// Using built-in fetch (Node.js 18+)

async function resetAdmin() {
  try {
    console.log('🔄 Creating new admin user...');
    
    const response = await fetch('http://localhost:3000/api/admin/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'root@thaimusic.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User'
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Admin user created successfully');
    } else {
      console.log('⚠️ Admin setup result:', result.message);
    }
    
  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
  }
}

resetAdmin();