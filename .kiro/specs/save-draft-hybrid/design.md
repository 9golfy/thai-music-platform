# Save Draft Feature - Design Document

**Feature Name**: Save Draft with Database + LocalStorage Hybrid  
**Created**: 2026-03-02  
**Status**: Design Phase  
**Priority**: High

---

## Overview

### Purpose

The Save Draft feature enables teachers to save their registration form progress (register100 or register-support) and resume later from any device without requiring login or authentication. The system uses a hybrid approach combining LocalStorage for speed and Database for reliability, with email + OTP verification for cross-device access.

### Key Design Principles

1. **No Authentication Required**: Uses email + OTP verification instead of login
2. **Hybrid Storage**: LocalStorage for same-device speed, Database for cross-device reliability
3. **Deferred Resource Creation**: School ID and user accounts created ONLY on final submit, not on draft save
4. **Security Through Obscurity + Verification**: Unguessable tokens (UUID v4) + OTP verification for access
5. **Graceful Degradation**: Works offline with LocalStorage, syncs when online

### Design Decisions

**Why No Login for Save Draft?**

The requirements explicitly avoid login for draft saving due to:
- Session timeout risk during password request flow
- Email delivery dependency blocking draft access
- Unnecessary friction for optional feature (~20% usage)
- Complexity of managing authentication state during form filling

**Solution**: Email + OTP verification provides sufficient security without authentication overhead.

**Why Defer School ID Creation?**

Creating School IDs on draft save would generate "zombie records" for abandoned drafts. By deferring creation until final submit, we maintain database integrity and avoid cleanup complexity.

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Registration Form (register100 / register-support)  │  │
│  │  - Auto-save to LocalStorage (30s debounced)        │  │
│  │  - Manual save button                                │  │
│  │  - Draft restoration on load                         │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  LocalStorage                                         │  │
│  │  - Fast access for same-device returns               │  │
│  │  - Survives page refresh                             │  │
│  │  - Max 5MB per draft                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Next.js API Routes                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  POST /api/draft/save                                │  │
│  │  GET  /api/draft/:token                              │  │
│  │  POST /api/draft/:token/request-otp                  │  │
│  │  POST /api/draft/:token/verify-otp                   │  │
│  │  PUT  /api/draft/:token                              │  │
│  │  POST /api/draft/:token/submit                       │  │
│  │  DELETE /api/draft/:token                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     MongoDB Database                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Collection: draft_submissions                       │  │
│  │  - Draft data with TTL index (7 days)               │  │
│  │  - OTP hashes with expiry                           │  │
│  │  - Rate limiting metadata                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Email Service (Gmail SMTP)               │
│  - Draft save confirmation with link                         │
│  - OTP delivery for verification                             │
│  - Expiry reminders (1 day before)                          │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

**Save Draft Flow:**
```
1. User clicks "Save Draft" → Enter email modal
2. Client validates email format
3. Client saves to LocalStorage (immediate)
4. Client calls POST /api/draft/save
5. Server generates UUID v4 token
6. Server saves to MongoDB
7. Server sends email with draft link
8. Server returns token to client
9. Client stores token in LocalStorage
10. Client shows success message
```

**Resume from Same Device:**
```
1. User returns to form page
2. Client checks LocalStorage for draft
3. If found, auto-populate form
4. Show "Draft restored" notification
5. Continue editing
```

**Resume from Different Device (with OTP):**
```
1. User clicks email link with token
2. Browser opens /draft/:token page
3. Client calls POST /api/draft/:token/request-otp
4. Server generates 6-digit OTP
5. Server hashes and stores OTP with 10min expiry
6. Server sends OTP via email
7. User enters OTP in verification form
8. Client calls POST /api/draft/:token/verify-otp
9. Server validates OTP
10. Server returns draft data
11. Client saves to LocalStorage
12. Client redirects to form with data
```

**Submit Draft:**
```
1. User completes form and clicks "Submit"
2. Client validates all fields
3. Client calls POST /api/draft/:token/submit
4. Server validates data
5. Server generates School ID (first time)
6. Server creates user account (first time)
7. Server creates submission record
8. Server deletes/marks draft as submitted
9. Server sends login credentials email
10. Client clears LocalStorage
11. Client shows success message
```

---

## Components and Interfaces

### Frontend Components

#### 1. SaveDraftButton Component
```typescript
// Location: components/forms/SaveDraftButton.tsx
interface SaveDraftButtonProps {
  formData: Record<string, any>;
  currentStep: number;
  submissionType: 'register100' | 'register-support';
  onSaveSuccess: (token: string) => void;
  onSaveError: (error: string) => void;
}
```

**Responsibilities:**
- Render "Save Draft" button
- Open email input modal
- Trigger save to LocalStorage
- Call save API
- Show success/error feedback

#### 2. EmailInputModal Component
```typescript
// Location: components/forms/EmailInputModal.tsx
interface EmailInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, phone: string) => Promise<void>;
  isLoading: boolean;
}
```

**Responsibilities:**
- Collect email and phone
- Validate email format
- Handle submission
- Show loading state

#### 3. OTPVerificationPage Component
```typescript
// Location: app/(front)/draft/[token]/page.tsx
interface OTPVerificationPageProps {
  params: { token: string };
}
```

**Responsibilities:**
- Display OTP input form
- Request OTP from server
- Verify OTP
- Handle OTP expiry
- Allow OTP regeneration
- Redirect to form on success

#### 4. DraftRestoreNotification Component
```typescript
// Location: components/forms/DraftRestoreNotification.tsx
interface DraftRestoreNotificationProps {
  onAccept: () => void;
  onReject: () => void;
  lastSaved: Date;
}
```

**Responsibilities:**
- Show draft restoration option
- Display last saved timestamp
- Allow user to accept or start fresh

#### 5. ConflictResolutionModal Component
```typescript
// Location: components/forms/ConflictResolutionModal.tsx
interface ConflictResolutionModalProps {
  localDraft: DraftData;
  remoteDraft: DraftData;
  onChoose: (source: 'local' | 'remote') => void;
}
```

**Responsibilities:**
- Display both draft versions
- Show timestamps and differences
- Allow user to choose version
- Sync chosen version

### Backend API Interfaces

#### POST /api/draft/save
```typescript
// Request
interface SaveDraftRequest {
  email: string;
  phone: string;
  submissionType: 'register100' | 'register-support';
  formData: Record<string, any>;
  currentStep: number;
}

// Response
interface SaveDraftResponse {
  success: boolean;
  draftToken: string;
  message: string;
  expiresAt: string; // ISO date
}
```

#### GET /api/draft/:token
```typescript
// Response (metadata only, no form data)
interface GetDraftMetadataResponse {
  success: boolean;
  exists: boolean;
  email: string; // partially masked: t***@example.com
  submissionType: 'register100' | 'register-support';
  currentStep: number;
  lastModified: string; // ISO date
  expiresAt: string; // ISO date
}
```

#### POST /api/draft/:token/request-otp
```typescript
// Request
interface RequestOTPRequest {
  // No body needed, token in URL
}

// Response
interface RequestOTPResponse {
  success: boolean;
  message: string;
  expiresAt: string; // ISO date (10 minutes from now)
  remainingRequests: number; // For rate limiting feedback
}
```

#### POST /api/draft/:token/verify-otp
```typescript
// Request
interface VerifyOTPRequest {
  otp: string; // 6-digit code
}

// Response
interface VerifyOTPResponse {
  success: boolean;
  message: string;
  formData?: Record<string, any>; // Only on success
  currentStep?: number;
  submissionType?: 'register100' | 'register-support';
}
```

#### PUT /api/draft/:token
```typescript
// Request
interface UpdateDraftRequest {
  formData: Record<string, any>;
  currentStep: number;
}

// Response
interface UpdateDraftResponse {
  success: boolean;
  message: string;
  lastModified: string; // ISO date
}
```

#### POST /api/draft/:token/submit
```typescript
// Request
interface SubmitDraftRequest {
  formData: Record<string, any>; // Complete validated data
}

// Response
interface SubmitDraftResponse {
  success: boolean;
  message: string;
  schoolId: string; // Generated on submit
  submissionId: string;
}
```

#### DELETE /api/draft/:token
```typescript
// Response
interface DeleteDraftResponse {
  success: boolean;
  message: string;
}
```

### Utility Functions

#### Draft Storage Utilities
```typescript
// Location: lib/utils/draftStorage.ts

interface LocalDraftData {
  draftToken: string | null;
  email: string;
  phone: string;
  submissionType: 'register100' | 'register-support';
  formData: Record<string, any>;
  currentStep: number;
  savedAt: number; // timestamp
  syncedAt: number | null; // last DB sync timestamp
}

function saveDraftToLocal(data: LocalDraftData): void;
function getDraftFromLocal(submissionType: string): LocalDraftData | null;
function clearDraftFromLocal(submissionType: string): void;
function getDraftAge(draft: LocalDraftData): number; // milliseconds
```

#### OTP Utilities
```typescript
// Location: lib/utils/otp.ts

function generateOTP(): string; // 6-digit code
function hashOTP(otp: string): Promise<string>; // bcrypt hash
function verifyOTP(otp: string, hash: string): Promise<boolean>;
function isOTPExpired(expiresAt: Date): boolean;
```

#### Rate Limiting Utilities
```typescript
// Location: lib/utils/rateLimit.ts

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

function checkDraftSaveRateLimit(email: string): Promise<RateLimitResult>;
function checkOTPRequestRateLimit(email: string): Promise<RateLimitResult>;
function incrementRateLimit(email: string, type: 'draft' | 'otp'): Promise<void>;
```

---

## Data Models

### MongoDB Schema

#### Collection: draft_submissions

```typescript
interface DraftSubmission {
  _id: ObjectId;
  draftToken: string; // UUID v4, indexed, unique
  email: string; // indexed for lookups
  phone: string;
  submissionType: 'register100' | 'register-support';
  formData: Record<string, any>; // All form fields
  currentStep: number;
  
  // Timestamps
  createdAt: Date;
  lastModified: Date;
  expiresAt: Date; // TTL index, 7 days from creation
  
  // OTP fields
  otp?: string; // bcrypt hashed 6-digit code
  otpExpiresAt?: Date; // 10 minutes from generation
  otpAttempts: number; // Failed verification attempts
  otpRequestCount: number; // Total OTP requests
  lastOtpRequestAt?: Date; // For rate limiting
  
  // Rate limiting
  saveCount: number; // Number of saves
  lastSaveAt: Date; // For rate limiting
  
  // Metadata
  ipAddress?: string; // For security logging
  userAgent?: string; // For analytics
  
  // Status
  status: 'active' | 'submitted' | 'expired'; // Track lifecycle
  submittedAt?: Date; // When converted to submission
}
```

**Indexes:**
```javascript
// TTL index for auto-deletion after 7 days
db.draft_submissions.createIndex(
  { "expiresAt": 1 },
  { expireAfterSeconds: 0 }
);

// Unique index on draft token
db.draft_submissions.createIndex(
  { "draftToken": 1 },
  { unique: true }
);

// Index on email for lookups and rate limiting
db.draft_submissions.createIndex(
  { "email": 1 }
);

// Compound index for finding active drafts by email and type
db.draft_submissions.createIndex(
  { "email": 1, "submissionType": 1, "status": 1 }
);
```

### LocalStorage Schema

```typescript
// Key: `draft_${submissionType}` (e.g., "draft_register100")
interface LocalStorageDraft {
  draftToken: string | null; // null if never synced to DB
  email: string;
  phone: string;
  submissionType: 'register100' | 'register-support';
  formData: {
    step1?: Record<string, any>;
    step2?: Record<string, any>;
    step3?: Record<string, any>;
    step4?: Record<string, any>;
    step5?: Record<string, any>;
    step6?: Record<string, any>;
    step7?: Record<string, any>;
    step8?: Record<string, any>;
  };
  currentStep: number;
  savedAt: number; // Unix timestamp
  syncedAt: number | null; // Last DB sync timestamp
}
```

### Form Data Structure

The `formData` object structure matches the existing form schemas:

**register100 Form Data:**
```typescript
interface Register100FormData {
  step1: {
    schoolName: string;
    province: string;
    district: string;
    subdistrict: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    schoolSize: string; // auto-calculated
    studentCount: number;
    // ... other step1 fields
  };
  step2: {
    managerName: string;
    managerPosition: string;
    managerImage: string; // base64
    // ... other step2 fields
  };
  // ... steps 3-8
}
```

**register-support Form Data:**
```typescript
interface RegisterSupportFormData {
  step1: {
    schoolName: string;
    province: string;
    // ... similar to register100
  };
  // ... steps 2-8
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified several redundant properties that can be consolidated:

**Redundancies Eliminated:**
- US-4.2 (email contains token) is subsumed by US-3.1
- US-6.2 (OTP sent immediately) is subsumed by US-3.3
- US-6.3 (OTP valid 10 minutes) is duplicate of US-3.9
- US-6.6 (draft loads after verification) is duplicate of US-3.5
- FR-4 (check LocalStorage first) is duplicate of US-2.1
- FR-6 (OTP expires 10 minutes) is duplicate of US-3.9
- FR-7 (School ID only on submit) is duplicate of US-5.2
- FR-9 (drafts expire 7 days) is duplicate of US-3.8
- NFR-3 (tokens unguessable) is duplicate of FR-3
- NFR-3 (OTP rate limit) is duplicate of US-6.5

**Properties Combined:**
- US-2.2 and US-2.3 combined into single round-trip property for LocalStorage
- US-3.5 and US-3.6 combined into single round-trip property for database
- Email content properties (US-4.1, US-4.3, US-4.4) combined into comprehensive email validation property

This reduces ~60 criteria to ~35 unique, non-redundant properties.

### Core Properties

### Property 1: LocalStorage Auto-save Persistence

*For any* form state, after 30 seconds of inactivity, the form data should be persisted to LocalStorage with a current timestamp.

**Validates: Requirements US-1.2**

### Property 2: Manual Save Creates Database Record

*For any* valid form data and email, when a user manually saves a draft, a database record should be created with a unique UUID v4 token.

**Validates: Requirements US-1.3, US-1.5, FR-2, FR-3**

### Property 3: Draft Save Triggers Email

*For any* successful draft save to database, an email should be sent to the provided email address containing the draft link.

**Validates: Requirements US-1.3, US-4.1**

### Property 4: LocalStorage Round-trip Preservation

*For any* form data and current step saved to LocalStorage, loading the form should restore both the data and the step number exactly.

**Validates: Requirements US-2.2, US-2.3**

### Property 5: Database Round-trip Preservation via OTP

*For any* form data saved to database, after successful OTP verification, the retrieved data should match the saved data exactly.

**Validates: Requirements US-3.5, US-3.6**

### Property 6: OTP Format Validation

*For any* generated OTP, it should be exactly 6 digits (numeric characters only) and cryptographically random.

**Validates: Requirements US-3.3, US-6.1**

### Property 7: OTP Expiry Enforcement

*For any* OTP older than 10 minutes, verification attempts should fail with an expiry error.

**Validates: Requirements US-3.9**

### Property 8: Draft Link Expiry Enforcement

*For any* draft older than 7 days, access attempts should fail with an expiry error, and the record should be automatically deleted by TTL index.

**Validates: Requirements US-3.8**

### Property 9: Email Content Completeness

*For any* draft save email, the email body should contain: (1) a valid draft link with token, (2) the submission type, (3) the expiry date, and (4) instructions for resuming.

**Validates: Requirements US-3.1, US-4.3, US-4.4**

### Property 10: School ID Deferred Creation

*For any* draft save operation, no School ID should be generated. School IDs should only be created during final submission.

**Validates: Requirements US-5.2, FR-7**

### Property 11: User Account Deferred Creation

*For any* draft save operation, no user account should be created. User accounts should only be created during final submission.

**Validates: Requirements US-5.3**

### Property 12: Submission Validation Consistency

*For any* draft submission, the validation rules applied should be identical to those used for direct submissions (without draft).

**Validates: Requirements US-5.1, FR-8**

### Property 13: Draft Cleanup on Submission

*For any* successful draft submission, the draft record should be marked as submitted or deleted, and LocalStorage should be cleared.

**Validates: Requirements US-5.5**

### Property 14: Submission Credentials Email

*For any* successful draft submission, an email containing login credentials (School ID, email, password) should be sent to the teacher.

**Validates: Requirements US-5.7**

### Property 15: OTP Rate Limiting

*For any* email address, after 3 OTP requests within a 1-hour window, further OTP requests should be denied until the window resets.

**Validates: Requirements US-6.5**

### Property 16: Draft Save Rate Limiting

*For any* email address, after 5 draft saves within a 1-hour window, further save requests should be denied until the window resets.

**Validates: Requirements NFR-3**

### Property 17: Conflict Detection

*For any* draft where LocalStorage timestamp differs from database timestamp by more than 1 minute, the system should detect the conflict and present resolution options.

**Validates: Requirements US-7.1, US-7.2**

### Property 18: Conflict Resolution Sync

*For any* conflict resolution where a user chooses a version, both LocalStorage and database should be updated to contain the chosen version with matching timestamps.

**Validates: Requirements US-7.4**

### Property 19: One Draft Per Email Per Type

*For any* email and submission type combination, creating a new draft should replace any existing draft for that combination.

**Validates: Requirements FR-10**

### Property 20: OTP Hashing Security

*For any* OTP stored in the database, it should be stored as a bcrypt hash, never in plain text.

**Validates: Requirements NFR-3**

### Property 21: Token Unguessability

*For any* generated draft token, it should match the UUID v4 format (128-bit random value) making it cryptographically unguessable.

**Validates: Requirements FR-3**

### Property 22: Auto-save Network Isolation

*For any* auto-save operation to LocalStorage, no network requests should be initiated (verified by monitoring network activity during auto-save intervals).

**Validates: Requirements FR-1**

### Property 23: Email Validation Enforcement

*For any* draft save attempt with an invalid email format, the save should be rejected before creating any database records.

**Validates: Requirements FR-2**

### Property 24: Offline LocalStorage Capability

*For any* form state, when network connectivity is unavailable, saving to LocalStorage should succeed without errors.

**Validates: Requirements NFR-6**

### Property 25: Email Failure Isolation

*For any* draft save where email delivery fails, the draft should still be successfully saved to the database and the token should be returned to the client.

**Validates: Requirements NFR-6**

### Property 26: LocalStorage Priority on Load

*For any* form load, the system should check LocalStorage before making any database requests, and use LocalStorage data if available and valid.

**Validates: Requirements US-2.1**

### Property 27: Newer Version Preference

*For any* conflict between LocalStorage and database drafts, when timestamps differ, the system should automatically prefer the version with the newer timestamp.

**Validates: Requirements FR-5**

### Property 28: OTP Expiry Metadata

*For any* OTP record in the database, it should include an expiry timestamp set to exactly 10 minutes from generation time.

**Validates: Requirements FR-11**

### Property 29: Storage Sync Consistency

*For any* draft save operation that succeeds in both LocalStorage and database, the `syncedAt` timestamp in LocalStorage should match the `lastModified` timestamp in the database.

**Validates: Requirements NFR-5**

### Property 30: Draft Restoration Notification

*For any* form load where a draft is found in LocalStorage, a notification should be displayed to the user indicating the draft was restored.

**Validates: Requirements US-2.4**

### Property 31: OTP Regeneration Capability

*For any* expired OTP, the user should be able to request a new OTP, which generates a fresh 6-digit code with a new 10-minute expiry.

**Validates: Requirements US-6.4**

### Property 32: Submission Record Creation

*For any* successful draft submission, a submission record should be created in the appropriate collection (register100_submissions or register_support_submissions) with all form data.

**Validates: Requirements US-5.4**

### Property 33: Expiry Reminder Timing

*For any* draft that is 6 days old (1 day before 7-day expiry), a reminder email should be sent to the user with the remaining time and draft link.

**Validates: Requirements US-8.1, US-8.2, US-8.3**

### Property 34: Admin Dashboard Draft Count

*For any* state of the draft_submissions collection, the admin dashboard should display the correct count of active drafts, grouped by submission type.

**Validates: Requirements US-9.1, US-9.2**

### Property 35: Admin Analytics Calculations

*For any* set of drafts, the admin dashboard should correctly calculate: (1) average time from creation to submission, and (2) abandonment rate (expired drafts / total drafts).

**Validates: Requirements US-9.3, US-9.4**

---

## Error Handling

### Client-Side Error Handling

#### LocalStorage Errors

**Quota Exceeded:**
```typescript
try {
  localStorage.setItem(key, value);
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    // Show warning to user
    showWarning('LocalStorage is full. Draft will be saved to database only.');
    // Fallback to database-only mode
    saveToDatabaseOnly();
  }
}
```

**LocalStorage Unavailable:**
```typescript
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// Graceful degradation
if (!isLocalStorageAvailable()) {
  // Use database-only mode
  useDatabaseOnlyMode();
}
```

#### Network Errors

**Save Draft API Failure:**
```typescript
try {
  const response = await fetch('/api/draft/save', { ... });
  if (!response.ok) {
    throw new Error('Save failed');
  }
} catch (error) {
  // Draft still in LocalStorage
  showError('Could not save to server. Your draft is saved locally.');
  // Retry logic with exponential backoff
  scheduleRetry();
}
```

**OTP Request Failure:**
```typescript
try {
  await requestOTP(token);
} catch (error) {
  if (error.status === 429) {
    showError('Too many OTP requests. Please try again later.');
  } else if (error.status === 404) {
    showError('Draft not found or expired.');
  } else {
    showError('Could not send OTP. Please check your connection.');
  }
}
```

#### Validation Errors

**Email Format:**
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  showError('Please enter a valid email address.');
  return;
}
```

**OTP Format:**
```typescript
const otpRegex = /^\d{6}$/;
if (!otpRegex.test(otp)) {
  showError('OTP must be exactly 6 digits.');
  return;
}
```

### Server-Side Error Handling

#### Database Errors

**Connection Failure:**
```typescript
try {
  const { db } = await connectToDatabase();
} catch (error) {
  console.error('Database connection failed:', error);
  return NextResponse.json(
    { success: false, message: 'Database unavailable. Please try again later.' },
    { status: 503 }
  );
}
```

**Duplicate Token (extremely rare):**
```typescript
try {
  await draftsCollection.insertOne(draftData);
} catch (error) {
  if (error.code === 11000) { // Duplicate key
    // Regenerate token and retry
    draftData.draftToken = generateUUID();
    await draftsCollection.insertOne(draftData);
  } else {
    throw error;
  }
}
```

#### Rate Limiting Errors

**Draft Save Limit Exceeded:**
```typescript
const rateLimit = await checkDraftSaveRateLimit(email);
if (!rateLimit.allowed) {
  return NextResponse.json(
    {
      success: false,
      message: `Too many save attempts. Please try again after ${formatTime(rateLimit.resetAt)}.`,
      resetAt: rateLimit.resetAt.toISOString(),
    },
    { status: 429 }
  );
}
```

**OTP Request Limit Exceeded:**
```typescript
const rateLimit = await checkOTPRequestRateLimit(email);
if (!rateLimit.allowed) {
  return NextResponse.json(
    {
      success: false,
      message: `Too many OTP requests. Please try again in ${rateLimit.remaining} minutes.`,
      remainingRequests: 0,
    },
    { status: 429 }
  );
}
```

#### OTP Verification Errors

**Invalid OTP:**
```typescript
const isValid = await verifyOTP(otp, draft.otp);
if (!isValid) {
  // Increment failed attempts
  await draftsCollection.updateOne(
    { draftToken: token },
    { $inc: { otpAttempts: 1 } }
  );
  
  // Lock after 5 failed attempts
  if (draft.otpAttempts >= 4) {
    await draftsCollection.updateOne(
      { draftToken: token },
      { $set: { status: 'locked' } }
    );
    return NextResponse.json(
      { success: false, message: 'Too many failed attempts. Draft locked for security.' },
      { status: 403 }
    );
  }
  
  return NextResponse.json(
    { success: false, message: 'Invalid OTP. Please try again.' },
    { status: 401 }
  );
}
```

**Expired OTP:**
```typescript
if (isOTPExpired(draft.otpExpiresAt)) {
  return NextResponse.json(
    {
      success: false,
      message: 'OTP has expired. Please request a new one.',
      expired: true,
    },
    { status: 401 }
  );
}
```

#### Email Errors

**Email Send Failure:**
```typescript
const emailSent = await sendDraftEmail(email, draftToken, submissionType);
if (!emailSent) {
  // Log error but don't fail the request
  console.error('Failed to send draft email to:', email);
  
  // Return success with warning
  return NextResponse.json({
    success: true,
    draftToken,
    message: 'Draft saved successfully. Email delivery failed - please save this link.',
    emailFailed: true,
  });
}
```

#### Validation Errors

**Missing Required Fields:**
```typescript
const requiredFields = ['email', 'phone', 'submissionType', 'formData'];
const missing = requiredFields.filter(field => !body[field]);

if (missing.length > 0) {
  return NextResponse.json(
    {
      success: false,
      message: 'Missing required fields',
      missingFields: missing,
    },
    { status: 400 }
  );
}
```

**Invalid Submission Type:**
```typescript
if (!['register100', 'register-support'].includes(submissionType)) {
  return NextResponse.json(
    {
      success: false,
      message: 'Invalid submission type. Must be register100 or register-support.',
    },
    { status: 400 }
  );
}
```

### Error Recovery Strategies

#### Automatic Retry with Exponential Backoff

```typescript
async function saveWithRetry(data: DraftData, maxRetries = 3): Promise<boolean> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await saveDraft(data);
      return true;
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt) * 1000;
      await sleep(delay);
    }
  }
  return false;
}
```

#### Conflict Resolution

```typescript
async function resolveConflict(
  localDraft: DraftData,
  remoteDraft: DraftData
): Promise<DraftData> {
  // Automatic resolution: use newer version
  if (localDraft.savedAt > remoteDraft.lastModified.getTime()) {
    // Local is newer, sync to remote
    await updateDraft(remoteDraft.draftToken, localDraft);
    return localDraft;
  } else {
    // Remote is newer, sync to local
    saveDraftToLocal(remoteDraft);
    return remoteDraft;
  }
}
```

#### Graceful Degradation

```typescript
// If database is down, continue with LocalStorage only
if (!isDatabaseAvailable()) {
  showWarning('Server unavailable. Draft saved locally only.');
  saveDraftToLocal(formData);
  // Queue for later sync
  queueForSync(formData);
}
```

---

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests for comprehensive coverage:

**Unit Tests** focus on:
- Specific examples and edge cases
- Integration points between components
- Error conditions and boundary cases
- UI interactions and user flows

**Property-Based Tests** focus on:
- Universal properties that hold for all inputs
- Comprehensive input coverage through randomization
- Round-trip properties (save/load cycles)
- Invariants that must be maintained

Together, these approaches provide comprehensive coverage: unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across all possible inputs.

### Property-Based Testing Configuration

**Library Selection:** fast-check (TypeScript/JavaScript)
- Mature library with excellent TypeScript support
- Integrates well with Jest/Vitest
- Supports custom generators for complex data structures

**Test Configuration:**
- Minimum 100 iterations per property test (due to randomization)
- Each test tagged with comment referencing design property
- Tag format: `// Feature: save-draft-hybrid, Property {number}: {property_text}`

**Example Property Test Structure:**
```typescript
import fc from 'fast-check';

// Feature: save-draft-hybrid, Property 4: LocalStorage Round-trip Preservation
describe('LocalStorage Round-trip', () => {
  it('should preserve form data and step through save/load cycle', () => {
    fc.assert(
      fc.property(
        fc.record({
          formData: fc.object(),
          currentStep: fc.integer({ min: 1, max: 8 }),
          email: fc.emailAddress(),
          phone: fc.string({ minLength: 10, maxLength: 10 }),
        }),
        (draft) => {
          // Save to LocalStorage
          saveDraftToLocal(draft);
          
          // Load from LocalStorage
          const loaded = getDraftFromLocal(draft.submissionType);
          
          // Assert equality
          expect(loaded.formData).toEqual(draft.formData);
          expect(loaded.currentStep).toBe(draft.currentStep);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Test Coverage

#### Frontend Component Tests

**SaveDraftButton Component:**
```typescript
describe('SaveDraftButton', () => {
  it('should open email modal when clicked', () => {
    // Test UI interaction
  });
  
  it('should disable button while saving', () => {
    // Test loading state
  });
  
  it('should show success message after save', () => {
    // Test feedback
  });
  
  it('should handle save errors gracefully', () => {
    // Test error handling
  });
});
```

**OTPVerificationPage:**
```typescript
describe('OTPVerificationPage', () => {
  it('should validate OTP format before submission', () => {
    // Test input validation
  });
  
  it('should show error for invalid OTP', () => {
    // Test error feedback
  });
  
  it('should allow OTP regeneration after expiry', () => {
    // Test regeneration flow
  });
  
  it('should redirect to form after successful verification', () => {
    // Test navigation
  });
});
```

#### Backend API Tests

**POST /api/draft/save:**
```typescript
describe('POST /api/draft/save', () => {
  it('should create draft with valid data', async () => {
    // Test successful creation
  });
  
  it('should reject invalid email format', async () => {
    // Test validation
  });
  
  it('should enforce rate limiting', async () => {
    // Test rate limits
  });
  
  it('should replace existing draft for same email/type', async () => {
    // Test one-draft-per-email rule
  });
});
```

**POST /api/draft/:token/verify-otp:**
```typescript
describe('POST /api/draft/:token/verify-otp', () => {
  it('should accept valid OTP', async () => {
    // Test successful verification
  });
  
  it('should reject expired OTP', async () => {
    // Test expiry enforcement
  });
  
  it('should lock after 5 failed attempts', async () => {
    // Test security lockout
  });
});
```

#### Utility Function Tests

**OTP Utilities:**
```typescript
describe('OTP Utilities', () => {
  it('should generate 6-digit numeric OTP', () => {
    const otp = generateOTP();
    expect(otp).toMatch(/^\d{6}$/);
  });
  
  it('should hash OTP securely', async () => {
    const otp = '123456';
    const hash = await hashOTP(otp);
    expect(hash).not.toBe(otp);
    expect(await verifyOTP(otp, hash)).toBe(true);
  });
});
```

**Rate Limiting:**
```typescript
describe('Rate Limiting', () => {
  it('should allow requests within limit', async () => {
    // Test normal operation
  });
  
  it('should block requests exceeding limit', async () => {
    // Test enforcement
  });
  
  it('should reset after time window', async () => {
    // Test reset behavior
  });
});
```

### Integration Tests

**End-to-End Draft Flow:**
```typescript
describe('Complete Draft Flow', () => {
  it('should save, load, and submit draft successfully', async () => {
    // 1. Fill form
    // 2. Save draft
    // 3. Verify email sent
    // 4. Request OTP
    // 5. Verify OTP
    // 6. Load draft
    // 7. Complete form
    // 8. Submit
    // 9. Verify School ID created
    // 10. Verify user account created
  });
});
```

**Cross-Device Flow:**
```typescript
describe('Cross-Device Access', () => {
  it('should access draft from different device via OTP', async () => {
    // 1. Save draft on device A
    // 2. Open link on device B
    // 3. Request OTP
    // 4. Verify OTP
    // 5. Load draft on device B
  });
});
```

### Performance Tests

**LocalStorage Performance:**
```typescript
describe('LocalStorage Performance', () => {
  it('should save to LocalStorage in under 50ms', () => {
    const start = performance.now();
    saveDraftToLocal(largeDraft);
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(50);
  });
});
```

**API Response Times:**
```typescript
describe('API Performance', () => {
  it('should save draft in under 2 seconds', async () => {
    const start = Date.now();
    await saveDraft(draftData);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(2000);
  });
});
```

### Security Tests

**Token Security:**
```typescript
describe('Token Security', () => {
  it('should generate cryptographically random tokens', () => {
    const tokens = new Set();
    for (let i = 0; i < 1000; i++) {
      tokens.add(generateDraftToken());
    }
    expect(tokens.size).toBe(1000); // No collisions
  });
  
  it('should reject invalid token formats', async () => {
    const response = await fetch('/api/draft/invalid-token');
    expect(response.status).toBe(404);
  });
});
```

**OTP Security:**
```typescript
describe('OTP Security', () => {
  it('should never store OTP in plain text', async () => {
    const draft = await createDraft();
    await requestOTP(draft.draftToken);
    
    const stored = await getDraftFromDB(draft.draftToken);
    expect(stored.otp).not.toMatch(/^\d{6}$/); // Should be hashed
  });
});
```

### Test Data Generators

**Draft Data Generator:**
```typescript
const draftArbitrary = fc.record({
  email: fc.emailAddress(),
  phone: fc.string({ minLength: 10, maxLength: 10 }),
  submissionType: fc.constantFrom('register100', 'register-support'),
  formData: fc.object(),
  currentStep: fc.integer({ min: 1, max: 8 }),
});
```

**Form Data Generator:**
```typescript
const formDataArbitrary = fc.record({
  step1: fc.record({
    schoolName: fc.string({ minLength: 1, maxLength: 200 }),
    province: fc.string(),
    email: fc.emailAddress(),
    phone: fc.string({ minLength: 10, maxLength: 10 }),
  }),
  // ... other steps
});
```

---

## Security Considerations

### Authentication and Authorization

**No Login Required for Draft Access:**
- Draft access uses email + OTP verification instead of authentication
- Reduces friction for optional feature
- Sufficient security for non-sensitive draft data
- School ID and user accounts created only on final submit

**Token-Based Access Control:**
- Draft tokens are UUID v4 (128-bit random, cryptographically secure)
- Tokens are unguessable (2^122 possible values)
- Tokens expire after 7 days via MongoDB TTL index
- No token enumeration possible

**OTP Verification:**
- 6-digit numeric codes (1 million possible values)
- 10-minute expiry window
- Rate limited to 3 requests per hour per email
- Locked after 5 failed verification attempts
- Stored as bcrypt hashes, never plain text

### Data Protection

**Sensitive Data Handling:**
- No passwords stored in drafts (only in final user accounts)
- Email addresses validated and sanitized
- Phone numbers validated for format
- Form data stored as-is (no PII beyond what user provides)

**Storage Security:**
- LocalStorage: Client-side only, no sensitive data
- Database: MongoDB with authentication required
- OTP hashes: bcrypt with salt rounds = 10
- Draft tokens: UUID v4, indexed for fast lookup

**Transport Security:**
- All API calls over HTTPS
- Email links use HTTPS
- No sensitive data in URL parameters (except token)

### Rate Limiting

**Draft Save Rate Limiting:**
- Maximum 5 saves per hour per email
- Prevents spam and abuse
- Tracked in database with timestamps
- Returns 429 status when exceeded

**OTP Request Rate Limiting:**
- Maximum 3 OTP requests per hour per email
- Prevents brute force attacks
- Tracked per draft record
- Returns 429 status when exceeded

**Failed OTP Attempts:**
- Maximum 5 failed attempts per OTP
- Draft locked after limit exceeded
- Requires admin intervention to unlock
- Prevents brute force attacks

### Input Validation

**Email Validation:**
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validateEmail(email: string): boolean {
  return emailRegex.test(email) && email.length <= 254;
}
```

**Phone Validation:**
```typescript
const phoneRegex = /^[0-9]{10}$/;
function validatePhone(phone: string): boolean {
  return phoneRegex.test(phone);
}
```

**Token Validation:**
```typescript
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function validateToken(token: string): boolean {
  return uuidRegex.test(token);
}
```

**OTP Validation:**
```typescript
const otpRegex = /^\d{6}$/;
function validateOTP(otp: string): boolean {
  return otpRegex.test(otp);
}
```

### Logging and Monitoring

**Security Event Logging:**
- Failed OTP attempts (with IP address)
- Rate limit violations
- Invalid token access attempts
- Draft lockouts

**Privacy Considerations:**
- Never log OTP values (plain or hashed)
- Mask email addresses in logs (t***@example.com)
- Log IP addresses for security only
- Comply with data retention policies

### Threat Mitigation

**Threat: Token Guessing**
- Mitigation: UUID v4 tokens (2^122 possible values)
- Mitigation: No token enumeration endpoint
- Mitigation: Tokens expire after 7 days

**Threat: OTP Brute Force**
- Mitigation: 6-digit codes (1M possibilities)
- Mitigation: 10-minute expiry
- Mitigation: 5 attempt lockout
- Mitigation: Rate limiting (3 requests/hour)

**Threat: Email Spam**
- Mitigation: Rate limiting (5 saves/hour, 3 OTPs/hour)
- Mitigation: Email validation
- Mitigation: CAPTCHA (future enhancement)

**Threat: Draft Spam/Abuse**
- Mitigation: One draft per email per type
- Mitigation: Automatic expiry after 7 days
- Mitigation: Rate limiting on saves

**Threat: Data Injection**
- Mitigation: Input validation on all fields
- Mitigation: MongoDB parameterized queries
- Mitigation: No eval() or dynamic code execution

**Threat: XSS in Form Data**
- Mitigation: React auto-escapes by default
- Mitigation: Sanitize on display if using dangerouslySetInnerHTML
- Mitigation: Content Security Policy headers

---

## Implementation Plan

### Phase 1: Core Infrastructure (Days 1-3)

**Database Setup:**
- [ ] Create `draft_submissions` collection
- [ ] Add TTL index on `expiresAt` field
- [ ] Add unique index on `draftToken` field
- [ ] Add compound index on `email`, `submissionType`, `status`
- [ ] Test TTL index behavior

**Utility Functions:**
- [ ] Implement `lib/utils/draftStorage.ts` (LocalStorage utilities)
- [ ] Implement `lib/utils/otp.ts` (OTP generation, hashing, verification)
- [ ] Implement `lib/utils/rateLimit.ts` (rate limiting logic)
- [ ] Implement `lib/utils/draftToken.ts` (UUID v4 generation)
- [ ] Write unit tests for all utilities

**Email Templates:**
- [ ] Create draft save email template
- [ ] Create OTP email template
- [ ] Create expiry reminder email template
- [ ] Create submission success email template
- [ ] Test email rendering

### Phase 2: Backend APIs (Days 4-6)

**API Routes:**
- [ ] Implement `POST /api/draft/save`
- [ ] Implement `GET /api/draft/:token`
- [ ] Implement `POST /api/draft/:token/request-otp`
- [ ] Implement `POST /api/draft/:token/verify-otp`
- [ ] Implement `PUT /api/draft/:token`
- [ ] Implement `POST /api/draft/:token/submit`
- [ ] Implement `DELETE /api/draft/:token`

**API Testing:**
- [ ] Write integration tests for each endpoint
- [ ] Test rate limiting enforcement
- [ ] Test error handling
- [ ] Test validation logic

### Phase 3: Frontend Components (Days 7-10)

**Core Components:**
- [ ] Create `SaveDraftButton` component
- [ ] Create `EmailInputModal` component
- [ ] Create `OTPVerificationPage` component
- [ ] Create `DraftRestoreNotification` component
- [ ] Create `ConflictResolutionModal` component

**Form Integration:**
- [ ] Integrate auto-save into register100 form
- [ ] Integrate auto-save into register-support form
- [ ] Add manual save button to both forms
- [ ] Implement draft restoration on form load
- [ ] Test cross-device flow

**UI/UX:**
- [ ] Design and implement loading states
- [ ] Design and implement error states
- [ ] Design and implement success feedback
- [ ] Ensure mobile responsiveness
- [ ] Test accessibility (keyboard navigation, screen readers)

### Phase 4: Advanced Features (Days 11-13)

**Conflict Resolution:**
- [ ] Implement timestamp comparison logic
- [ ] Create conflict detection on form load
- [ ] Implement conflict resolution UI
- [ ] Test sync after resolution

**Draft Management:**
- [ ] Implement draft expiry reminder job
- [ ] Create admin dashboard for draft statistics
- [ ] Add draft count and analytics
- [ ] Test scheduled jobs

**Error Recovery:**
- [ ] Implement retry logic with exponential backoff
- [ ] Add offline detection and graceful degradation
- [ ] Implement sync queue for offline saves
- [ ] Test error scenarios

### Phase 5: Testing and Polish (Days 14-17)

**Property-Based Testing:**
- [ ] Write property tests for all 35 properties
- [ ] Configure fast-check with 100 iterations
- [ ] Create custom generators for draft data
- [ ] Run property tests and fix issues

**Integration Testing:**
- [ ] Test complete save-load-submit flow
- [ ] Test cross-device access flow
- [ ] Test conflict resolution flow
- [ ] Test rate limiting scenarios
- [ ] Test OTP expiry and regeneration

**Performance Testing:**
- [ ] Measure LocalStorage save time (<50ms)
- [ ] Measure API response times (<2s)
- [ ] Test with large form data (images as base64)
- [ ] Optimize if needed

**Security Testing:**
- [ ] Test token unguessability
- [ ] Test OTP brute force protection
- [ ] Test rate limiting enforcement
- [ ] Test input validation
- [ ] Penetration testing (if resources available)

**User Acceptance Testing:**
- [ ] Test with real users on multiple devices
- [ ] Gather feedback on UX
- [ ] Test email delivery reliability
- [ ] Test mobile browser compatibility

### Phase 6: Documentation and Deployment (Days 18-19)

**Documentation:**
- [ ] Write user guide for save draft feature
- [ ] Document API endpoints
- [ ] Create troubleshooting guide
- [ ] Update system architecture docs

**Deployment:**
- [ ] Deploy to staging environment
- [ ] Run full test suite on staging
- [ ] Monitor for errors
- [ ] Deploy to production
- [ ] Monitor email delivery
- [ ] Monitor error rates

**Post-Deployment:**
- [ ] Set up monitoring alerts
- [ ] Track usage metrics
- [ ] Monitor draft completion rate
- [ ] Gather user feedback

### Phase 7: Monitoring and Iteration (Ongoing)

**Metrics to Track:**
- Draft save rate (% of users who save drafts)
- Draft completion rate (% of drafts that become submissions)
- Cross-device usage (% of drafts accessed from multiple devices)
- Average time from draft creation to submission
- Email delivery success rate
- OTP verification success rate
- Error rates by type

**Optimization Opportunities:**
- Adjust rate limits based on usage patterns
- Optimize email templates based on open rates
- Improve conflict resolution UX based on feedback
- Add features based on user requests

---

## Deployment Considerations

### Environment Variables

```bash
# Existing
MONGODB_URI=mongodb://...
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
NEXT_PUBLIC_APP_URL=https://your-domain.com

# New (if needed)
DRAFT_EXPIRY_DAYS=7
OTP_EXPIRY_MINUTES=10
DRAFT_SAVE_RATE_LIMIT=5
OTP_REQUEST_RATE_LIMIT=3
```

### Database Migration

**Create Collection and Indexes:**
```javascript
// Run this script once during deployment
db.createCollection('draft_submissions');

db.draft_submissions.createIndex(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

db.draft_submissions.createIndex(
  { draftToken: 1 },
  { unique: true }
);

db.draft_submissions.createIndex(
  { email: 1 }
);

db.draft_submissions.createIndex(
  { email: 1, submissionType: 1, status: 1 }
);
```

### Email Service Capacity

**Current Setup (Gmail Personal):**
- Limit: 500 emails/day
- Sufficient for pilot phase (<100 schools)
- Draft feature estimated: 150-200 emails

**If Scaling Needed:**
- AWS SES: $9/month for 10,000 emails
- Resend: $20/month for 50,000 emails
- Google Workspace: $6/user/month with higher limits

### Monitoring Setup

**Application Monitoring:**
- Error tracking (Sentry or similar)
- Performance monitoring (response times)
- Uptime monitoring (API endpoints)

**Business Metrics:**
- Draft save count (daily/weekly)
- Draft completion rate
- Email delivery success rate
- OTP verification success rate

**Alerts:**
- Email delivery failures
- High error rates (>5%)
- Rate limit violations (potential abuse)
- Database connection issues

### Rollback Plan

**If Issues Arise:**
1. Disable save draft feature via feature flag
2. Existing submissions continue to work normally
3. LocalStorage drafts remain accessible
4. Database drafts preserved for later recovery
5. Fix issues and re-enable

**Feature Flag Implementation:**
```typescript
const SAVE_DRAFT_ENABLED = process.env.NEXT_PUBLIC_SAVE_DRAFT_ENABLED === 'true';

if (!SAVE_DRAFT_ENABLED) {
  return null; // Hide save draft button
}
```

### Backup and Recovery

**Database Backups:**
- Regular MongoDB backups (daily)
- Include `draft_submissions` collection
- Test restore procedures

**Data Retention:**
- Active drafts: 7 days (TTL index)
- Submitted drafts: Archive for 30 days (optional)
- Expired drafts: Deleted automatically

---

## Future Enhancements

### Phase 2 Features (Post-Launch)

**1. Draft Sharing (Optional)**
- Allow teachers to share draft link with colleagues
- Collaborative editing (with conflict resolution)
- Permission management

**2. Draft Templates (Optional)**
- Save common form patterns as templates
- Quick start from template
- Template library

**3. Draft Versioning (Optional)**
- Keep history of draft changes
- Ability to revert to previous version
- Show diff between versions

**4. Extended Expiry (Optional)**
- Allow users to extend draft expiry
- Email link to extend for another 7 days
- Maximum 2 extensions (21 days total)

**5. Offline Mode Enhancement**
- Service worker for full offline support
- Background sync when connection restored
- Offline indicator in UI

**6. Admin Draft Management**
- View all active drafts
- Manually expire or delete drafts
- Contact users with abandoned drafts
- Export draft data for analysis

**7. CAPTCHA Integration**
- Add CAPTCHA to draft save (if spam becomes issue)
- Add CAPTCHA to OTP request
- Use Google reCAPTCHA v3 (invisible)

**8. Multi-Language Support**
- Email templates in multiple languages
- UI text in multiple languages
- Language preference in draft data

### Performance Optimizations

**1. Compression**
- Compress form data before storing
- Use gzip for large drafts
- Reduce LocalStorage usage

**2. Caching**
- Cache draft metadata in Redis
- Reduce database queries
- Faster draft lookups

**3. CDN for Static Assets**
- Serve email images from CDN
- Faster email rendering
- Reduced server load

### Analytics Enhancements

**1. User Behavior Tracking**
- Track which steps users save most often
- Identify drop-off points
- A/B test save draft UI

**2. Conversion Funnel**
- Track draft → submission conversion
- Identify barriers to completion
- Optimize based on data

**3. Email Engagement**
- Track email open rates
- Track link click rates
- Optimize email content

---

## Appendix

### API Request/Response Examples

#### POST /api/draft/save

**Request:**
```json
{
  "email": "teacher@school.ac.th",
  "phone": "0812345678",
  "submissionType": "register100",
  "formData": {
    "step1": {
      "schoolName": "โรงเรียนตัวอย่าง",
      "province": "กรุงเทพมหานคร",
      "email": "teacher@school.ac.th",
      "phone": "0812345678"
    },
    "step2": {
      "managerName": "นายผู้จัดการ",
      "managerPosition": "ผู้อำนวยการ"
    }
  },
  "currentStep": 2
}
```

**Response (Success):**
```json
{
  "success": true,
  "draftToken": "550e8400-e29b-41d4-a716-446655440000",
  "message": "บันทึกแบบฟอร์มเรียบร้อยแล้ว",
  "expiresAt": "2026-03-09T10:30:00.000Z"
}
```

**Response (Rate Limited):**
```json
{
  "success": false,
  "message": "คุณบันทึกแบบฟอร์มบ่อยเกินไป กรุณาลองใหม่ในอีก 45 นาที",
  "resetAt": "2026-03-02T11:15:00.000Z"
}
```

#### POST /api/draft/:token/request-otp

**Request:**
```
POST /api/draft/550e8400-e29b-41d4-a716-446655440000/request-otp
(No body)
```

**Response (Success):**
```json
{
  "success": true,
  "message": "ส่งรหัส OTP ไปยังอีเมลของคุณแล้ว",
  "expiresAt": "2026-03-02T10:40:00.000Z",
  "remainingRequests": 2
}
```

**Response (Rate Limited):**
```json
{
  "success": false,
  "message": "คุณขอรหัส OTP บ่อยเกินไป กรุณาลองใหม่ในอีก 30 นาที",
  "remainingRequests": 0
}
```

#### POST /api/draft/:token/verify-otp

**Request:**
```json
{
  "otp": "123456"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "ยืนยันรหัส OTP สำเร็จ",
  "formData": {
    "step1": { ... },
    "step2": { ... }
  },
  "currentStep": 2,
  "submissionType": "register100"
}
```

**Response (Invalid OTP):**
```json
{
  "success": false,
  "message": "รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
  "attemptsRemaining": 4
}
```

**Response (Expired OTP):**
```json
{
  "success": false,
  "message": "รหัส OTP หมดอายุแล้ว กรุณาขอรหัสใหม่",
  "expired": true
}
```

### Email Templates

#### Draft Save Email

**Subject:** บันทึกแบบฟอร์มสมัครของคุณ - [submission type]

**Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Sarabun', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .info-box { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #16a34a; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎵 Thai Music Platform</h1>
      <p>บันทึกแบบฟอร์มสมัครของคุณ</p>
    </div>
    
    <div class="content">
      <h2>สวัสดีครับ/ค่ะ</h2>
      <p>คุณได้บันทึกแบบฟอร์มสมัคร <strong>[submission type]</strong> ไว้เรียบร้อยแล้ว</p>
      
      <div class="info-box">
        <p><strong>📧 อีเมล:</strong> [email]</p>
        <p><strong>📝 ประเภท:</strong> [submission type]</p>
        <p><strong>📅 วันหมดอายุ:</strong> [expiry date] (7 วันจากนี้)</p>
        <p><strong>📍 ขั้นตอนปัจจุบัน:</strong> [current step]/8</p>
      </div>
      
      <p>คุณสามารถกลับมาทำแบบฟอร์มต่อได้ทุกเมื่อโดยคลิกปุ่มด้านล่าง:</p>
      
      <a href="[draft link]" class="button">เปิดแบบฟอร์มของฉัน</a>
      
      <p><strong>⚠️ หมายเหตุ:</strong></p>
      <ul>
        <li>ลิงก์นี้จะหมดอายุใน 7 วัน</li>
        <li>เมื่อคลิกลิงก์ คุณจะต้องยืนยันตัวตนด้วยรหัส OTP ที่ส่งไปยังอีเมลนี้</li>
        <li>หากคุณกลับมาใช้เครื่องเดิม แบบฟอร์มจะถูกเรียกคืนโดยอัตโนมัติ</li>
      </ul>
    </div>
    
    <div class="footer">
      <p>หากคุณไม่ได้บันทึกแบบฟอร์มนี้ กรุณาเพิกเฉยอีเมลนี้</p>
      <p>© 2026 Thai Music Platform. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

#### OTP Email

**Subject:** รหัส OTP สำหรับเข้าถึงแบบฟอร์มของคุณ

**Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Sarabun', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .otp-box { background: white; padding: 30px; text-align: center; border-radius: 6px; margin: 20px 0; border: 2px solid #16a34a; }
    .otp-code { font-size: 36px; font-weight: bold; color: #16a34a; letter-spacing: 8px; font-family: monospace; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 รหัส OTP</h1>
      <p>ยืนยันตัวตนเพื่อเข้าถึงแบบฟอร์ม</p>
    </div>
    
    <div class="content">
      <h2>รหัส OTP ของคุณ</h2>
      <p>กรุณากรอกรหัส 6 หลักด้านล่างเพื่อเข้าถึงแบบฟอร์มที่บันทึกไว้:</p>
      
      <div class="otp-box">
        <div class="otp-code">[OTP CODE]</div>
        <p style="margin-top: 20px; color: #6b7280;">รหัสนี้จะหมดอายุใน 10 นาที</p>
      </div>
      
      <p><strong>⚠️ คำเตือนด้านความปลอดภัย:</strong></p>
      <ul>
        <li>อย่าแชร์รหัสนี้กับผู้อื่น</li>
        <li>รหัสนี้ใช้ได้เพียงครั้งเดียว</li>
        <li>หากคุณไม่ได้ขอรหัสนี้ กรุณาเพิกเฉยอีเมลนี้</li>
      </ul>
    </div>
    
    <div class="footer">
      <p>หากรหัสหมดอายุ คุณสามารถขอรหัสใหม่ได้</p>
      <p>© 2026 Thai Music Platform. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

### Database Query Examples

**Find Active Drafts for Email:**
```javascript
db.draft_submissions.find({
  email: "teacher@school.ac.th",
  status: "active",
  expiresAt: { $gt: new Date() }
});
```

**Find Drafts Expiring Soon (for reminders):**
```javascript
const oneDayFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);
const twoDaysFromNow = new Date(Date.now() + 48 * 60 * 60 * 1000);

db.draft_submissions.find({
  status: "active",
  expiresAt: {
    $gte: oneDayFromNow,
    $lt: twoDaysFromNow
  }
});
```

**Count Drafts by Type:**
```javascript
db.draft_submissions.aggregate([
  { $match: { status: "active" } },
  { $group: {
    _id: "$submissionType",
    count: { $sum: 1 }
  }}
]);
```

**Calculate Average Completion Time:**
```javascript
db.draft_submissions.aggregate([
  { $match: { status: "submitted" } },
  { $project: {
    completionTime: {
      $subtract: ["$submittedAt", "$createdAt"]
    }
  }},
  { $group: {
    _id: null,
    avgTime: { $avg: "$completionTime" }
  }}
]);
```

**Calculate Abandonment Rate:**
```javascript
db.draft_submissions.aggregate([
  { $group: {
    _id: "$status",
    count: { $sum: 1 }
  }},
  { $group: {
    _id: null,
    total: { $sum: "$count" },
    expired: {
      $sum: {
        $cond: [{ $eq: ["$_id", "expired"] }, "$count", 0]
      }
    }
  }},
  { $project: {
    abandonmentRate: {
      $multiply: [
        { $divide: ["$expired", "$total"] },
        100
      ]
    }
  }}
]);
```

---

## Glossary

**Draft**: Incomplete form submission saved for later completion

**Draft Token**: Unique UUID v4 identifier for accessing a draft (128-bit random value)

**OTP (One-Time Password)**: 6-digit numeric code used for email verification (valid for 10 minutes)

**TTL (Time To Live)**: MongoDB feature for automatic document deletion after expiry

**Hybrid Approach**: Using both LocalStorage (client-side) and Database (server-side) for storage

**Rate Limiting**: Restricting the number of requests per time period to prevent abuse

**Round-trip Property**: Testing that data saved and then loaded remains unchanged

**Zombie Records**: Database records created but never used (avoided by deferring School ID creation)

**Conflict Resolution**: Process of choosing between different versions of the same draft

**Graceful Degradation**: System continues to work with reduced functionality when components fail

**Exponential Backoff**: Retry strategy where wait time doubles after each failure

**bcrypt**: Cryptographic hashing algorithm used for OTP storage

**UUID v4**: Universally Unique Identifier version 4 (random 128-bit value)

**Property-Based Testing**: Testing approach that verifies properties hold for all inputs

**fast-check**: JavaScript/TypeScript library for property-based testing

---

## References

### Technical Documentation

- **MongoDB TTL Indexes**: https://docs.mongodb.com/manual/core/index-ttl/
- **LocalStorage API**: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- **UUID v4 Specification**: https://www.rfc-editor.org/rfc/rfc4122
- **bcrypt Algorithm**: https://en.wikipedia.org/wiki/Bcrypt
- **Next.js API Routes**: https://nextjs.org/docs/api-routes/introduction
- **fast-check Documentation**: https://github.com/dubzzz/fast-check

### Related Project Documents

- **SITE-STRUCTURE-NEW.md**: Overall site architecture
- **AUTHENTICATION-SYSTEM-PHASE1.md**: Existing authentication system
- **Requirements Document**: `.kiro/specs/save-draft-hybrid/requirements.md`

### Email Service Options

- **Gmail SMTP**: https://support.google.com/mail/answer/7126229
- **AWS SES**: https://aws.amazon.com/ses/
- **Resend**: https://resend.com/
- **Google Workspace**: https://workspace.google.com/

---

## Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-03-02 | 1.0 | Initial design document created | Kiro AI |

---

**Document Status**: ✅ Complete - Ready for Review

**Next Steps**:
1. Review design document with stakeholders
2. Gather feedback and iterate if needed
3. Proceed to task creation phase
4. Begin implementation

