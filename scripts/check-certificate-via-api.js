const fetch = require('node-fetch');

async function checkCertificateData() {
  try {
    console.log('=== ตรวจสอบข้อมูล certificate ผ่าน API ===');
    
    // ใช้ ID จาก URL ที่ user ให้มา
    const certificateId = '69ad7a7bfcaa2809454bab8b';
    
    // เรียก API เพื่อดูข้อมูล certificate
    const response = await fetch(`http://localhost:3000/api/certificates/${certificateId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Certificate data:', JSON.stringify(data, null, 2));
    } else {
      console.log('Response status:', response.status);
      console.log('Response text:', await response.text());
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkCertificateData();