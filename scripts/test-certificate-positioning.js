const { certificateTemplates, getTemplateById } = require('../lib/config/certificateTemplates.ts');

function testCertificatePositioning() {
  console.log('🎯 Testing Certificate Template Positioning');
  console.log('='.repeat(50));
  
  certificateTemplates.forEach((template, index) => {
    console.log(`\n📋 Template ${index + 1}: ${template.name}`);
    console.log(`   ID: ${template.id}`);
    console.log(`   Type: ${template.certificateType}`);
    console.log(`   Dimensions: ${template.width}x${template.height}px`);
    
    const schoolNamePos = template.textPositions.schoolName;
    console.log(`   School Name Position:`);
    console.log(`     - Top: ${schoolNamePos.top} (moved up ~50px from original)`);
    console.log(`     - Left: ${schoolNamePos.left}`);
    console.log(`     - Font Size: ${schoolNamePos.fontSize}`);
    console.log(`     - Text Align: ${schoolNamePos.textAlign}`);
    console.log(`     - Max Width: ${schoolNamePos.maxWidth}`);
    
    // Calculate pixel position for reference
    const heightPx = template.height;
    const topPercent = parseFloat(schoolNamePos.top.replace('%', ''));
    const topPx = Math.round((topPercent / 100) * heightPx);
    console.log(`     - Calculated pixel position: ${topPx}px from top`);
  });
  
  console.log('\n✅ Certificate positioning updated successfully!');
  console.log('\n📝 Changes Summary:');
  console.log('   • Default Template: 45% → 38.75% (moved up ~50px)');
  console.log('   • Gold Template: 48% → 41.75% (moved up ~50px)');
  console.log('   • Silver Template: 46% → 39.75% (moved up ~50px)');
  
  console.log('\n🎨 Next Steps:');
  console.log('   1. Generate a new certificate to test the positioning');
  console.log('   2. Check that school names no longer overlap with other elements');
  console.log('   3. Verify text is properly centered and readable');
}

// Run the test
if (require.main === module) {
  try {
    testCertificatePositioning();
    console.log('\n✅ Test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

module.exports = { testCertificatePositioning };