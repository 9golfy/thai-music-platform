#!/bin/bash

# สคริปต์สำหรับทดสอบความปลอดภัย
# ใช้งาน: chmod +x test-security.sh && ./test-security.sh your-domain.com

DOMAIN=$1

if [ -z "$DOMAIN" ]; then
    echo "กรุณาระบุโดเมน"
    echo "ใช้งาน: ./test-security.sh your-domain.com"
    exit 1
fi

echo "================================"
echo "Security Testing Script"
echo "Domain: $DOMAIN"
echo "================================"
echo ""

# ตรวจสอบว่ามี curl หรือไม่
if ! command -v curl &> /dev/null; then
    echo "กรุณาติดตั้ง curl ก่อน: sudo apt-get install curl"
    exit 1
fi

# 1. ทดสอบ Security Headers
echo "1. ทดสอบ Security Headers..."
echo "================================"
curl -I https://$DOMAIN 2>/dev/null | grep -E "(Strict-Transport-Security|X-Frame-Options|X-Content-Type-Options|Content-Security-Policy|X-XSS-Protection|Referrer-Policy)"
echo ""

# 2. ทดสอบ SSL/TLS
echo "2. ทดสอบ SSL/TLS Protocols..."
echo "================================"
if command -v openssl &> /dev/null; then
    echo "Testing TLS 1.2..."
    echo | openssl s_client -connect $DOMAIN:443 -tls1_2 2>/dev/null | grep -E "(Protocol|Cipher)"
    echo ""
    echo "Testing TLS 1.3..."
    echo | openssl s_client -connect $DOMAIN:443 -tls1_3 2>/dev/null | grep -E "(Protocol|Cipher)"
else
    echo "ติดตั้ง openssl เพื่อทดสอบ SSL/TLS"
fi
echo ""

# 3. ทดสอบ BREACH (gzip compression)
echo "3. ทดสอบ BREACH vulnerability (gzip)..."
echo "================================"
GZIP_TEST=$(curl -H "Accept-Encoding: gzip" -I https://$DOMAIN 2>/dev/null | grep -i "content-encoding: gzip")
if [ -z "$GZIP_TEST" ]; then
    echo "✅ PASS: gzip compression ปิดอยู่"
else
    echo "⚠️  WARNING: gzip compression เปิดอยู่ (อาจมีความเสี่ยง BREACH)"
fi
echo ""

# 4. ทดสอบ Server Information Disclosure
echo "4. ทดสอบ Server Information Disclosure..."
echo "================================"
SERVER_HEADER=$(curl -I https://$DOMAIN 2>/dev/null | grep -i "^server:")
if [ -z "$SERVER_HEADER" ]; then
    echo "✅ PASS: Server header ถูกซ่อน"
else
    echo "⚠️  WARNING: Server header ยังแสดงอยู่: $SERVER_HEADER"
fi

POWERED_BY=$(curl -I https://$DOMAIN 2>/dev/null | grep -i "^x-powered-by:")
if [ -z "$POWERED_BY" ]; then
    echo "✅ PASS: X-Powered-By header ถูกซ่อน"
else
    echo "⚠️  WARNING: X-Powered-By header ยังแสดงอยู่: $POWERED_BY"
fi
echo ""

# 5. ทดสอบ Timestamp Disclosure
echo "5. ทดสอบ Timestamp Disclosure..."
echo "================================"
LAST_MODIFIED=$(curl -I https://$DOMAIN 2>/dev/null | grep -i "^last-modified:")
if [ -z "$LAST_MODIFIED" ]; then
    echo "✅ PASS: Last-Modified header ถูกลบ"
else
    echo "⚠️  WARNING: Last-Modified header ยังแสดงอยู่: $LAST_MODIFIED"
fi

ETAG=$(curl -I https://$DOMAIN 2>/dev/null | grep -i "^etag:")
if [ -z "$ETAG" ]; then
    echo "✅ PASS: ETag header ถูกปิด"
else
    echo "⚠️  WARNING: ETag header ยังแสดงอยู่: $ETAG"
fi
echo ""

# 6. ทดสอบ HTTP to HTTPS Redirect
echo "6. ทดสอบ HTTP to HTTPS Redirect..."
echo "================================"
HTTP_REDIRECT=$(curl -I http://$DOMAIN 2>/dev/null | grep -i "location: https://")
if [ -n "$HTTP_REDIRECT" ]; then
    echo "✅ PASS: HTTP redirect ไป HTTPS"
else
    echo "⚠️  WARNING: HTTP ไม่ redirect ไป HTTPS"
fi
echo ""

# 7. สรุปผล
echo "================================"
echo "สรุปผลการทดสอบ"
echo "================================"
echo ""
echo "เครื่องมือออนไลน์สำหรับทดสอบเพิ่มเติม:"
echo "1. SSL Labs: https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"
echo "2. Security Headers: https://securityheaders.com/?q=$DOMAIN"
echo "3. Mozilla Observatory: https://observatory.mozilla.org/analyze/$DOMAIN"
echo ""
echo "คำแนะนำ:"
echo "- ตรวจสอบผลการทดสอบข้างต้น"
echo "- แก้ไขปัญหาที่พบ (ถ้ามี)"
echo "- ทดสอบด้วยเครื่องมือออนไลน์เพื่อความแม่นยำ"
echo ""
