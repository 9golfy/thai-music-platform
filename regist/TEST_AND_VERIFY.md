# Test and Verify Guide

## Overview
This guide explains how to run the E2E test and verify data is saved to MongoDB.

## Prerequisites
1. MongoDB running (via docker-compose)
2. Next.js dev server running on port 3003
3. Test images created in `test-assets/` folder

## Step 1: Run the E2E Test

```powershell
cd web
.\run-selenium-e2e.bat
```

The test will:
- Open Chrome browser (visible mode)
- Navigate to http://localhost:3003
- Fill all 7 steps of the registration form:
  - Step 1: School basic info (name, province, level, address, etc.)
  - Step 2: Manager info + photo upload
  - Step 3: 2 teachers + photo uploads
  - Step 4: 2 teaching plans + 2 instruments
  - Step 5: Teacher skills, curriculum, support factors, awards
  - Step 6: Photo gallery link, classroom video, performance video
  - Step 7: Certification checkbox and submit
- Submit the form
- Display success message with submission ID

## Step 2: Verify Data in MongoDB

### Option A: Using the Check Script

```powershell
cd web
npx ts-node scripts/check-submissions.ts
```

This will display:
- Total number of submissions
- Details of each submission
- Full document of the latest submission

### Option B: Using Mongo Express (Web UI)

1. Open browser: http://localhost:8081
2. Navigate to: `thai_music_school` database
3. Click on: `register69_submissions` collection
4. View the documents

### Option C: Using MongoDB CLI

```powershell
docker exec -it thai-music-mongo mongosh -u root -p rootpass --authenticationDatabase admin
```

Then in mongosh:
```javascript
use thai_music_school
db.register69_submissions.find().pretty()
db.register69_submissions.countDocuments()
```

## What Data Should Be Saved

The test fills the following data:

### Step 1: Basic Information
- schoolName: "โรงเรียนดนตรีไทยตัวอย่าง"
- schoolProvince: "กรุงเทพมหานคร"
- schoolLevel: "PRIMARY"
- affiliation: "กระทรวงศึกษาธิการ (Ministry of Education)"
- Address fields (addressNo, moo, road, subDistrict, district, etc.)
- phone, fax

### Step 2: Management
- mgtFullName: "นายสมชาย ใจดี"
- mgtPosition: "ผู้อำนวยการ"
- mgtPhone: "081-234-5678"
- mgtEmail: "somchai@school.ac.th"
- mgtImage: manager.jpg (file metadata)

### Step 3: Teachers (Array)
- 2 teachers with full details
- Teacher images (file metadata)

### Step 4: Teaching Plans & Instruments (Arrays)
- 2 teaching plans (grade levels and details)
- 2 instruments (name and quantity)

### Step 5: Skills & Support (Arrays)
- teacherSkillThaiMusicMajor (textarea)
- curriculumFramework (textarea)
- 1 support factor (with admin, school board, others support)
- 1 award (name, level, year)

### Step 6: Media (Arrays)
- photoGalleryLink
- 1 classroom video (title and link)
- 1 performance video (title and link)

### Step 7: Certification
- certifiedINFOByAdminName: true

## Expected MongoDB Document Structure

```json
{
  "_id": ObjectId("..."),
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("..."),
  "schoolName": "โรงเรียนดนตรีไทยตัวอย่าง",
  "schoolProvince": "กรุงเทพมหานคร",
  "schoolLevel": "PRIMARY",
  "mgtFullName": "นายสมชาย ใจดี",
  "mgtPosition": "ผู้อำนวยการ",
  "mgtPhone": "081-234-5678",
  "thaiMusicTeachers": [
    {
      "teacherFullName": "นางสาวสมหญิง ดนตรี",
      "teacherPosition": "ครูดนตรีไทย",
      ...
    },
    ...
  ],
  "currentTeachingPlans": [...],
  "availableInstruments": [...],
  "supportFactors": [...],
  "awards": [...],
  "classroomVideos": [...],
  "performanceVideos": [...],
  "files": {
    "mgtImage": { "name": "manager.jpg", "size": ..., "type": "image/jpeg" },
    "mediaPhotos": [],
    "teacherImages": [...]
  },
  "certifiedINFOByAdminName": true
}
```

## Troubleshooting

### Test fails to submit
- Check if Next.js dev server is running on port 3003
- Check browser console for errors
- Verify all required fields are filled

### Data not in MongoDB
- Check MongoDB is running: `docker ps | findstr mongo`
- Check .env.local has correct MONGO_URI
- Check Next.js server logs for errors
- Restart Next.js dev server to load new .env.local

### Connection errors
- Verify MongoDB connection string in .env.local
- Check MongoDB is accessible: `docker exec -it thai-music-mongo mongosh -u root -p rootpass`

## Clean Up Test Data

To remove test submissions:

```javascript
// In mongosh
use thai_music_school
db.register69_submissions.deleteMany({ schoolName: "โรงเรียนดนตรีไทยตัวอย่าง" })
```

Or delete all:
```javascript
db.register69_submissions.deleteMany({})
```
