// Test register100 export headers
const http = require('http');

function testRegister100Headers() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/register100/69ad8158fcaa2809454bab8d/export/excel',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log('Register100 Status:', res.statusCode);
    console.log('Register100 Headers:', res.headers);
    
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

testRegister100Headers();