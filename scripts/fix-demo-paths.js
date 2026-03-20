const fs = require('fs');
const path = require('path');

function fixDemoPaths() {
  console.log('🔧 Fixing paths in demo HTML files...');
  
  const demoDir = path.join(__dirname, '../public/demo');
  const files = ['hero-version1-image.html', 'hero-version2-video.html'];
  
  files.forEach(filename => {
    const filePath = path.join(demoDir, filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filename}`);
      return;
    }
    
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Fix image paths
    html = html.replace(/url\('\/images\//g, "url('./images/");
    html = html.replace(/url\("\/images\//g, 'url("./images/');
    html = html.replace(/src="\/images\//g, 'src="./images/');
    
    // Fix video paths
    html = html.replace(/src="\/hero-vdo\//g, 'src="./hero-vdo/');
    
    // Fix logo paths
    html = html.replace(/src="https:\/\/hebbkx1anhila5yf\.public\.blob\.vercel-storage\.com\/Logo-[^"]+"/g, 'src="./Logo.png"');
    
    // Remove all external script references (Next.js specific)
    html = html.replace(/<script[^>]*src="\/_next\/[^"]*"[^>]*><\/script>/g, '');
    html = html.replace(/<link[^>]*href="\/_next\/[^"]*"[^>]*>/g, '');
    
    // Remove HMR and dev scripts
    html = html.replace(/<script[^>]*turbopack[^>]*><\/script>/g, '');
    html = html.replace(/<script[^>]*hmr[^>]*><\/script>/g, '');
    
    // Add Tailwind CDN if not present
    if (!html.includes('tailwindcss.com')) {
      html = html.replace('</head>', '  <script src="https://cdn.tailwindcss.com"></script>\n</head>');
    }
    
    // Add Google Fonts if not present
    if (!html.includes('fonts.googleapis.com/css2?family=Sarabun')) {
      html = html.replace('</head>', '  <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap" rel="stylesheet">\n</head>');
    }
    
    // Remove navigation links (make them non-functional for demo)
    html = html.replace(/href="\/[^"]*"/g, 'href="#"');
    html = html.replace(/href="\/regist100"/g, 'href="#" onclick="alert(\'นี่เป็น Demo เท่านั้น\\nกรุณาเข้าสู่ระบบจริงเพื่อลงทะเบียน\'); return false;"');
    html = html.replace(/href="\/regist-support"/g, 'href="#" onclick="alert(\'นี่เป็น Demo เท่านั้น\\nกรุณาเข้าสู่ระบบจริงเพื่อลงทะเบียน\'); return false;"');
    
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ Fixed: ${filename}`);
  });
  
  console.log('\n✅ All paths fixed!');
  console.log('📦 Demo folder is now standalone and ready to send to client');
}

fixDemoPaths();
