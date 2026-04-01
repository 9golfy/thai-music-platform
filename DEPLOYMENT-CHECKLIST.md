# ✅ Checklist การ Deploy Production

## 📋 ก่อน Deploy

### Environment Setup
- [ ] สร้าง `.env.production` จาก `.env.production.example`
- [ ] Generate secure passwords ด้วย `./generate-secrets.sh`
- [ ] ตั้งค่า `MONGO_ROOT_PASSWORD` (24+ characters)
- [ ] ตั้งค่า `JWT_SECRET` (32+ characters)
- [ ] ตั้งค่า `GMAIL_USER` และ `GMAIL_APP_PASSWORD`
- [ ] ตั้งค่า `NEXT_PUBLIC_APP_URL` เป็น production URL
- [ ] ตรวจสอบว่าไม่มี `.env` files ใน git

### Server Preparation
- [ ] Server มี Ubuntu 20.04 LTS หรือใหม่กว่า
- [ ] ติดตั้ง Node.js 20.x แล้ว
- [ ] ติดตั้ง MongoDB 7.x แล้ว
- [ ] ติดตั้ง Nginx แล้ว
- [ ] โดเมนชี้มาที่ server แล้ว
- [ ] เปิด port 80 และ 443 แล้ว
- [ ] ตั้งค่า firewall (ufw) แล้ว

### Code Preparation
- [ ] Code ผ่าน tests ทั้งหมด
- [ ] ไม่มี TypeScript errors
- [ ] ไม่มี ESLint errors
- [ ] Build สำเร็จ (`npm run build`)
- [ ] ทดสอบใน staging environment แล้ว

---

## 🔒 Security Configuration

### Next.js Security
- [ ] `next.config.ts` มี security headers ครบถ้วน
  - [ ] Content-Security-Policy
  - [ ] X-Frame-Options
  - [ ] Strict-Transport-Security
  - [ ] X-Content-Type-Options
  - [ ] X-XSS-Protection
  - [ ] Referrer-Policy
- [ ] `middleware.ts` ถูกสร้างและทำงานถูกต้อง
- [ ] ไม่มี sensitive data ใน client-side code

### Nginx Security
- [ ] คัดลอก `nginx.conf.example` ไปที่ `/etc/nginx/sites-available/`
- [ ] แก้ไข `your-domain.com` เป็นโดเมนจริง
- [ ] ตั้งค่า SSL protocols เป็น TLSv1.2 และ TLSv1.3 เท่านั้น
- [ ] ตั้งค่า cipher suites ที่ปลอดภัย
- [ ] ปิด gzip compression (หรือตั้งค่าอย่างระมัดระวัง)
- [ ] ตั้งค่า security headers
- [ ] ซ่อน server tokens
- [ ] ลบ timestamp headers
- [ ] ตั้งค่า rate limiting (optional)

### SSL/TLS
- [ ] ขอ SSL certificate จาก Let's Encrypt
- [ ] ทดสอบ SSL configuration
- [ ] ตั้งค่า auto-renewal
- [ ] ทดสอบ auto-renewal (`certbot renew --dry-run`)
- [ ] ตั้งค่า OCSP stapling
- [ ] สร้าง Diffie-Hellman parameters

### MongoDB Security
- [ ] ตั้งค่า authentication
- [ ] สร้าง database user ที่มี privileges เฉพาะที่จำเป็น
- [ ] ปิด remote access (ถ้าไม่จำเป็น)
- [ ] Enable audit logging (optional)
- [ ] ตั้งค่า backup schedule

---

## 🚀 Deployment Steps

### Application Deployment
- [ ] Clone repository ไปที่ server
- [ ] ติดตั้ง dependencies (`npm ci --only=production`)
- [ ] Build application (`npm run build`)
- [ ] ติดตั้ง PM2 (`npm install -g pm2`)
- [ ] Start application ด้วย PM2
- [ ] ตั้งค่า PM2 auto-start
- [ ] Save PM2 configuration

### Nginx Configuration
- [ ] Enable site configuration
- [ ] ทดสอบ Nginx config (`nginx -t`)
- [ ] Restart Nginx
- [ ] ตรวจสอบ Nginx logs

### Database Setup
- [ ] Start MongoDB service
- [ ] สร้าง database และ collections
- [ ] Import initial data (ถ้ามี)
- [ ] ทดสอบ connection จาก application

---

## 🧪 Testing

### Functional Testing
- [ ] เข้าถึงเว็บไซต์ได้ปกติ
- [ ] Login/Logout ทำงานถูกต้อง
- [ ] Form submissions ทำงานถูกต้อง
- [ ] File uploads ทำงานถูกต้อง
- [ ] Email notifications ส่งได้
- [ ] Database operations ทำงานถูกต้อง

### Security Testing
- [ ] ทดสอบด้วย `./test-security.sh your-domain.com`
- [ ] ทดสอบ SSL Labs (ควรได้ A หรือ A+)
  - URL: https://www.ssllabs.com/ssltest/
- [ ] ทดสอบ Security Headers (ควรได้ A หรือ A+)
  - URL: https://securityheaders.com
- [ ] ทดสอบ Mozilla Observatory (ควรได้ B+ ขึ้นไป)
  - URL: https://observatory.mozilla.org
- [ ] ทดสอบ OWASP ZAP (optional)
- [ ] ทดสอบ penetration testing (optional)

### Performance Testing
- [ ] ทดสอบ page load time
- [ ] ทดสอบ API response time
- [ ] ทดสอบ concurrent users
- [ ] ทดสอบ database query performance
- [ ] ตรวจสอบ memory usage
- [ ] ตรวจสอบ CPU usage

### Specific Vulnerability Checks
- [ ] ✅ LUCKY13 - ใช้ TLS 1.2+ และ AEAD ciphers
- [ ] ✅ BREACH - gzip compression ปิดหรือตั้งค่าถูกต้อง
- [ ] ✅ CSP Header - ตั้งค่าแล้ว
- [ ] ✅ Anti-clickjacking - X-Frame-Options: DENY
- [ ] ✅ HSTS - Strict-Transport-Security ตั้งค่าแล้ว
- [ ] ✅ X-Content-Type-Options - nosniff ตั้งค่าแล้ว
- [ ] ✅ Timestamp Disclosure - Last-Modified และ ETag ถูกลบ
- [ ] ✅ Big Redirect - ใช้ 301 redirect ที่เหมาะสม

---

## 📊 Monitoring Setup

### Application Monitoring
- [ ] ตั้งค่า PM2 monitoring
- [ ] ตั้งค่า application logs
- [ ] ตั้งค่า error tracking (Sentry, optional)
- [ ] ตั้งค่า uptime monitoring (UptimeRobot, optional)
- [ ] ตั้งค่า performance monitoring (optional)

### Server Monitoring
- [ ] ตั้งค่า Nginx access logs
- [ ] ตั้งค่า Nginx error logs
- [ ] ตั้งค่า system logs
- [ ] ตั้งค่า disk space monitoring
- [ ] ตั้งค่า memory monitoring
- [ ] ตั้งค่า CPU monitoring

### Database Monitoring
- [ ] ตั้งค่า MongoDB logs
- [ ] ตั้งค่า slow query logging
- [ ] ตั้งค่า database size monitoring
- [ ] ตั้งค่า connection pool monitoring

---

## 💾 Backup Setup

### Application Backup
- [ ] ตั้งค่า code backup (git)
- [ ] ตั้งค่า configuration backup
- [ ] ตั้งค่า uploaded files backup
- [ ] ทดสอบ restore process

### Database Backup
- [ ] ตั้งค่า MongoDB backup schedule
- [ ] ทดสอบ backup process
- [ ] ทดสอบ restore process
- [ ] ตั้งค่า backup retention policy
- [ ] ตั้งค่า off-site backup (optional)

### SSL Certificate Backup
- [ ] Backup SSL certificates
- [ ] Backup private keys (เก็บในที่ปลอดภัย)

---

## 🔄 Post-Deployment

### Documentation
- [ ] อัพเดท deployment documentation
- [ ] บันทึก server credentials (ในที่ปลอดภัย)
- [ ] บันทึก database credentials (ในที่ปลอดภัย)
- [ ] สร้าง runbook สำหรับ common tasks
- [ ] สร้าง incident response plan

### Team Communication
- [ ] แจ้งทีมว่า deploy เสร็จแล้ว
- [ ] แชร์ production URL
- [ ] แชร์ monitoring dashboards
- [ ] แชร์ documentation

### Maintenance Schedule
- [ ] ตั้งค่า maintenance window
- [ ] ตั้งค่า update schedule
- [ ] ตั้งค่า security patch schedule
- [ ] ตั้งค่า SSL renewal reminder

---

## 🆘 Emergency Contacts

### Technical Contacts
- [ ] Server administrator: _______________
- [ ] Database administrator: _______________
- [ ] Security team: _______________
- [ ] DevOps team: _______________

### Service Providers
- [ ] Domain registrar: _______________
- [ ] Hosting provider: _______________
- [ ] SSL certificate provider: _______________
- [ ] Email service provider: _______________

---

## 📝 Notes

### Deployment Date
- Date: _______________
- Time: _______________
- Deployed by: _______________

### Issues Encountered
- Issue 1: _______________
- Resolution: _______________

- Issue 2: _______________
- Resolution: _______________

### Post-Deployment Tasks
- [ ] Task 1: _______________
- [ ] Task 2: _______________
- [ ] Task 3: _______________

---

## ✅ Final Sign-off

- [ ] All checklist items completed
- [ ] All tests passed
- [ ] All security checks passed
- [ ] Monitoring is active
- [ ] Backup is configured
- [ ] Documentation is updated
- [ ] Team is notified

**Signed off by**: _______________
**Date**: _______________
**Time**: _______________

---

## 🎉 Congratulations!

Your application is now deployed securely in production!

**Next Steps**:
1. Monitor application for 24-48 hours
2. Review logs regularly
3. Check monitoring dashboards
4. Plan for next deployment
5. Schedule security review

**Remember**:
- Keep dependencies updated
- Review security headers regularly
- Monitor SSL certificate expiration
- Backup regularly
- Test disaster recovery plan
