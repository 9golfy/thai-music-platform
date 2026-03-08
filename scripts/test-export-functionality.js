// Test script to verify export functionality
async function testExportFunctionality() {
  const testId = '69abcc45bdfd421b3126102f'; // Known test record ID
  
  console.log('Testing Export Functionality...\n');
  
  // Test register-support PDF export
  try {
    console.log('1. Testing register-support PDF export...');
    const pdfResponse = await fetch(`http://localhost:3000/api/register-support/${testId}/export/pdf`);
    console.log(`   PDF Response Status: ${pdfResponse.status}`);
    console.log(`   PDF Content-Type: ${pdfResponse.headers.get('content-type')}`);
    console.log(`   PDF Content-Disposition: ${pdfResponse.headers.get('content-disposition')}`);
    
    if (pdfResponse.ok) {
      const pdfSize = (await pdfResponse.blob()).size;
      console.log(`   PDF Size: ${pdfSize} bytes`);
      console.log('   ✅ PDF export working');
    } else {
      console.log('   ❌ PDF export failed');
    }
  } catch (error) {
    console.log(`   ❌ PDF export error: ${error.message}`);
  }
  
  console.log('');
  
  // Test register-support Excel export
  try {
    console.log('2. Testing register-support Excel export...');
    const excelResponse = await fetch(`http://localhost:3000/api/register-support/${testId}/export/excel`);
    console.log(`   Excel Response Status: ${excelResponse.status}`);
    console.log(`   Excel Content-Type: ${excelResponse.headers.get('content-type')}`);
    console.log(`   Excel Content-Disposition: ${excelResponse.headers.get('content-disposition')}`);
    
    if (excelResponse.ok) {
      const excelSize = (await excelResponse.blob()).size;
      console.log(`   Excel Size: ${excelSize} bytes`);
      console.log('   ✅ Excel export working');
    } else {
      console.log('   ❌ Excel export failed');
    }
  } catch (error) {
    console.log(`   ❌ Excel export error: ${error.message}`);
  }
  
  console.log('');
  
  // Test register100 exports (if data exists)
  try {
    console.log('3. Testing register100 PDF export...');
    const reg100PdfResponse = await fetch(`http://localhost:3000/api/register100/${testId}/export/pdf`);
    console.log(`   Register100 PDF Response Status: ${reg100PdfResponse.status}`);
    
    if (reg100PdfResponse.ok) {
      const pdfSize = (await reg100PdfResponse.blob()).size;
      console.log(`   Register100 PDF Size: ${pdfSize} bytes`);
      console.log('   ✅ Register100 PDF export working');
    } else {
      console.log('   ❌ Register100 PDF export failed (may not have test data)');
    }
  } catch (error) {
    console.log(`   ❌ Register100 PDF export error: ${error.message}`);
  }
  
  console.log('');
  
  try {
    console.log('4. Testing register100 Excel export...');
    const reg100ExcelResponse = await fetch(`http://localhost:3000/api/register100/${testId}/export/excel`);
    console.log(`   Register100 Excel Response Status: ${reg100ExcelResponse.status}`);
    
    if (reg100ExcelResponse.ok) {
      const excelSize = (await reg100ExcelResponse.blob()).size;
      console.log(`   Register100 Excel Size: ${excelSize} bytes`);
      console.log('   ✅ Register100 Excel export working');
    } else {
      console.log('   ❌ Register100 Excel export failed (may not have test data)');
    }
  } catch (error) {
    console.log(`   ❌ Register100 Excel export error: ${error.message}`);
  }
  
  console.log('\nExport functionality test completed!');
}

testExportFunctionality();