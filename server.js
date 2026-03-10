const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const path = require('path')
const fs = require('fs')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = process.env.PORT || 3000

// When using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      const { pathname } = parsedUrl

      // Handle static files from public directory
      if (pathname.startsWith('/uploads/')) {
        const filePath = path.join(process.cwd(), 'public', pathname)
        
        if (fs.existsSync(filePath)) {
          const stat = fs.statSync(filePath)
          
          if (stat.isFile()) {
            const ext = path.extname(filePath).toLowerCase()
            let contentType = 'application/octet-stream'
            
            switch (ext) {
              case '.jpg':
              case '.jpeg':
                contentType = 'image/jpeg'
                break
              case '.png':
                contentType = 'image/png'
                break
              case '.gif':
                contentType = 'image/gif'
                break
              case '.webp':
                contentType = 'image/webp'
                break
            }
            
            res.setHeader('Content-Type', contentType)
            res.setHeader('Cache-Control', 'public, max-age=31536000')
            
            const fileStream = fs.createReadStream(filePath)
            fileStream.pipe(res)
            return
          }
        }
        
        // File not found
        res.statusCode = 404
        res.end('File not found')
        return
      }

      // Handle all other requests with Next.js
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})