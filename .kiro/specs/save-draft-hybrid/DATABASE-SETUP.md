# Database Infrastructure Setup - Save Draft Feature

## Overview

This document describes the database infrastructure for the Save Draft feature, including the `draft_submissions` collection schema, indexes, and TTL (Time To Live) behavior.

## Collection: draft_submissions

### Purpose

Stores draft form submissions that teachers can save and resume later. Drafts automatically expire after 7 days using MongoDB's TTL index feature.

### Schema

```typescript
interface DraftSubmission {
  _id: ObjectId;
  draftToken: string;              // UUID v4, unique identifier
  email: string;                   // Teacher's email
  phone: string;                   // Teacher's phone
  submissionType: 'register100' | 'register-support';
  formData: Record<string, any>;   // All form fields
  currentStep: number;             // Current form step (1-8)
  
  // Timestamps
  createdAt: Date;
  lastModified: Date;
  expiresAt: Date;                 // TTL index, 7 days from creation
  
  // OTP fields
  otp?: string;                    // bcrypt hashed 6-digit code
  otpExpiresAt?: Date;             // 10 minutes from generation
  otpAttempts: number;             // Failed verification attempts
  otpRequestCount: number;         // Total OTP requests
  lastOtpRequestAt?: Date;         // For rate limiting
  
  // Rate limiting
  saveCount: number;               // Number of saves
  lastSaveAt: Date;                // For rate limiting
  
  // Metadata
  ipAddress?: string;              // For security logging
  userAgent?: string;              // For analytics
  
  // Status
  status: 'active' | 'submitted' | 'expired';
  submittedAt?: Date;              // When converted to submission
}
```

### Indexes

The collection has 5 indexes (including the default `_id` index):

#### 1. TTL Index on `expiresAt`
```javascript
{ expiresAt: 1 }
Options: { expireAfterSeconds: 0, name: 'ttl_expiresAt' }
```
- **Purpose**: Automatically delete drafts after 7 days
- **Behavior**: MongoDB's background task checks every 60 seconds and deletes expired documents
- **Note**: Documents may take up to 60 seconds after expiry to be deleted

#### 2. Unique Index on `draftToken`
```javascript
{ draftToken: 1 }
Options: { unique: true, name: 'unique_draftToken' }
```
- **Purpose**: Ensure each draft has a unique token (UUID v4)
- **Behavior**: Prevents duplicate tokens (extremely rare with UUID v4)

#### 3. Index on `email`
```javascript
{ email: 1 }
Options: { name: 'idx_email' }
```
- **Purpose**: Fast lookups by email for rate limiting and draft retrieval
- **Use Cases**: 
  - Check if user has existing draft
  - Rate limiting queries
  - Admin dashboard queries

#### 4. Compound Index on `email`, `submissionType`, `status`
```javascript
{ email: 1, submissionType: 1, status: 1 }
Options: { name: 'idx_email_type_status' }
```
- **Purpose**: Efficiently find active drafts for a specific email and submission type
- **Use Cases**:
  - One draft per email per type enforcement
  - Finding user's active draft
  - Admin dashboard filtering

## Setup Scripts

### 1. Initial Setup: `scripts/setup-draft-submissions.js`

Creates the `draft_submissions` collection with all indexes and runs a TTL test.

**Usage:**
```bash
node scripts/setup-draft-submissions.js
```

**What it does:**
1. Creates `draft_submissions` collection
2. Creates all 4 indexes (TTL, unique, email, compound)
3. Inserts a test document that expires in 10 seconds
4. Verifies the test document exists
5. Lists all indexes

**Output:**
- Collection created
- Indexes created
- Test document inserted
- Index details displayed

### 2. Verification: `scripts/verify-draft-ttl.js`

Verifies that the TTL index is working correctly by checking for expired test documents.

**Usage:**
```bash
node scripts/verify-draft-ttl.js
```

**What it does:**
1. Connects to MongoDB
2. Checks for test documents (token starts with `test-token-`)
3. Shows expiry status of each test document
4. Displays collection statistics
5. Confirms TTL index configuration

**Expected Results:**
- After 10+ seconds: Test document should be expired (pending deletion)
- After 60+ seconds: Test document should be deleted (TTL index working)

### 3. Main Database Setup: `scripts/setup-database.js`

Updated to include `draft_submissions` collection in the main database setup.

**Usage:**
```bash
node scripts/setup-database.js
```

**What it does:**
1. Creates all collections (users, certificates, submissions, drafts)
2. Creates all indexes for all collections
3. Creates root user if not exists
4. Displays database summary

## TTL Index Behavior

### How It Works

MongoDB's TTL index automatically deletes documents after a specified time:

1. **Index Configuration**: `{ expiresAt: 1 }` with `expireAfterSeconds: 0`
2. **Background Task**: MongoDB runs a background task every 60 seconds
3. **Deletion**: Documents where `expiresAt < current_time` are deleted
4. **Delay**: Up to 60 seconds between expiry and actual deletion

### Example Timeline

```
Time 0:00  - Draft created with expiresAt = 7 days from now
Time 7d    - Draft expires (expiresAt reached)
Time 7d+60s - MongoDB background task deletes the draft (max delay)
```

### Testing TTL Index

**Quick Test (10 seconds):**
```bash
# Run setup script (creates test document expiring in 10s)
node scripts/setup-draft-submissions.js

# Wait 15 seconds
Start-Sleep -Seconds 15

# Verify (should show expired, pending deletion)
node scripts/verify-draft-ttl.js

# Wait 60 more seconds
Start-Sleep -Seconds 60

# Verify again (should be deleted)
node scripts/verify-draft-ttl.js
```

**Manual Test:**
```javascript
// Insert test draft
db.draft_submissions.insertOne({
  draftToken: "manual-test-" + Date.now(),
  email: "test@example.com",
  phone: "0812345678",
  submissionType: "register100",
  formData: {},
  currentStep: 1,
  createdAt: new Date(),
  lastModified: new Date(),
  expiresAt: new Date(Date.now() + 30000), // 30 seconds
  status: "active",
  saveCount: 1,
  lastSaveAt: new Date(),
  otpAttempts: 0,
  otpRequestCount: 0
});

// Wait 30+ seconds, then check
db.draft_submissions.find({ draftToken: /^manual-test-/ });
// Should be empty after ~90 seconds (30s expiry + 60s TTL delay)
```

## Production Considerations

### 1. Expiry Duration

The default expiry is 7 days from creation:
```javascript
expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
```

To change the expiry duration, modify the `expiresAt` value when creating drafts.

### 2. Monitoring

Monitor these metrics:
- Total draft count
- Active vs expired drafts
- Average draft age
- Conversion rate (drafts → submissions)

**Query Examples:**
```javascript
// Total drafts
db.draft_submissions.countDocuments();

// Active drafts
db.draft_submissions.countDocuments({ status: 'active' });

// Expired (pending deletion)
db.draft_submissions.countDocuments({ 
  expiresAt: { $lt: new Date() } 
});

// Drafts by type
db.draft_submissions.aggregate([
  { $match: { status: 'active' } },
  { $group: { _id: '$submissionType', count: { $sum: 1 } } }
]);
```

### 3. Backup Considerations

- TTL index continues to work on backup/restore
- Expired documents in backups will be deleted after restore
- Consider excluding `draft_submissions` from backups (optional)

### 4. Performance

- Indexes optimize common queries
- TTL background task has minimal performance impact
- Consider adding more indexes if new query patterns emerge

## Troubleshooting

### TTL Index Not Working

**Symptoms:**
- Expired documents not being deleted
- Test documents remain after 60+ seconds

**Checks:**
1. Verify TTL index exists:
   ```javascript
   db.draft_submissions.getIndexes();
   ```
   Should show `ttl_expiresAt` with `expireAfterSeconds: 0`

2. Check MongoDB logs for TTL errors:
   ```bash
   docker logs mongo | grep TTL
   ```

3. Verify `expiresAt` field is a Date object (not string):
   ```javascript
   db.draft_submissions.findOne({}, { expiresAt: 1 });
   ```

**Solutions:**
- Recreate index: `db.draft_submissions.dropIndex('ttl_expiresAt')` then run setup script
- Ensure `expiresAt` is Date type, not string
- Check MongoDB version (TTL requires MongoDB 2.2+)

### Duplicate Token Errors

**Symptoms:**
- Error inserting draft: "E11000 duplicate key error"

**Cause:**
- Extremely rare UUID v4 collision
- Or manual insertion with duplicate token

**Solution:**
- Regenerate token and retry (handled in API code)
- Check for manual insertions with duplicate tokens

### Slow Queries

**Symptoms:**
- Draft lookups taking >100ms

**Checks:**
1. Verify indexes are being used:
   ```javascript
   db.draft_submissions.find({ email: "test@example.com" }).explain("executionStats");
   ```

2. Check index usage:
   ```javascript
   db.draft_submissions.aggregate([
     { $indexStats: {} }
   ]);
   ```

**Solutions:**
- Ensure queries use indexed fields
- Add new indexes for common query patterns
- Consider compound indexes for multi-field queries

## Migration Guide

### Adding to Existing Database

If you already have a database and want to add the draft_submissions collection:

```bash
# Run the setup script
node scripts/setup-draft-submissions.js

# Verify indexes
node scripts/verify-draft-ttl.js
```

### Removing Draft Submissions

To remove the collection and all data:

```javascript
// Drop collection
db.draft_submissions.drop();

// Or just clear data
db.draft_submissions.deleteMany({});
```

## References

- **MongoDB TTL Indexes**: https://docs.mongodb.com/manual/core/index-ttl/
- **MongoDB Indexes**: https://docs.mongodb.com/manual/indexes/
- **Design Document**: `.kiro/specs/save-draft-hybrid/design.md`
- **Requirements**: `.kiro/specs/save-draft-hybrid/requirements.md`

## Summary

✅ Collection created: `draft_submissions`  
✅ TTL index: Auto-deletes after 7 days  
✅ Unique index: Prevents duplicate tokens  
✅ Email index: Fast lookups  
✅ Compound index: Efficient filtering  
✅ Test verified: TTL working correctly  

**Next Steps:**
1. Implement draft save API (`POST /api/draft/save`)
2. Implement OTP verification APIs
3. Integrate with registration forms
