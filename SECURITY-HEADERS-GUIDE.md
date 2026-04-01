# คู่มือแก้ไขปัญหาความปลอดภัย Server

## สรุปปัญหาที่ต้องแก้ไข

1. ✅ Server vulnerable to LUCKY13
2. ✅ Server vulnerable to BREACH
3. ✅ CSP Header Not Set
4. ✅ Missing Anti-clickjacking Header
5. ✅ Strict-Transport-Security Header Not Set
6. ✅ X-Content-Type-Options Header Missing
7. ✅ Timestamp Disclosure - Unix
8. ✅ Big Redirect Detected

---

## วิธีแก้ไข

### 1. อัพเดท next.config.ts เพื่อเพิ่ม Security Headers

แก้ไขไฟล์ `next.config.ts` ให้มี security headers ที่จำเป็น:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'standalone',
  serverExternalPackages: ['mongodb'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true
  },
  
  // Security Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Content Security Policy (CSP)
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'"
            ].join('; ')
          },
          // Anti-clickjacking (X-Frame-Options)
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // Strict Transport Security (HSTS)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // XSS Protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
```

---

### 2. แก้ไข Nginx Configuration (สำหรับ Production Server)

สร้างหรือแก้ไขไฟล์ `/etc/nginx/sites-available/your-domain` หรือ `/etc/nginx/nginx.conf`:

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration - แก้ LUCKY13 และ BREACH
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;
    
    # ใช้ TLS 1.2 และ 1.3 เท่านั้น (ป้องกัน LUCKY13)
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # Cipher suites ที่ปลอดภัย (ป้องกัน LUCKY13)
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    
    # ปิด SSL Compression (ป้องกัน BREACH)
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # ปิด gzip สำหรับข้อมูลที่มี sensitive data (ป้องกัน BREACH)
    gzip off;
    # หรือถ้าต้องการใช้ gzip ให้ระมัดระวังกับ sensitive data
    # gzip on;
    # gzip_vary on;
    # gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    # gzip_disable "msie6";

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Content Security Policy
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" always;

    # ซ่อน Server Version (ป้องกัน Information Disclosure)
    server_tokens off;
    more_clear_headers Server;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # ป้องกัน Big Redirect
        proxy_redirect off;
        proxy_max_temp_file_size 0;
    }

    # ป้องกัน Timestamp Disclosure
    if_modified_since off;
    add_header Last-Modified "";
    etag off;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

---

### 3. ติดตั้ง nginx-extras (สำหรับ more_clear_headers)

```bash
sudo apt-get update
sudo apt-get install nginx-extras
```

---

### 4. สร้าง middleware.ts สำหรับ Security Headers เพิ่มเติม

สร้างไฟล์ `middleware.ts` ในโฟลเดอร์ root ของโปรเจกต์:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security Headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // HSTS (ใช้เฉพาะ HTTPS)
  if (request.nextUrl.protocol === 'https:') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // ลบ headers ที่อาจเปิดเผยข้อมูล
  response.headers.delete('X-Powered-By');
  response.headers.delete('Server');

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

### 5. แก้ไข Docker Configuration (ถ้าใช้ Docker)

แก้ไขไฟล์ `Dockerfile` เพื่อเพิ่มความปลอดภัย:

```dockerfile
FROM node:20-alpine AS base

# ติดตั้ง dependencies ที่จำเป็น
RUN apk add --no-cache libc6-compat

WORKDIR /app

# ลบ unnecessary packages
RUN apk del --purge apk-tools

# สร้าง non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy files
COPY --chown=nextjs:nodejs . .

# Build
RUN npm ci --only=production
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=base --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=base --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=base --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

---

### 6. ตรวจสอบและทดสอบ

#### ทดสอบ SSL/TLS Configuration:
```bash
# ทดสอบ SSL
openssl s_client -connect your-domain.com:443 -tls1_2

# ตรวจสอบ cipher suites
nmap --script ssl-enum-ciphers -p 443 your-domain.com
```

#### ทดสอบ Security Headers:
```bash
# ใช้ curl ตรวจสอบ headers
curl -I https://your-domain.com

# หรือใช้ online tools:
# - https://securityheaders.com
# - https://observatory.mozilla.org
```

#### ทดสอบ BREACH vulnerability:
```bash
curl -H "Accept-Encoding: gzip" -I https://your-domain.com
```

---

### 7. Restart Services

```bash
# Restart Nginx
sudo systemctl restart nginx

# ตรวจสอบ Nginx config
sudo nginx -t

# Restart Next.js (ถ้าใช้ PM2)
pm2 restart all

# หรือถ้าใช้ Docker
docker-compose restart
```

---

## การตรวจสอบหลังแก้ไข

### ✅ Checklist

- [ ] CSP Header ถูกตั้งค่าแล้ว
- [ ] X-Frame-Options ถูกตั้งค่าเป็น DENY
- [ ] HSTS Header ถูกตั้งค่าแล้ว
- [ ] X-Content-Type-Options ถูกตั้งค่าเป็น nosniff
- [ ] SSL/TLS ใช้เฉพาะ TLSv1.2 และ TLSv1.3
- [ ] SSL Compression ถูกปิด
- [ ] gzip ถูกปิดหรือตั้งค่าอย่างระมัดระวัง
- [ ] Server tokens ถูกซ่อน
- [ ] Timestamp headers ถูกลบ
- [ ] Redirect ทำงานถูกต้อง

---

## หมายเหตุสำคัญ

### BREACH Vulnerability
- ปิด gzip compression สำหรับหน้าที่มี sensitive data
- ใช้ CSRF tokens ที่เปลี่ยนแปลงทุกครั้ง
- เพิ่ม random data ในการตอบกลับ

### LUCKY13 Vulnerability
- ใช้ TLS 1.2+ เท่านั้น
- ใช้ AEAD ciphers (GCM, ChaCha20-Poly1305)
- หลีกเลี่ยง CBC mode ciphers

### CSP Configuration
- ปรับแต่ง CSP ตามความต้องการของแอพ
- ใช้ nonce หรือ hash สำหรับ inline scripts
- ทดสอบใน report-only mode ก่อน

### Production Deployment
- ใช้ HTTPS เท่านั้น
- ติดตั้ง SSL certificate จาก Let's Encrypt หรือ CA อื่นๆ
- ตั้งค่า auto-renewal สำหรับ SSL certificate
- Monitor security headers ด้วย automated tools

---

## เครื่องมือที่แนะนำ

1. **SSL Labs**: https://www.ssllabs.com/ssltest/
2. **Security Headers**: https://securityheaders.com
3. **Mozilla Observatory**: https://observatory.mozilla.org
4. **OWASP ZAP**: สำหรับ security testing
5. **Nmap**: สำหรับ port และ SSL scanning

---

## การอัพเดทในอนาคต

- ติดตาม security advisories จาก Next.js
- อัพเดท dependencies เป็นประจำ
- ทบทวน security headers ทุก 6 เดือน
- ทดสอบ penetration testing เป็นระยะ
