// Detailed test for export functionality
async function testExportDetailed() {
  const testId = '69abcc45bdfd421b3126102f';
  
  console.log('Testing Export Functionality (Detailed)...\n');
  
  try {
    console.log('1. Testing register-support PDF export...');
    const pdfResponse = await fetch(`http://localhost:3000/api/register-support/${testId}/export/pdf`);
    console.log(`   PDF Response Status: ${pdfResponse.status}`);
    
    if (!pdfResponse.ok) {
      const errorText = await pdfResponse.text();
      console.log(`   PDF Error Response: ${errorText}`);
    } else {
      console.log('   ✅ PDF export working');
    }
  } catch (error) {
    console.log(`   ❌ PDF export error: ${error.message}`);
  }
  
  console.log('');
  
  try {
    console.log('2. Testing register-support Excel export...');
    const excelResponse = await fetch(`http://localhost:3000/api/register-support/${testId}/export/excel`);
    console.log(`   Excel Response Status: ${excelResponse.status}`);
    
    if (!excelResponse.ok) {
      const errorText = await excelResponse.text();
      console.log(`   Excel Error Response: ${errorText}`);
    } else {
      console.log('   ✅ Excel export working');
    }
  } catch (error) {
    console.log(`   ❌ Excel export error: ${error.message}`);
  }
  
  console.log('\nDetailed export test completed!');
}

testExportDetailed();