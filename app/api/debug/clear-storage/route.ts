import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clearScript = `
    <html>
    <head>
      <title>Clear Browser Storage</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; }
        button { padding: 10px 20px; font-size: 16px; margin: 10px; }
        .success { color: green; }
        .info { color: blue; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🧹 Clear Browser Storage</h1>
        <p>This will clear localStorage and sessionStorage to remove old form data.</p>
        
        <button onclick="clearStorage()">Clear Storage</button>
        <button onclick="location.href='/regist-support'">Go to Register Support</button>
        
        <div id="output"></div>
        
        <script>
          function log(message, type = 'info') {
            const output = document.getElementById('output');
            const div = document.createElement('div');
            div.className = type;
            div.innerHTML = message;
            output.appendChild(div);
          }
          
          function clearStorage() {
            log('🧹 Clearing all browser storage...', 'info');
            
            // Show current storage
            const localKeys = Object.keys(localStorage);
            const sessionKeys = Object.keys(sessionStorage);
            
            log('📦 localStorage keys: ' + localKeys.join(', '), 'info');
            log('📦 sessionStorage keys: ' + sessionKeys.join(', '), 'info');
            
            // Clear specific keys first
            [...localKeys, ...sessionKeys].forEach(key => {
              if (key.includes('draft') || key.includes('form') || key.includes('register')) {
                log('   Removing: ' + key, 'info');
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
              }
            });
            
            // Clear all
            localStorage.clear();
            sessionStorage.clear();
            
            log('✅ Browser storage cleared!', 'success');
            log('🔄 You can now go to Register Support with clean storage.', 'success');
          }
        </script>
      </div>
    </body>
    </html>
  `;

  return new NextResponse(clearScript, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}