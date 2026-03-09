// Test export headers to see what's being sent
const http = require('http');

function testExportHeaders() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/register-support/69ad8250fcaa2809454bab8f/export/excel',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('First 200 characters of response:');
      console.log(data.substring(0, 200));
    });
  });

  req.on('error', (e) => {
    console.error('Error:', e.message);
  });

  req.end();
}

testExportHeaders();