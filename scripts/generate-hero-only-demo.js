const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function generateHeroOnlyDemo() {
  console.log('🚀 Starting hero-only demo generation...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to homepage
    console.log('\n📝 Loading homepage...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Get only header and hero section
    const headerHTML = await page.$eval('nav', el => el.outerHTML);
    const heroHTML = await page.$eval('#hero', el => el.outerHTML);
    const headHTML = await page.$eval('head', el => el.innerHTML);
    
    // Create demo folder
    const demoDir = path.join(__dirname, '../public/demo');
    if (!fs.existsSync(demoDir)) {
      fs.mkdirSync(demoDir, { recursive: true });
    }
    
    // Base HTML template
    const createHTML = (heroContent, title) => `<!DOCTYPE html>
<html lang="th">
<head>
    ${headHTML}
    <title>${title}</title>
</head>
<body class="font-sans antialiased">
    ${headerHTML}
    <main class="min-h-screen bg-black">
        ${heroContent}
    </main>
</body>
</html>`;
    
    // Version 1: Static Image
    console.log('\n📸 Creating Version 1 (Static Image)...');
    const heroWithImage = heroHTML.replace(
      /<video[^>]*>[\s\S]*?<\/video>/gi,
      `<div style="position: absolute; inset: 0; background-image: url('/images/hero_bg_3d_pixar.jpg'); background-size: cover; background-position: center; transform: translateY(-100px);"></div>`
    );
    
    const version1HTML = createHTML(heroWithImage, 'Hero Section - Version 1 (ภาพนิ่ง)');
    fs.writeFileSync(
      path.join(demoDir, 'hero-version1-image.html'),
      version1HTML,
      'utf8'
    );
    console.log('✅ Saved: public/demo/hero-version1-image.html');
    
    // Version 2: Video
    console.log('\n🎬 Creating Version 2 (Video)...');
    const version2HTML = createHTML(heroHTML, 'Hero Section - Version 2 (วิดีโอ)');
    fs.writeFileSync(
      path.join(demoDir, 'hero-version2-video.html'),
      version2HTML,
      'utf8'
    );
    console.log('✅ Saved: public/demo/hero-version2-video.html');
    
    // Update index page
    const indexHTML = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hero Section Demo - เปรียบเทียบ 2 Versions</title>
    <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Sarabun', Arial, sans-serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            color: white;
            margin-bottom: 20px;
            font-size: 2.5rem;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .subtitle {
            text-align: center;
            color: rgba(255,255,255,0.9);
            margin-bottom: 40px;
            font-size: 1.1rem;
        }
        .versions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 40px;
        }
        .version-card {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .version-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 30px 80px rgba(0,0,0,0.4);
        }
        .version-card h2 {
            color: #667eea;
            margin-bottom: 20px;
            font-size: 1.8rem;
        }
        .version-card p {
            color: #666;
            margin-bottom: 15px;
            line-height: 1.8;
        }
        .features {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            text-align: left;
        }
        .features li {
            color: #059669;
            font-weight: 600;
            margin: 8px 0;
            list-style: none;
        }
        .features li:before {
            content: "✓ ";
            margin-right: 8px;
        }
        .btn {
            display: inline-block;
            padding: 15px 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        .btn:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
        }
        .note {
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        .note h3 {
            color: #667eea;
            margin-top: 0;
            font-size: 1.5rem;
        }
        .note ul {
            color: #555;
            line-height: 2;
        }
        @media (max-width: 768px) {
            .versions {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎬 Hero Section Demo</h1>
        <p class="subtitle">เปรียบเทียบ 2 Versions: ภาพนิ่ง vs วิดีโอ</p>
        
        <div class="versions">
            <div class="version-card">
                <h2>📸 Version 1</h2>
                <p style="font-size: 1.2rem; font-weight: 600; color: #333;">ภาพพื้นหลังแบบนิ่ง</p>
                <p style="color: #999; font-size: 0.9rem;">Static Background Image</p>
                
                <div class="features">
                    <ul style="padding: 0;">
                        <li>โหลดเร็ว</li>
                        <li>ใช้ bandwidth น้อย</li>
                        <li>เหมาะสำหรับ mobile</li>
                        <li>รองรับทุกอุปกรณ์</li>
                    </ul>
                </div>
                
                <a href="hero-version1-image.html" class="btn" target="_blank">
                    ดู Version 1
                </a>
            </div>
            
            <div class="version-card">
                <h2>🎥 Version 2</h2>
                <p style="font-size: 1.2rem; font-weight: 600; color: #333;">วิดีโอพื้นหลังแบบ Loop</p>
                <p style="color: #999; font-size: 0.9rem;">Video Background Loop</p>
                
                <div class="features">
                    <ul style="padding: 0;">
                        <li>สวยงาม มีชีวิตชีวา</li>
                        <li>ดึงดูดความสนใจ</li>
                        <li>ทันสมัย premium</li>
                        <li>สร้างความประทับใจ</li>
                    </ul>
                </div>
                
                <a href="hero-version2-video.html" class="btn" target="_blank">
                    ดู Version 2
                </a>
            </div>
        </div>
        
        <div class="note">
            <h3>📌 หมายเหตุ</h3>
            <ul>
                <li><strong>เนื้อหาเหมือนกัน:</strong> ทั้ง 2 versions มี header และ hero section เหมือนกันทุกประการ</li>
                <li><strong>แตกต่างเฉพาะพื้นหลัง:</strong> Version 1 ใช้ภาพนิ่ง / Version 2 ใช้วิดีโอ</li>
                <li><strong>เฉพาะ Header + Hero:</strong> ไม่มี sections อื่นๆ เพื่อให้โฟกัสที่ส่วนนี้</li>
                <li><strong>พร้อม Demo:</strong> เปิดดูได้ทันทีในเบราว์เซอร์</li>
            </ul>
        </div>
    </div>
</body>
</html>`;
    
    fs.writeFileSync(
      path.join(demoDir, 'index.html'),
      indexHTML,
      'utf8'
    );
    console.log('✅ Saved: public/demo/index.html');
    
    console.log('\n✅ Hero-only demo generation completed!');
    console.log('\n📂 Files created:');
    console.log('   - public/demo/index.html');
    console.log('   - public/demo/hero-version1-image.html (ภาพนิ่ง)');
    console.log('   - public/demo/hero-version2-video.html (วิดีโอ)');
    console.log('\n🔗 เปิดดูได้ที่:');
    console.log('   http://localhost:3000/demo/index.html');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

generateHeroOnlyDemo();
