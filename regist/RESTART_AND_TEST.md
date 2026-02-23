# Restart Dev Server and Test MongoDB Integration

## Current Status

✅ MongoDB connection code added to Next.js API route
✅ Simplified E2E test created and runs successfully
✅ Test submits form without errors
❌ Data NOT saved to MongoDB (dev server needs restart)

## Why Data Wasn't Saved

The Next.js dev server was running BEFORE we added MongoDB credentials to `.env.local`. 
Next.js only loads environment variables on startup, so we need to restart the server.

## Steps to Fix and Verify

### 1. Stop the Current Dev Server

Press `Ctrl+C` in the terminal where `npm run dev` is running (port 3003)

Or kill the process:
```powershell
# Find the PID
netstat -ano | findstr :3003

# Kill it (replace PID with actual number)
taskkill /F /PID 26452
```

### 2. Restart Dev Server

```powershell
cd web
npm run dev
```

The server should start on port 3003 (or 3000 if available).

### 3. Verify Environment Variables Loaded

Check the terminal output - there should be no MongoDB connection errors.

### 4. Run the Simplified Test

```powershell
cd web
npx ts-node --project tsconfig-e2e.json e2e/register69-simple.e2e.ts
```

The test will:
- Fill all 7 steps with minimum required data
- Submit the form
- Display success message

### 5. Verify Data in MongoDB

```powershell
cd web
npx ts-node scripts/check-submissions.ts
```

You should see:
- Total submissions: 2 (or more)
- Latest submission with:
  - School: "โรงเรียนทดสอบ E2E"
  - Manager: "นายทดสอบ E2E"
  - Teaching Plans: 1 item
  - All fields from steps 1-7

## Expected MongoDB Document

```json
{
  "_id": ObjectId("..."),
  "createdAt": ISODate("2026-02-14T..."),
  "updatedAt": ISODate("2026-02-14T..."),
  "schoolName": "โรงเรียนทดสอบ E2E",
  "schoolProvince": "กรุงเทพมหานคร",
  "schoolLevel": "PRIMARY",
  "phone": "02-123-4567",
  "mgtFullName": "นายทดสอบ E2E",
  "mgtPosition": "ผู้อำนวยการ",
  "mgtPhone": "081-234-5678",
  "thaiMusicTeachers": [
    {
      "teacherFullName": "นางสาวครู E2E",
      "teacherPosition": "ครูดนตรี",
      "teacherPhone": "082-345-6789"
    }
  ],
  "currentTeachingPlans": [
    {
      "gradeLevel": "ป.4-ป.6",
      "planDetails": "สอนดนตรีไทยพื้นฐาน"
    }
  ],
  "teacherSkillThaiMusicMajor": "ครูมีความเชี่ยวชาญในการสอนดนตรีไทย",
  "photoGalleryLink": "https://drive.google.com/example",
  "files": {
    "mgtImage": {
      "name": "manager.jpg",
      "size": ...,
      "type": "image/jpeg"
    },
    "mediaPhotos": [],
    "teacherImages": []
  },
  "certifiedINFOByAdminName": true
}
```

## Alternative: View in Mongo Express

1. Open browser: http://localhost:8081
2. Click: `thai_music_school` database
3. Click: `register69_submissions` collection
4. View the documents

## Troubleshooting

### Error: "MONGO_URI is not defined"
- Check `.env.local` exists in `web/` folder
- Verify it contains: `MONGO_URI=mongodb://root:rootpass@localhost:27017/?authSource=admin`
- Restart dev server

### Error: "Connection refused"
- Check MongoDB is running: `docker ps | findstr mongo`
- Start MongoDB: `docker-compose up -d mongo`

### Test runs but no new data
- Verify dev server was restarted AFTER adding MONGO_URI
- Check dev server terminal for errors
- Check browser console for API errors

## Clean Up Test Data

To remove test submissions:

```powershell
docker exec -it thai-music-mongo mongosh -u root -p rootpass --authenticationDatabase admin
```

Then in mongosh:
```javascript
use thai_music_school
db.register69_submissions.deleteMany({ schoolName: /ทดสอบ|E2E/ })
```
