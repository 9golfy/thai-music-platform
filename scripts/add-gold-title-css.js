const fs = require('fs');
const path = require('path');

const goldTitleCSS = `
<style>
.cinematic-gold-title {
  background: linear-gradient(
    90deg,
    #8B6914 0%,
    #B8860B 20%,
    #DAA520 35%,
    #FFD700 45%,
    #FFFACD 50%,
    #FFD700 55%,
    #DAA520 65%,
    #B8860B 80%,
    #8B6914 100%
  );
  
  background-image: 
    linear-gradient(
      90deg,
      transparent 0%,
      transparent 30%,
      rgba(255, 255, 255, 0.3) 45%,
      rgba(255, 255, 255, 0.6) 50%,
      rgba(255, 255, 255, 0.3) 55%,
      transparent 70%,
      transparent 100%
    ),
    linear-gradient(
      90deg,
      #8B6914 0%,
      #B8860B 20%,
      #DAA520 35%,
      #FFD700 45%,
      #FFFACD 50%,
      #FFD700 55%,
      #DAA520 65%,
      #B8860B 80%,
      #8B6914 100%
    );
  
  background-size: 200% 100%, 100% 100%;
  background-position: -200% center, center center;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  text-shadow:
    0 1px 0 rgba(255, 250, 205, 0.8),
    0 2px 0 rgba(255, 250, 205, 0.4),
    0 3px 2px rgba(107, 79, 15, 0.6),
    0 5px 4px rgba(107, 79, 15, 0.4),
    0 8px 8px rgba(107, 79, 15, 0.3),
    0 0 20px rgba(218, 165, 32, 0.5),
    0 0 40px rgba(218, 165, 32, 0.3),
    0 0 60px rgba(218, 165, 32, 0.2);
  
  animation: cinematic-shimmer 4s linear infinite;
  will-change: background-position;
}

@keyframes cinematic-shimmer {
  0% {
    background-position: -200% center, center center;
  }
  100% {
    background-position: 200% center, center center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cinematic-gold-title {
    animation: none;
    background-position: center center, center center;
  }
}
</style>
`;

function addGoldTitleCSS() {
  console.log('💫 Adding cinematic gold title CSS to demo files...');
  
  const demoDir = path.join(__dirname, '../public/demo');
  const files = ['hero-version1-image.html', 'hero-version2-video.html'];
  
  files.forEach(filename => {
    const filePath = path.join(demoDir, filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filename}`);
      return;
    }
    
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Add the gold title CSS before </head>
    if (!html.includes('cinematic-shimmer')) {
      html = html.replace('</head>', `${goldTitleCSS}\n</head>`);
      fs.writeFileSync(filePath, html, 'utf8');
      console.log(`✅ Added gold title CSS to: ${filename}`);
    } else {
      console.log(`ℹ️  CSS already exists in: ${filename}`);
    }
  });
  
  console.log('\n✨ Gold title CSS added successfully!');
}

addGoldTitleCSS();
