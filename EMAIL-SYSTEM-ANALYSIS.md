# ระบบอีเมลและการจัดการ Rate Limit

## สรุปการส่งอีเมลในระบบ

### 📧 อีเมลที่ส่งไปยัง Admin (thaimusicplatform@gmail.com)

#### 1. การลงทะเบียนใหม่ (New Registration)
- **เมื่อไหร่**: เมื่อมีโรงเรียนส่งใบสมัครสำเร็จ (draft submit)
- **ความถี่**: ขึ้นอยู่กับจำนวนการสมัคร (คาดว่า 5-20 ต่อวัน)
- **ข้อมูลที่ส่ง**: ชื่อโรงเรียน, School ID, Email, ประเภทการสมัคร, Submission ID
- **Priority**: Medium

#### 2. การขอรหัสผ่านใหม่ (Password Reset)
- **เมื่อไหร่**: เมื่อครูขอรหัสผ่านใหม่ผ่านหน้า /request-password
- **ความถี่**: คาดว่า 2-10 ต่อวัน
- **ข้อมูลที่ส่ง**: ชื่อครู, Email, โรงเรียน, School ID
- **Priority**: Low

#### 3. สรุปรายวัน (Daily Summary) - ยังไม่ได้ implement
- **เมื่อไหร่**: ทุกวันเวลา 18:00
- **ความถี่**: 1 ต่อวัน
- **ข้อมูลที่ส่ง**: สถิติการลงทะเบียน, การขอรหัสผ่าน, จำนวนโรงเรียนทั้งหมด
- **Priority**: Low

### 📧 อีเมลที่ส่งไปยัง User

#### 1. Draft Link (Save Draft)
- **เมื่อไหร่**: เมื่อผู้ใช้บันทึก draft
- **ความถี่**: คาดว่า 20-50 ต่อวัน
- **Priority**: High

#### 2. OTP Verification
- **เมื่อไหร่**: เมื่อผู้ใช้ขอ OTP สำหรับ draft
- **ความถี่**: คาดว่า 10-30 ต่อวัน
- **Priority**: High

#### 3. Submission Success
- **เมื่อไหร่**: เมื่อส่งใบสมัครสำเร็จ
- **ความถี่**: คาดว่า 5-20 ต่อวัน
- **Priority**: High

#### 4. Password Reset
- **เมื่อไหร่**: เมื่อครูขอรหัสผ่านใหม่
- **ความถี่**: คาดว่า 2-10 ต่อวัน
- **Priority**: High

## 🚦 Rate Limiting Analysis

### Gmail Limits (Free Account)
- **Daily**: 500 emails/day
- **Per minute**: ไม่มีข้อจำกัดชัดเจน แต่แนะนำไม่เกิน 100/hour

### ระบบ Rate Limiting ที่ implement
- **Daily**: 300 emails/day (60% ของ Gmail limit)
- **Hourly**: 50 emails/hour
- **Minute**: 5 emails/minute (burst protection)

### การประเมิน Rate Limit Risk

#### สถานการณ์ปกติ (Normal Usage)
```
การใช้งานต่อวัน:
- Draft saves: 30 emails
- OTP requests: 20 emails  
- Submissions: 10 emails
- Password resets: 5 emails
- Admin notifications: 15 emails
รวม: ~80 emails/day (27% ของ limit)
```

#### สถานการณ์ Peak (High Usage)
```
การใช้งานต่อวันในช่วง peak:
- Draft saves: 100 emails
- OTP requests: 60 emails
- Submissions: 30 emails  
- Password resets: 15 emails
- Admin notifications: 45 emails
รวม: ~250 emails/day (83% ของ limit)
```

#### สถานการณ์วิกฤต (Crisis Scenario)
```
หากมีปัญหาระบบหรือ campaign:
- Draft saves: 200 emails
- OTP requests: 150 emails
- Submissions: 50 emails
- Password resets: 30 emails
- Admin notifications: 80 emails
รวม: ~510 emails/day (170% ของ limit) ❌
```

## ⚠️ ความเสี่ยงและข้อแนะนำ

### ความเสี่ยงสูง
1. **Peak Period**: ช่วงเปิดรับสมัครหรือใกล้ deadline อาจมีการใช้งานสูง
2. **System Issues**: หากระบบมีปัญหาและต้อง resend emails
3. **Spam/Abuse**: หากมีการใช้งานผิดปกติ

### ข้อแนะนำ

#### 1. Email Service Upgrade
```
พิจารณาอัปเกรด Gmail เป็น Google Workspace:
- Business Starter: 2,000 emails/day
- Business Standard: 10,000 emails/day
- หรือใช้ SendGrid, AWS SES
```

#### 2. Email Queue System
```
Implement email queue สำหรับ:
- Low priority emails (admin notifications)
- Retry mechanism สำหรับ failed emails
- Batch processing สำหรับ daily summaries
```

#### 3. Email Template Optimization
```
- ลดขนาด HTML templates
- ใช้ text-only สำหรับ admin notifications
- Compress images ใน email templates
```

#### 4. Monitoring และ Alerting
```
- Dashboard สำหรับ rate limit status
- Alert เมื่อใช้งานเกิน 80%
- Daily report ของการใช้งาน email
```

## 🔧 การ Monitor Rate Limit

### API Endpoint
```
GET /api/admin/email-status
```

### Response Example
```json
{
  "success": true,
  "status": {
    "daily": {
      "used": 45,
      "limit": 300,
      "remaining": 255,
      "percentage": 15
    },
    "hourly": {
      "used": 3,
      "limit": 50,
      "remaining": 47,
      "percentage": 6
    }
  },
  "health": "good",
  "recommendations": [
    "Email system operating normally"
  ]
}
```

## 📊 การติดตาม

### Metrics ที่ควรติดตาม
1. **Email Success Rate**: % ของ emails ที่ส่งสำเร็จ
2. **Rate Limit Usage**: % การใช้งาน daily/hourly limits
3. **Failed Emails**: จำนวน emails ที่ส่งไม่สำเร็จ
4. **Admin Notification Delivery**: การส่งแจ้งเตือนไปยัง admin

### แนะนำการตั้งค่า Alert
- **Warning**: เมื่อใช้งาน > 70% ของ daily limit
- **Critical**: เมื่อใช้งาน > 90% ของ daily limit
- **Emergency**: เมื่อ rate limited หรือ emails fail > 10%

## 🚀 การปรับปรุงในอนาคต

1. **Email Queue System**: สำหรับจัดการ high volume
2. **Multiple Email Providers**: Failover mechanism
3. **Email Analytics**: Tracking open rates, click rates
4. **Template Management**: Dynamic email templates
5. **Unsubscribe Management**: สำหรับ admin notifications