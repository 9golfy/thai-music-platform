# Database Design Update Summary

**Date**: July 27, 2026  
**Commit**: `cabca94` — Add detailed score columns to Excel export

---

## Updates Made to DATABASE-DESIGN.md

### 1. Document Header Updates ✅

- Added **Last Updated**: July 27, 2026
- Added **Latest Commit**: `cabca94` with description
- Updated to reflect current state of the system

### 2. Register100 Collection Updates ✅

#### Score Fields Section Enhanced
- Added **Part 2 Scores** subsection
- Added `video1_score` field (Number, Max: 50) — manual admin entry
- Added `video2_score` field (Number, Max: 50) — manual admin entry
- Clarified total_score calculation: Part 1 (100) + Part 2 (100) = 200
- Added breakdown explanation for score calculation

#### New Admin Fields Section
- Added `adminNotes` field (String, optional)
- Documented as added in June 2026
- Purpose: Admin can add notes about school registration

### 3. Register-Support Collection Updates ✅

#### Score Fields Section Enhanced
- Added **Part 2 Scores** subsection
- Added `video1_score` field (Number, Max: 40) — manual admin entry
- Added `video2_score` field (Number, Max: 40) — manual admin entry
- Clarified total_score calculation: Part 1 (100) + Part 2 (80) = 180
- Added breakdown explanation for score calculation

#### New Admin Fields Section
- Added `adminNotes` field (String, optional)
- Documented as added in June 2026

#### Score Preservation Logic Section
- Documented commit `fd447a8` (June 2026)
- Explained Manual Edit Mode vs Normal Edit Mode
- Added API usage examples:
  - Manual Edit: `PUT /api/register-support/[id]?manualEdit=true`
  - Normal Edit: `PUT /api/register-support/[id]`
- Documented score preservation behavior

### 4. Export Features Section (NEW) ✅

Complete new section added with:

#### Overview
- Implementation location: `components/admin/SchoolsDataTable.tsx`
- Client-side generation (not using API routes)
- Commit reference and date

#### Export Locations
- Table showing dashboard URLs for both registration types
- Export function names

#### File Format
- Naming convention for both types
- UTF-8 with BOM encoding for Thai character support

#### Export Columns Structure
- Complete 23-column layout for Register100
- Complete 23-column layout for Register-Support
- Visual representation of column order

#### Database Field → CSV Column Mapping
- **Register100**: 14 mappings (9 Part 1 + 2 Part 2 + 3 calculated fields)
- **Register-Support**: 14 mappings (9 Part 1 + 2 Part 2 + 3 calculated fields)
- Each mapping shows database field, CSV column name, and max score

#### Technical Implementation
- Score calculation code examples (TypeScript)
- CSV generation with UTF-8 BOM handling
- Special character escaping logic

#### Export Features Details
- Filter support (search, province, level, grade)
- Real-time calculation of subtotals
- Zero handling for missing scores
- Thai date format
- Grade display in Thai

#### Performance Notes
- Client-side performance benefits
- Can handle thousands of records
- API routes not used for export

---

## Key Technical Details

### Score Calculation Logic

```typescript
// Register100 Part 1: 100 points
teaching_curriculum_score (20)
+ teacher_qualification_score (20)
+ support_from_org_score (5)
+ support_from_external_score (15)
+ award_score (20)
+ activity_within_province_internal_score (5)
+ activity_within_province_external_score (5)
+ activity_outside_province_score (5)
+ pr_activity_score (5)
= 100 points

// Part 2: 100 points (Register100) / 80 points (Register-Support)
video1_score + video2_score

// Total
Part 1 + Part 2 = 200 (Register100) / 180 (Register-Support)
```

### Export Column Structure

**Register100**: 23 columns
- 9 metadata columns (ลำดับ, วันที่, ชื่อ, จังหวัด, etc.)
- 9 Part 1 score columns (individual step scores)
- 1 Part 1 subtotal column
- 2 Part 2 score columns (video scores)
- 1 Part 2 subtotal column
- 1 total score column

**Register-Support**: 23 columns (same structure, different score values)

---

## Files Modified

- ✅ `DATABASE-DESIGN.md` — Complete database design documentation
- ✅ `DATA-DICTIONARY-LATEST.md` — Already updated in previous task

---

## Related Commits

- `cabca94` — Add detailed score columns to Excel export (July 27, 2026)
- `fd447a8` — Score preservation logic for Register-Support (June 2026)

---

## Next Steps

### Production Deployment Status
- ✅ Code committed to GitHub (cabca94)
- ✅ Production build completed
- ⚠️ **Need to pull code on production server**

### Required Production Update Command
```bash
cd /var/www/thai-music-platform && \
git pull origin master && \
npm install && \
npm run build && \
pm2 restart thai-music-platform
```

**Note**: User confirmed that production server still shows old export format.
The `npm run build` was completed but `git pull` was not executed yet.

---

## Documentation Status

| Document | Status | Last Updated |
|----------|--------|--------------|
| DATABASE-DESIGN.md | ✅ Updated | July 27, 2026 |
| DATA-DICTIONARY-LATEST.md | ✅ Updated | July 27, 2026 |
| EXPORT-SCORE-DETAIL-UPDATE.md | ✅ Exists | July 27, 2026 |
| DATABASE-DESIGN-UPDATE.md | ✅ Created | July 27, 2026 |

All database documentation is now synchronized with the latest codebase! 🎉
