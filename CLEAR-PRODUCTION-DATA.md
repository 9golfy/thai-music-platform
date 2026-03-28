# Clear Production Database

This guide explains how to clear all data from the production database while preserving the super admin account.

## ⚠️ WARNING

This operation will **DELETE ALL DATA** from the production database including:
- All register100 submissions
- All register-support submissions  
- All teacher users
- All certificates
- All drafts

**ONLY the super admin account (root@thaimusic.com) will be preserved.**

## Prerequisites

1. SSH access to the production server (18.138.63.84)
2. Node.js and npm installed on the server
3. MongoDB running in Docker container

## Instructions

### Step 1: Connect to Production Server

```bash
ssh ubuntu@18.138.63.84
```

### Step 2: Navigate to Application Directory

```bash
cd /home/ubuntu/thai-music-platform
```

### Step 3: Run the Clear Script

```bash
npm run db:clear:prod
```

The script will:
1. Show a warning message
2. Wait 5 seconds (press Ctrl+C to cancel)
3. Connect to production MongoDB
4. Delete all documents from all collections
5. Preserve the super admin account (root@thaimusic.com)
6. Create super admin if it doesn't exist

### Step 4: Verify

After clearing, you can verify by:

1. **Check Users**: http://18.138.63.84:3000/dcp-admin/dashboard/users
   - Should only show super admin (root@thaimusic.com)

2. **Check Register100**: http://18.138.63.84:3000/dcp-admin/dashboard/register100
   - Should show empty list

3. **Check Register-Support**: http://18.138.63.84:3000/dcp-admin/dashboard/register-support
   - Should show empty list

## Super Admin Credentials

After clearing, you can login with:
- **Email**: root@thaimusic.com
- **Password**: P@sswordAdmin123
- **Role**: super_admin

## Alternative: Manual MongoDB Commands

If you prefer to run MongoDB commands directly:

```bash
# Connect to MongoDB container
docker exec -it mongodb mongosh -u root -p rootpass --authenticationDatabase admin

# Switch to database
use thai_music_school

# Delete all except super admin
db.users.deleteMany({ email: { $ne: "root@thaimusic.com" } })
db.register100_submissions.deleteMany({})
db.register_support_submissions.deleteMany({})
db.certificates.deleteMany({})
db.drafts.deleteMany({})

# Exit
exit
```

## Troubleshooting

### Script fails to connect

Check if MongoDB container is running:
```bash
docker ps | grep mongodb
```

If not running, start it:
```bash
cd /home/ubuntu/thai-music-platform
docker-compose up -d mongodb
```

### Permission denied

Make sure the script is executable:
```bash
chmod +x scripts/clear-database-production.js
```

### Super admin not found after clearing

The script automatically creates the super admin if it doesn't exist. If you still can't login, run:
```bash
npm run db:setup
```

## Safety Notes

1. ✅ Super admin is ALWAYS preserved
2. ✅ Script has 5-second countdown before execution
3. ✅ All operations are logged to console
4. ⚠️ This operation is IRREVERSIBLE
5. ⚠️ Make sure you have backups if needed

## Support

If you encounter any issues, contact the development team.
