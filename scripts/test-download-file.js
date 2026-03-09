const http = require('http');
const fs = require('fs');

function downloadFile() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/register100/69ad8158fcaa2809454bab8d/export/excel',
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
      // Save to file
      const filename = 'test-download.csv';
      fs.writeFileSync(filename, data, 'utf8');
      console.log(`File saved as: ${filename}`);
      console.log(`File size: ${data.length} bytes`);
      console.log('First 500 characters:');
      console.log(data.substring(0, 500));
    });
  });

  req.on('error', (e) => {
    console.error('Error:', e.message);
  });

  req.end();
}

downloadFile();