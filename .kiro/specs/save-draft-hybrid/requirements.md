# Save Draft Feature - Hybrid Approach
## Requirements Document

**Feature Name**: Save Draft with Database + LocalStorage Hybrid  
**Created**: 2026-03-02  
**Status**: Draft  
**Priority**: High

---

## 1. Overview

### 1.1 Purpose
Enable teachers to save their registration form progress and resume later from any device, combining the speed of LocalStorage with the reliability of Database storage. No login or authentication required - uses email verification only.

### 1.2 Background
Currently, teachers must complete the entire registration form (register100 or register-support) in one session. If they close the browser or lose connection, all progress is lost. This creates a poor user experience, especially for lengthy forms with multiple steps.

Save draft is an optional feature expected to be used by ~20% of teachers. Most teachers (80%) will complete the form in one session without saving.

### 1.3 Goals
- Allow teachers to save form progress at any time WITHOUT requiring login
- Enable cross-device access via email link with OTP verification
- Provide fast local caching for same-device returns
- Prevent data loss from browser cache clearing
- Maintain data integrity without creating zombie School IDs or user records
- Keep the process simple and friction-free

---

## 2. User Stories

### 2.1 Primary User Stories

**US-1: Save Draft During Form Completion**
```
As a teacher filling out the registration form
I want to save my progress at any time
So that I don't lose my work if I need to stop
```

**Acceptance Criteria**:
- [ ] "Save Draft" button visible on all form steps
- [ ] Auto-save to LocalStorage every 30 seconds
- [ ] Manual save creates database record + sends email
- [ ] Success message shows after save
- [ ] Draft token generated and stored

**US-2: Resume from Same Device**
```
As a teacher who saved a draft
When I return to the form on the same browser
I want my progress automatically restored
So that I can continue where I left off
```

**Acceptance Criteria**:
- [ ] LocalStorage checked on form load
- [ ] Draft data auto-populated if found
- [ ] Current step restored
- [ ] User sees "Draft restored" notification
- [ ] Option to start fresh instead

**US-3: Resume from Different Device via Email Link**
```
As a teacher who saved a draft
When I click the email link on a different device
I want to verify my email with OTP and access my saved progress
So that I can complete the form from anywhere without creating an account
```

**Acceptance Criteria**:
- [ ] Email contains unique draft link with token
- [ ] Clicking link opens OTP verification page
- [ ] System sends 6-digit OTP to email
- [ ] User enters OTP to verify identity
- [ ] After verification, draft loads from database
- [ ] Draft data populated into form
- [ ] Works on mobile, tablet, desktop
- [ ] Link expires after 7 days
- [ ] OTP expires after 10 minutes

**US-4: Email with Draft Link**
```
As a teacher who saved a draft
I want to receive an email with a link
So that I can easily return to my draft later
```

**Acceptance Criteria**:
- [ ] Email sent immediately after save
- [ ] Contains draft token and direct link
- [ ] Shows submission type (register100/support)
- [ ] Includes expiry date (7 days)
- [ ] Professional email template

**US-5: Submit Draft to Create Submission**
```
As a teacher who completed the draft form
When I click "Submit"
I want the draft converted to official submission
So that my registration is processed and my school account is created
```

**Acceptance Criteria**:
- [ ] Validation runs before submission
- [ ] School ID generated ONLY on submit (not on draft save)
- [ ] User record created ONLY on submit (not on draft save)
- [ ] Submission record created
- [ ] Draft marked as submitted/deleted
- [ ] Success confirmation shown
- [ ] Teacher receives login credentials via email

### 2.2 Secondary User Stories

**US-6: Email Verification with OTP**
```
As a teacher accessing a draft from a different device
I want to verify my email with a one-time password
So that only I can access my draft without creating an account
```

**Acceptance Criteria**:
- [ ] System generates 6-digit OTP
- [ ] OTP sent to email immediately
- [ ] OTP valid for 10 minutes
- [ ] User can request new OTP if expired
- [ ] Max 3 OTP requests per hour per email
- [ ] After verification, draft loads automatically

**US-7: Conflict Resolution**
```
As a teacher with both LocalStorage and Database drafts
When the data differs between them
I want to choose which version to keep
So that I don't lose important changes
```

**Acceptance Criteria**:
- [ ] System detects timestamp differences
- [ ] Modal shows both versions
- [ ] User can choose which to keep
- [ ] Chosen version syncs to both storages

**US-7: Conflict Resolution**
```
As a teacher with both LocalStorage and Database drafts
When the data differs between them
I want to choose which version to keep
So that I don't lose important changes
```

**Acceptance Criteria**:
- [ ] System detects timestamp differences
- [ ] Modal shows both versions
- [ ] User can choose which to keep
- [ ] Chosen version syncs to both storages

**US-8: Draft Expiry Notification**
```
As a teacher with an expiring draft
I want to be notified before it expires
So that I can complete it in time
```

**Acceptance Criteria**:
- [ ] Email sent 1 day before expiry
- [ ] Shows remaining time
- [ ] Includes direct link to draft
- [ ] Option to extend expiry (optional)

**US-9: Admin Draft Visibility**
```
As an admin
I want to see statistics about drafts
So that I can understand user behavior
```

**Acceptance Criteria**:
- [ ] Dashboard shows draft count
- [ ] Shows drafts by type
- [ ] Shows average completion time
- [ ] Shows expiry/abandonment rate

---

## 3. Functional Requirements

### 3.1 Draft Creation

**FR-1: Auto-save to LocalStorage**
- System MUST auto-save form data to LocalStorage every 30 seconds
- Auto-save MUST be debounced to prevent excessive saves
- Auto-save MUST NOT trigger API calls
- Auto-save MUST include timestamp

**FR-2: Manual Save to Database**
- User MUST be able to manually save draft via button
- System MUST validate email format before saving
- System MUST generate unique draft token (UUID v4)
- System MUST create database record
- System MUST send email with draft link
- System MUST update LocalStorage with sync timestamp
- System MUST NOT create School ID (created only on final submit)
- System MUST NOT create user record (created only on final submit)

**FR-3: Draft Token Generation**
- Token MUST be UUID v4 format
- Token MUST be unique across all drafts
- Token MUST be cryptographically secure
- Token MUST be included in email link

### 3.2 Draft Retrieval

**FR-4: LocalStorage Priority**
- System MUST check LocalStorage first on form load
- System MUST compare LocalStorage timestamp with Database
- System MUST use newer version if conflict exists
- System MUST show conflict resolution UI if timestamps differ significantly

**FR-5: Database Retrieval via Token + OTP**
- System MUST accept draft token in URL parameter
- System MUST validate token exists and not expired
- System MUST generate 6-digit OTP
- System MUST send OTP to draft email
- System MUST validate OTP before loading draft
- OTP MUST expire after 10 minutes
- System MUST allow max 3 OTP requests per hour per email
- System MUST load draft data after successful OTP verification
- System MUST sync to LocalStorage after load

**FR-6: Cross-device Sync**
- System MUST support loading draft from any device
- System MUST maintain data consistency
- System MUST handle concurrent edits gracefully

### 3.3 Draft Submission

**FR-7: Convert Draft to Submission**
- System MUST validate all required fields
- System MUST generate School ID ONLY on submit (not on draft save)
- System MUST create user record with role='teacher' ONLY on submit
- System MUST create submission record (register100/register-support)
- System MUST delete or mark draft as submitted
- System MUST clear LocalStorage draft
- System MUST send login credentials email to teacher

**FR-8: Submission Validation**
- System MUST run same validation as direct submission
- System MUST check for duplicate school names
- System MUST validate all uploaded images
- System MUST ensure data integrity

### 3.4 Draft Management

**FR-9: Draft Expiry**
- Drafts MUST expire after 7 days
- System MUST use MongoDB TTL index for auto-deletion
- System MUST send reminder email 1 day before expiry
- Expired drafts MUST be automatically deleted

**FR-10: Draft Limits**
- One draft per email per submission type
- Creating new draft MUST replace existing draft
- System MUST prevent spam/abuse via rate limiting

**FR-11: OTP Management**
- System MUST generate cryptographically secure 6-digit OTP
- OTP MUST be stored with expiry timestamp (10 minutes)
- System MUST rate limit OTP requests (max 3 per hour per email)
- System MUST invalidate OTP after successful verification
- System MUST allow OTP regeneration if expired

---

## 4. Non-Functional Requirements

### 4.1 Performance

**NFR-1: Response Time**
- Auto-save to LocalStorage: < 50ms
- Manual save to Database: < 2 seconds
- Draft load from Database: < 1 second
- Form population: < 500ms

**NFR-2: Storage Limits**
- LocalStorage: Max 5MB per draft
- Database: No practical limit
- Images: Stored as base64 in draft

### 4.2 Security

**NFR-3: Data Protection**
- Draft tokens MUST be unguessable (UUID v4)
- Email addresses MUST be validated
- OTP MUST be cryptographically secure (6 digits)
- Rate limiting: Max 5 draft saves per hour per email
- Rate limiting: Max 3 OTP requests per hour per email
- No sensitive data in LocalStorage (passwords, etc.)
- OTP MUST NOT be logged or stored in plain text

**NFR-4: Access Control**
- Only token holder can access draft link
- Only email owner can verify OTP and access draft
- No authentication/login required for draft access
- Token expires after 7 days
- OTP expires after 10 minutes
- No School ID or user account created until final submit

### 4.3 Reliability

**NFR-5: Data Integrity**
- LocalStorage and Database MUST stay in sync
- Conflict resolution MUST preserve user data
- No data loss during save operations
- Atomic operations for draft submission

**NFR-6: Availability**
- Draft save MUST work offline (LocalStorage only)
- Email sending MUST be asynchronous
- Failed email MUST not block draft save

### 4.4 Usability

**NFR-7: User Experience**
- Save operation MUST provide clear feedback
- Draft restoration MUST be seamless
- Conflict resolution MUST be user-friendly
- Email MUST be clear and actionable

---

## 5. Data Requirements

### 5.1 Draft Data Structure

**LocalStorage Schema**:
```typescript
{
  draftToken: string | null,
  email: string,
  phone: string,
  submissionType: 'register100' | 'register-support',
  formData: {
    step1: { ... },
    step2: { ... },
    // ... all steps
  },
  currentStep: number,
  savedAt: number, // timestamp
  syncedAt: number | null, // last DB sync
}
```

**Database Schema**:
```typescript
{
  _id: ObjectId,
  draftToken: string, // UUID v4
  email: string,
  phone: string,
  submissionType: 'register100' | 'register-support',
  formData: object, // all form data
  currentStep: number,
  createdAt: Date,
  lastModified: Date,
  expiresAt: Date, // 7 days from creation
  ipAddress: string, // for rate limiting
  userAgent: string, // for analytics
  
  // OTP fields
  otp?: string, // hashed 6-digit code
  otpExpiresAt?: Date, // 10 minutes from generation
  otpAttempts?: number, // track failed attempts
  otpRequestCount?: number, // track OTP requests for rate limiting
  lastOtpRequestAt?: Date, // for rate limiting
}
```

### 5.2 Email Data

**Draft Email Template**:
- Subject: "บันทึกแบบฟอร์มสมัครของคุณ - [submission type]"
- Body includes:
  - Draft link with token
  - Submission type
  - Expiry date
  - Instructions to resume
  - Support contact

---

## 6. Integration Requirements

### 6.1 Existing System Integration

**INT-1: Form Components**
- Integrate with existing register100 form
- Integrate with existing register-support form
- Maintain current validation logic
- Preserve current step navigation

**INT-2: Email System**
- Use existing mailer.ts
- Add new draft email template
- Handle email failures gracefully

**INT-3: Database**
- Add new draft_submissions collection
- Use existing MongoDB connection
- Implement TTL index for expiry

### 6.2 API Endpoints

**Required APIs**:
- `POST /api/draft/save` - Save draft to database
- `GET /api/draft/:token` - Get draft metadata (without form data)
- `POST /api/draft/:token/request-otp` - Generate and send OTP
- `POST /api/draft/:token/verify-otp` - Verify OTP and return draft data
- `PUT /api/draft/:token` - Update existing draft
- `POST /api/draft/:token/submit` - Convert draft to submission
- `DELETE /api/draft/:token` - Delete draft

---

## 7. Constraints and Assumptions

### 7.1 Constraints
- Must work with existing form structure
- Must not break current submission flow
- Must support both register100 and register-support
- Must work on mobile browsers
- LocalStorage must be available (fallback to DB only if not)
- No login/authentication required for draft access
- School ID and user account created ONLY on final submit
- OTP must be secure and time-limited

### 7.2 Assumptions
- Teachers have valid email addresses
- Teachers can access email within 7 days
- Browsers support LocalStorage (>95% do)
- Network connection available for DB save
- MongoDB supports TTL indexes
- Email delivery is reliable for OTP
- Teachers understand OTP verification process
- ~20% of teachers will use save draft feature
- ~80% of teachers will complete form in one session

---

## 8. Success Criteria

### 8.1 Metrics

**Completion Rate**:
- Target: 80% of drafts converted to submissions
- Measure: (submitted drafts / total drafts) * 100

**User Satisfaction**:
- Target: <5% support tickets about lost data
- Measure: Support ticket volume

**Performance**:
- Target: 95% of saves complete within 2 seconds
- Measure: API response time monitoring

**Cross-device Usage**:
- Target: 30% of drafts accessed from multiple devices
- Measure: Device fingerprinting in analytics

### 8.2 Acceptance Criteria

Feature is considered complete when:
- [ ] All user stories pass acceptance criteria
- [ ] All functional requirements implemented
- [ ] All non-functional requirements met
- [ ] Integration tests pass
- [ ] User acceptance testing completed
- [ ] Documentation updated

---

## 9. Out of Scope

The following are explicitly OUT OF SCOPE for this feature:

- Multiple drafts per user (only 1 per email per type)
- Draft sharing between users
- Draft versioning/history
- Offline submission (requires network)
- Draft templates
- Admin draft editing
- Draft import/export

---

## 10. Risks and Mitigation

### 10.1 Design Decision: No Login Required

**Why No Login for Save Draft?**

The user raised important concerns about requiring login before saving draft:

1. **Session Timeout Risk**: If teacher clicks "Save Draft" → redirected to login → must request password → process takes too long → form session might expire → data lost
2. **Email Dependency**: If email sending fails during password request, teacher cannot login and cannot save draft
3. **Friction**: Save draft is optional (~20% usage). Adding login requirement creates unnecessary friction for a convenience feature
4. **Complexity**: Managing authentication state during form filling adds complexity

**Solution: Email + OTP Verification (No Login)**

Instead of requiring full authentication, we use a simpler approach:
- Teacher fills form → clicks "Save Draft" → enters email → receives draft link
- To access draft from different device → clicks link → receives OTP → verifies → accesses draft
- School ID and user account created ONLY on final submit (not on draft save)

**Benefits**:
- No session timeout issues (no session required)
- No authentication complexity during form filling
- Email failure doesn't block draft save (draft still saved to DB, token shown on screen)
- Simpler user experience for optional feature
- No zombie School IDs or user records from abandoned drafts

### 10.2 Risks

**Risk 1: LocalStorage Quota Exceeded**
- Impact: High
- Probability: Low
- Mitigation: Compress data, warn user, fallback to DB only

**Risk 2: Email Delivery Failure**
- Impact: High
- Probability: Medium
- Mitigation: Show draft token on screen, retry email, log failures, use reliable email service

**Risk 3: OTP Not Received**
- Impact: High
- Probability: Medium
- Mitigation: Allow OTP regeneration, show troubleshooting tips, check spam folder message

**Risk 4: Concurrent Edits**
- Impact: Medium
- Probability: Low
- Mitigation: Last-write-wins with conflict detection

**Risk 5: Draft Spam/Abuse**
- Impact: Medium
- Probability: Medium
- Mitigation: Rate limiting, email verification, CAPTCHA

**Risk 5: Draft Spam/Abuse**
- Impact: Medium
- Probability: Medium
- Mitigation: Rate limiting, email verification, CAPTCHA

**Risk 6: Data Migration Issues**
- Impact: High
- Probability: Low
- Mitigation: Thorough testing, rollback plan, gradual rollout

**Risk 7: OTP Brute Force**
- Impact: Medium
- Probability: Low
- Mitigation: Max 3 attempts, exponential backoff, account lockout after failures

---

## 11. Dependencies

### 11.1 Technical Dependencies
- MongoDB with TTL index support
- Email service (existing mailer.ts with Gmail SMTP)
- UUID library for token generation
- LocalStorage API (browser)
- Crypto library for OTP generation and hashing

### 11.2 Email Service Considerations

**Current Setup**: Gmail Personal Account via SMTP
- Limit: 500 emails/day
- Current usage: Password reset emails, certificate notifications
- Sufficient for: Pilot phase (<100 schools)

**For Production** (if >500 schools expected):
- **AWS SES**: $9/month for 10,000 emails
- **Resend**: $20/month for 50,000 emails
- **Google Workspace**: $6/user/month with higher limits

**Draft Feature Email Volume**:
- Assuming 20% use save draft
- 500 schools × 20% = 100 draft saves
- Each draft: 1 save email + potential OTP emails
- Estimated: 150-200 emails for draft feature
- Well within Gmail Personal limits for pilot

### 11.3 Team Dependencies
- Backend: API development
- Frontend: Form integration
- DevOps: Database index creation
- QA: Testing across devices

### 11.3 Team Dependencies
- Backend: API development (draft APIs, OTP generation/verification)
- Frontend: Form integration (save button, OTP verification UI)
- DevOps: Database index creation (TTL index)
- QA: Testing across devices (mobile, tablet, desktop)

---

## 12. Timeline Estimate

**Phase 1: Core Functionality** (5-7 days)
- Database schema and APIs
- LocalStorage integration
- Basic save/load functionality

**Phase 2: OTP Verification** (3-4 days)
- OTP generation and hashing
- Email sending with OTP
- OTP verification API
- OTP verification UI

**Phase 3: Email and Recovery** (2-3 days)
- Draft email template
- Token-based draft loading
- Expiry handling

**Phase 4: Conflict Resolution** (2-3 days)
- Timestamp comparison
- Conflict UI
- Sync logic

**Phase 5: Testing and Polish** (3-4 days)
- Integration testing
- Cross-device testing
- OTP flow testing
- Bug fixes and optimization

**Total Estimate**: 15-21 days

---

## 13. Appendix

### 13.1 Related Documents
- SITE-STRUCTURE-NEW.md
- AUTHENTICATION-SYSTEM-PHASE1.md
- Existing form components

### 13.2 Glossary
- **Draft**: Incomplete form submission saved for later
- **Draft Token**: Unique identifier for accessing draft (UUID v4)
- **OTP**: One-Time Password (6-digit code for email verification)
- **TTL**: Time To Live (auto-deletion mechanism)
- **Hybrid Approach**: Using both LocalStorage and Database
- **Rate Limiting**: Restricting number of requests per time period
- **Zombie Records**: Database records created but never used (avoided by creating School ID only on submit)

### 13.3 References
- MongoDB TTL Indexes: https://docs.mongodb.com/manual/core/index-ttl/
- LocalStorage API: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- UUID v4: https://www.rfc-editor.org/rfc/rfc4122
