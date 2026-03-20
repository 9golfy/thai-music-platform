const http = require('http');

async function testUsersPageAccess() {
  console.log('🌐 Testing Users Page Access...\n');
  
  // First, login to get session cookie
  console.log('🔐 Step 1: Login to get session...');
  
  const loginData = JSON.stringify({
    email: 'root@thaimusic.com',
    password: 'P@sswordAdmin123'
  });
  
  const loginOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/admin-login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };
  
  return new Promise((resolve, reject) => {
    const loginReq = http.request(loginOptions, (loginRes) => {
      console.log(`   Login Status: ${loginRes.statusCode}`);
      
      let loginResponseData = '';
      
      loginRes.on('data', (chunk) => {
        loginResponseData += chunk;
      });
      
      loginRes.on('end', () => {
        try {
          const loginResult = JSON.parse(loginResponseData);
          
          if (loginRes.statusCode === 200 && loginResult.success) {
            console.log('   ✅ Login successful');
            
            // Extract session cookie
            const cookies = loginRes.headers['set-cookie'];
            const sessionCookie = cookies ? cookies[0] : null;
            
            if (sessionCookie) {
              console.log('   ✅ Session cookie obtained');
              
              // Now test users page access
              console.log('\n👥 Step 2: Access users page...');
              
              const usersOptions = {
                hostname: 'localhost',
                port: 3000,
                path: '/dcp-admin/dashboard/users',
                method: 'GET',
                headers: {
                  'Cookie': sessionCookie
                }
              };
              
              const usersReq = http.request(usersOptions, (usersRes) => {
                console.log(`   Users Page Status: ${usersRes.statusCode}`);
                
                let usersResponseData = '';
                
                usersRes.on('data', (chunk) => {
                  usersResponseData += chunk;
                });
                
                usersRes.on('end', () => {
                  if (usersRes.statusCode === 200) {
                    console.log('   ✅ Users page accessible');
                    
                    // Check if page contains system admin
                    const hasSystemAdmin = usersResponseData.includes('root@thaimusic.com');
                    const hasSystemAdminName = usersResponseData.includes('System') && usersResponseData.includes('Administrator');
                    const hasSystemAdminBadge = usersResponseData.includes('System Admin');
                    
                    console.log('\n🔍 Page Content Analysis:');
                    console.log(`   Contains system admin email: ${hasSystemAdmin ? '✅ Yes' : '❌ No'}`);
                    console.log(`   Contains system admin name: ${hasSystemAdminName ? '✅ Yes' : '❌ No'}`);
                    console.log(`   Contains system admin badge: ${hasSystemAdminBadge ? '✅ Yes' : '❌ No'}`);
                    
                    if (hasSystemAdmin && hasSystemAdminName) {
                      console.log('\n🎉 SUCCESS: System admin is visible on users page!');
                    } else {
                      console.log('\n⚠️  System admin may not be visible on users page');
                      console.log('   Check the browser at: http://localhost:3000/dcp-admin/dashboard/users');
                    }
                  } else {
                    console.log('   ❌ Users page not accessible');
                    console.log(`   Status: ${usersRes.statusCode}`);
                  }
                  
                  resolve();
                });
              });
              
              usersReq.on('error', (error) => {
                console.error('   ❌ Users page request error:', error.message);
                resolve();
              });
              
              usersReq.end();
              
            } else {
              console.log('   ❌ No session cookie received');
              resolve();
            }
          } else {
            console.log('   ❌ Login failed');
            console.log(`   Message: ${loginResult.message}`);
            resolve();
          }
        } catch (error) {
          console.log('   ❌ Login response parse error:', error.message);
          resolve();
        }
      });
    });
    
    loginReq.on('error', (error) => {
      console.error('❌ Login request error:', error.message);
      resolve();
    });
    
    loginReq.write(loginData);
    loginReq.end();
  });
}

// Run the test
testUsersPageAccess().catch(console.error);