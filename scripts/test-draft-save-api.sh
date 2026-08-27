#!/bin/bash
# Test Draft Save API
# 
# ทดสอบ API save draft และดูว่า draft ถูกบันทึกใน database ไหน
# 
# Usage:
#   bash scripts/test-draft-save-api.sh

echo "=== ทดสอบ Draft Save API ==="
echo ""

# สร้าง test email แบบ unique
TIMESTAMP=$(date +%s)
TEST_EMAIL="test-draft-${TIMESTAMP}@example.com"
TEST_PHONE="0812345678"

echo "📧 Test Email: $TEST_EMAIL"
echo "📱 Test Phone: $TEST_PHONE"
echo ""

# เรียก API save draft
echo "🔄 กำลังเรียก API /api/draft/save..."
echo ""

RESPONSE=$(curl -s -X POST https://dcpschool100.net/api/draft/save \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"phone\": \"$TEST_PHONE\",
    \"submissionType\": \"register100\",
    \"currentStep\": 1,
    \"formData\": {
      \"reg100_schoolName\": \"โรงเรียนทดสอบ\",
      \"reg100_schoolProvince\": \"กรุงเทพมหานคร\"
    }
  }")

echo "📥 Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# แยก token จาก response
TOKEN=$(echo "$RESPONSE" | jq -r '.draftToken' 2>/dev/null)

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo "✅ Draft Token: $TOKEN"
  echo "🔗 Draft Link: https://dcpschool100.net/draft/$TOKEN"
  echo ""
  
  # ตรวจสอบใน database
  echo "🔍 ตรวจสอบใน database..."
  echo ""
  
  # ค้นหาใน thai_music_school
  echo "1️⃣ ค้นหาใน database: thai_music_school"
  mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" \
    --quiet \
    --eval "
      var draft = db.draft_submissions.findOne({email: '$TEST_EMAIL'});
      if (draft) {
        print('✅ พบใน thai_music_school');
        print('   Token: ' + draft.token);
        print('   Email: ' + draft.email);
        print('   Created: ' + draft.createdAt);
      } else {
        print('❌ ไม่พบใน thai_music_school');
      }
    "
  echo ""
  
  # ค้นหาใน thai_music_platform
  echo "2️⃣ ค้นหาใน database: thai_music_platform"
  mongosh "mongodb://root:rootpass@localhost:27017/thai_music_platform?authSource=admin" \
    --quiet \
    --eval "
      var draft = db.draft_submissions.findOne({email: '$TEST_EMAIL'});
      if (draft) {
        print('✅ พบใน thai_music_platform');
        print('   Token: ' + draft.token);
        print('   Email: ' + draft.email);
        print('   Created: ' + draft.createdAt);
      } else {
        print('❌ ไม่พบใน thai_music_platform');
      }
    "
  echo ""
  
  # ลบ test draft
  echo "🗑️  ลบ test draft..."
  mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" \
    --quiet \
    --eval "
      var result = db.draft_submissions.deleteOne({email: '$TEST_EMAIL'});
      if (result.deletedCount > 0) {
        print('✅ ลบจาก thai_music_school สำเร็จ');
      }
    "
  
  mongosh "mongodb://root:rootpass@localhost:27017/thai_music_platform?authSource=admin" \
    --quiet \
    --eval "
      var result = db.draft_submissions.deleteOne({email: '$TEST_EMAIL'});
      if (result.deletedCount > 0) {
        print('✅ ลบจาก thai_music_platform สำเร็จ');
      }
    "
  echo ""
  
else
  echo "❌ ไม่สามารถสร้าง draft ได้"
  echo "Response: $RESPONSE"
fi

echo "=== เสร็จสิ้น ==="
