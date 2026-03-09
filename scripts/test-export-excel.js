const fetch = require('node-fetch');

async function testExportExcel() {
  try {
    console.log('Testing Excel export...');
    
    // Test register100 Excel export
    const register100Response = await fetch('http://localhost:3000/api/register100/69ad8158fcaa2809454bab8d/export/excel');
    console.log('Register100 Excel export status:', register100Response.status);
    
    if (register100Response.ok) {
      console.log('Register100 Excel export: SUCCESS');
      console.log('Content-Type:', register100Response.headers.get('content-type'));
      console.log('Content-Disposition:', register100Response.headers.get('content-disposition'));
    } else {
      const errorText = await register100Response.text();
      console.log('Register100 Excel export error:', errorText);
    }
    
    // Test register-support Excel export
    const registerSupportResponse = await fetch('http://localhost:3000/api/register-support/69ad8250fcaa2809454bab8f/export/excel');
    console.log('Register-support Excel export status:', registerSupportResponse.status);
    
    if (registerSupportResponse.ok) {
      console.log('Register-support Excel export: SUCCESS');
      console.log('Content-Type:', registerSupportResponse.headers.get('content-type'));
      console.log('Content-Disposition:', registerSupportResponse.headers.get('content-disposition'));
    } else {
      const errorText = await registerSupportResponse.text();
      console.log('Register-support Excel export error:', errorText);
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testExportExcel();