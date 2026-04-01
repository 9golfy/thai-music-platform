const http = require('http');
const { exec } = require('child_process');
const crypto = require('crypto');

const PORT = 9000;
const SECRET = process.env.WEBHOOK_SECRET || 'your-secret-key-change-this';
const PROJECT_DIR = '/var/www/thai-music-platform';

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        // Verify signature
        const signature = req.headers['x-hub-signature-256'];
        if (signature) {
          const hash = 'sha256=' + crypto
            .createHmac('sha256', SECRET)
            .update(body)
            .digest('hex');
          
          if (signature !== hash) {
            console.log('❌ Invalid signature');
            res.writeHead(401);
            res.end('Unauthorized');
            return;
          }
        }
        
        const payload = JSON.parse(body);
        
        // Check if push to master branch
        if (payload.ref === 'refs/heads/master') {
          console.log('🚀 Deploying...');
          
          // Run deploy script
          exec(`cd ${PROJECT_DIR} && git pull origin master && npm install && npm run build && pm2 restart thai-music-platform`, 
            (error, stdout, stderr) => {
              if (error) {
                console.error('❌ Deploy failed:', error);
                return;
              }
              console.log('✅ Deploy completed!');
              console.log(stdout);
            }
          );
          
          res.writeHead(200);
          res.end('Deployment started');
        } else {
          res.writeHead(200);
          res.end('Not master branch, skipping');
        }
      } catch (error) {
        console.error('Error:', error);
        res.writeHead(500);
        res.end('Internal Server Error');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`🎣 Webhook server listening on port ${PORT}`);
});
