# 🛠️ Scripts Documentation

## 📋 Available Scripts

### 1. Setup Admin User (`setup-admin.js`)

Creates or updates the root admin user for DCP Admin dashboard.

**Credentials:**
- Email: `root@thaimusic.com`
- Password: `admin123`

**Usage:**
```bash
node scripts/setup-admin.js
```

**What it does:**
- Connects to MongoDB (localhost:27017)
- Creates/updates admin user with hashed password
- Sets role to 'admin' and isActive to true
- Verifies the user was created successfully

**Output:**
```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB
🔐 Hashing password...
✅ Password hashed
👤 Creating/Updating admin user...
✅ Admin user created successfully!
✅ Admin verification successful
🎉 Setup completed successfully!
```

---

### 2. Clear Local Storage (`clear-local-storage.html`)

Web-based tool to clear browser localStorage for testing.

**Usage:**
1. Open `scripts/clear-local-storage.html` in your browser
2. Click "📊 Check Storage" to see current data
3. Click "🗑️ Clear All Data" to remove everything

**What it clears:**
- Draft registration data (regist100, regist-support)
- Form progress and temporary saves
- Session tokens and cache
- All localStorage items

**Features:**
- Visual interface with status indicators
- Shows current storage contents
- Confirmation before clearing
- Success/error messages

---

## 🚀 Quick Start Guide

### First Time Setup

1. **Start MongoDB** (if not running):
   ```bash
   docker-compose up -d mongo
   ```

2. **Create Admin User**:
   ```bash
   node scripts/setup-admin.js
   ```

3. **Login to Admin Dashboard**:
   - URL: http://localhost:3000/dcp-admin
   - Email: root@thaimusic.com
   - Password: admin123

### Clear Browser Data

1. Open `scripts/clear-local-storage.html` in browser
2. Click "Clear All Data"
3. Refresh your application

---

## 🔧 Troubleshooting

### Problem: "MongoDB connection failed"

**Solution:**
```bash
# Check if MongoDB is running
docker ps | grep mongo

# If not running, start it
docker-compose up -d mongo

# Wait a few seconds, then try again
node scripts/setup-admin.js
```

### Problem: "Authentication failed"

**Solution:**
The script now uses direct connection without authentication.
If you still see this error:

```bash
# Check MongoDB is accessible
docker exec thai-music-mongo mongosh --eval "db.adminCommand('listDatabases')"

# If that works, the issue is with the connection string
# Edit scripts/setup-admin.js and update MONGODB_URI
```

### Problem: "Admin login returns 500 error"

**Solution:**
1. Check MongoDB is running: `docker ps`
2. Run setup script: `node scripts/setup-admin.js`
3. Check server logs for detailed error
4. Verify .env file has correct MONGODB_URI

### Problem: "Cannot clear localStorage"

**Solution:**
1. Open browser DevTools (F12)
2. Go to Application tab → Local Storage
3. Right-click → Clear
4. Or use the clear-local-storage.html tool

---

## 📝 Environment Variables

Make sure your `.env` file has:

```env
# MongoDB Connection (for local development)
MONGODB_URI=mongodb://localhost:27017/thai_music_school

# Or for Docker
MONGODB_URI=mongodb://root:rootpass@mongo:27017/thai_music_school?authSource=admin

# Database Name
MONGO_DB=thai_music_school
```

---

## 🔐 Security Notes

### Production Deployment

**⚠️ IMPORTANT:** Before deploying to production:

1. **Change Admin Password**:
   - Login with default credentials
   - Go to user settings
   - Change password immediately

2. **Update Environment Variables**:
   ```env
   # Use strong passwords
   MONGO_ROOT_PASSWORD=<strong-random-password>
   
   # Use secure connection string
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
   ```

3. **Disable Setup Script**:
   - Remove or restrict access to setup-admin.js
   - Or add authentication check

4. **Enable HTTPS**:
   - Use SSL/TLS for all connections
   - Configure reverse proxy (nginx/Apache)

---

## 📊 Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  email: String (lowercase, unique),
  password: String (bcrypt hashed),
  firstName: String,
  lastName: String,
  role: String ('admin' | 'teacher' | 'user'),
  phone: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date | null
}
```

### Admin User Example

```javascript
{
  email: "root@thaimusic.com",
  password: "$2a$10$...", // bcrypt hash of "admin123"
  firstName: "Super",
  lastName: "Admin",
  role: "admin",
  phone: "0800000000",
  isActive: true,
  createdAt: ISODate("2026-03-13T..."),
  updatedAt: ISODate("2026-03-13T..."),
  lastLogin: null
}
```

---

## 🧪 Testing

### Test Admin Login

```bash
# Using curl
curl -X POST http://localhost:3000/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"email":"root@thaimusic.com","password":"admin123"}'

# Expected response:
# {"success":true,"message":"เข้าสู่ระบบสำเร็จ","user":{...}}
```

### Test MongoDB Connection

```bash
# Direct connection
docker exec thai-music-mongo mongosh thai_music_school --eval "db.users.findOne({email:'root@thaimusic.com'})"

# Should show the admin user document
```

---

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [bcryptjs Documentation](https://github.com/dcodeIO/bcrypt.js)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

## 🆘 Need Help?

1. Check server logs: `docker logs thai-music-web`
2. Check MongoDB logs: `docker logs thai-music-mongo`
3. Verify environment variables: `cat .env`
4. Test MongoDB connection: `docker exec thai-music-mongo mongosh`

---

**Last Updated**: 2026-03-13  
**Version**: 1.0.0
