const http = require('http');
const fs = require('fs');

async function testDirectExport() {
  console.log('🧪 Testing direct API export...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/register100/69ad8158fcaa2809454bab8d/export/excel',
    method: 'GET',
    headers: {
      'Accept': 'text/csv'
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      console.log(`📊 Status: ${res.statusCode}`);
      console.log(`📋 Headers:`, res.headers);
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Export successful!');
          console.log('📄 Content preview (first 300 chars):');
          console.log(data.substring(0, 300));
          console.log('...');
          
          // Save to file
          const filename = `test-export-${Date.now()}.csv`;
          fs.writeFileSync(filename, data, 'utf8');
          console.log(`💾 Saved to: ${filename}`);
          
          // Check if it's valid CSV
          const lines = data.split('\n');
          console.log(`📊 Total lines: ${lines.length}`);
          console.log(`🔤 First line: ${lines[0]}`);
          
          resolve(data);
        } else {
          console.log('❌ Export failed');
          console.log('📄 Response:', data);
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (err) => {
      console.error('❌ Request error:', err);
      reject(err);
    });

    req.end();
  });
}

// Test the export
testDirectExport()
  .then(() => {
    console.log('🎉 Test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  });