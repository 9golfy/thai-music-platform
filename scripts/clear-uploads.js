const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

async function clearUploads() {
  try {
    console.log('🧹 Clearing uploads directory...');
    
    if (!fs.existsSync(uploadsDir)) {
      console.log('📁 Uploads directory does not exist');
      return;
    }
    
    const files = fs.readdirSync(uploadsDir);
    console.log(`📊 Found ${files.length} files to delete`);
    
    let deletedCount = 0;
    let skippedCount = 0;
    
    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isFile()) {
        // Keep certain files if needed (e.g., .gitkeep)
        if (file === '.gitkeep' || file === 'README.md') {
          console.log(`⏭️  Skipping: ${file}`);
          skippedCount++;
          continue;
        }
        
        try {
          fs.unlinkSync(filePath);
          console.log(`🗑️  Deleted: ${file}`);
          deletedCount++;
        } catch (error) {
          console.error(`❌ Failed to delete ${file}:`, error.message);
        }
      }
    }
    
    console.log(`\n✅ Cleanup completed!`);
    console.log(`📊 Summary:`);
    console.log(`   - Files deleted: ${deletedCount}`);
    console.log(`   - Files skipped: ${skippedCount}`);
    
  } catch (error) {
    console.error('❌ Error clearing uploads:', error);
  }
}

clearUploads();