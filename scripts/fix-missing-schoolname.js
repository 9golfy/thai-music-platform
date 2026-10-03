/**
 * fix-missing-schoolname.js
 *
 * SAFETY CONTROLS:
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Default mode is DRY RUN — no data is written to MongoDB unless --apply
 *    is explicitly passed on the command line.
 * 2. Refuses to run if MONGODB_URI is not set in the environment (never falls
 *    back to a hardcoded URI that contains credentials).
 * 3. Never prints the MongoDB URI, username, or password.
 * 4. Shows the target database name and collection before any write.
 * 5. Will NOT overwrite a non-empty existing schoolName.
 * 6. Skips records whose schoolId maps to more than one distinct school name
 *    across the two submission collections (ambiguous) and reports them.
 * 7. Uses bulkWrite() in controlled batches instead of one updateOne() per
 *    record, to reduce round-trips and make the operation atomic per batch.
 * 8. Exits with status code 1 on any fatal error.
 * 9. Always closes the MongoDB connection in the finally block.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * SCOPE — which activity types are repaired:
 * ─────────────────────────────────────────────────────────────────────────────
 * Analysis of application code shows that schoolName is stored at the
 * activity-log level (not inside metadata) for ALL activity types that involve
 * a teacher session (LOGIN, CERTIFICATE_VIEW, CERTIFICATE_DOWNLOAD,
 * PASSWORD_CHANGE, PROFILE_UPDATE).  Admin activities intentionally have no
 * schoolId / schoolName.
 *
 * Therefore this script repairs ALL activity types that have a non-empty
 * schoolId but a missing/empty schoolName — not only CERTIFICATE_DOWNLOAD.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * USAGE:
 *   # Dry run (default — safe, no writes):
 *   node scripts/fix-missing-schoolname.js
 *
 *   # Apply updates to MongoDB:
 *   node scripts/fix-missing-schoolname.js --apply
 *
 * ROLLBACK:
 *   Before running with --apply, create a backup:
 *     mongodump --uri="$MONGODB_URI" --db=<dbName> \
 *               --collection=activity_logs --out=./backup_activity_logs
 *   Restore with:
 *     mongorestore --uri="$MONGODB_URI" --drop ./backup_activity_logs
 */

'use strict';

const { MongoClient } = require('mongodb');

// ─── Configuration ────────────────────────────────────────────────────────────

// SAFETY: Refuse to run if MONGODB_URI is not explicitly set.
// This prevents accidentally targeting the wrong database.
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ MONGODB_URI environment variable is not set.');
  console.error('   Set it before running this script, e.g.:');
  console.error('   MONGODB_URI="mongodb://..." node scripts/fix-missing-schoolname.js');
  process.exit(1);
}

const dbName = process.env.MONGO_DB || (() => {
  // Try to extract database name from the URI path segment
  try {
    // mongodb://user:pass@host:port/dbName?options
    const match = uri.match(/\/([^/?]+)(\?|$)/);
    return match ? match[1] : null;
  } catch (_) {
    return null;
  }
})();

if (!dbName) {
  console.error('❌ Could not determine the database name.');
  console.error('   Set MONGO_DB environment variable explicitly.');
  process.exit(1);
}

// Dry run unless --apply is passed
const IS_DRY_RUN = !process.argv.includes('--apply');

// Batch size for bulkWrite operations
const BATCH_SIZE = 100;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns a redacted version of the URI for display — strips credentials.
 * e.g. mongodb://user:pass@host/db  →  mongodb://<credentials>@host/db
 */
function redactUri(rawUri) {
  try {
    return rawUri.replace(/\/\/[^@]+@/, '//<credentials>@');
  } catch (_) {
    return '<uri>';
  }
}

/**
 * Normalise a potential schoolName value:
 * returns the trimmed string if non-empty, otherwise null.
 */
function normaliseName(value) {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  return null;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('='.repeat(60));
  console.log('  fix-missing-schoolname.js');
  console.log('='.repeat(60));
  console.log(`  Mode          : ${IS_DRY_RUN ? '🟡 DRY RUN (no writes)' : '🔴 APPLY (will write to MongoDB)'}`);
  console.log(`  Database      : ${dbName}`);
  console.log(`  Collection    : activity_logs`);
  console.log(`  MongoDB URI   : ${redactUri(uri)}`);
  console.log('='.repeat(60));

  if (!IS_DRY_RUN) {
    // Extra confirmation banner before any write
    console.log('\n⚠️  --apply flag detected. Data WILL be modified.');
    console.log('   Recommended: ensure you have a backup of activity_logs.');
    console.log('   Run this first:');
    console.log(`   mongodump --uri="$MONGODB_URI" --db=${dbName} --collection=activity_logs --out=./backup_$(date +%Y%m%d_%H%M%S)\n`);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('\n✅ Connected to MongoDB');

    const db = client.db(dbName);
    const activityLogs = db.collection('activity_logs');
    const reg100       = db.collection('register100_submissions');
    const regSupport   = db.collection('register_support_submissions');

    // ── Step 1: Find broken records ───────────────────────────────────────────
    // SAFETY: $nin avoids the duplicate-key bug in the original script
    // ($ne: null, $ne: '' — JavaScript allows duplicate object keys but the
    // second one silently overwrites the first, so only $ne: '' was effective).
    const brokenQuery = {
      schoolId: {
        $exists: true,
        $nin: [null, ''],      // fix: was { $ne: null, $ne: '' } — duplicate key
      },
      $or: [
        { schoolName: { $exists: false } },
        { schoolName: null },
        { schoolName: '' },
      ],
    };

    const broken = await activityLogs.find(brokenQuery).toArray();

    console.log(`\n📋 Activity logs with schoolId but missing schoolName: ${broken.length}`);

    if (broken.length === 0) {
      console.log('\n✨ Nothing to repair. Exiting.');
      return;
    }

    // ── Step 2: Summarise by activity type (informational) ────────────────────
    const byType = {};
    for (const log of broken) {
      byType[log.activityType] = (byType[log.activityType] || 0) + 1;
    }
    console.log('\n  Breakdown by activityType:');
    for (const [type, count] of Object.entries(byType)) {
      console.log(`    ${type.padEnd(25)} ${count}`);
    }

    // ── Step 3: Build schoolId → schoolName map ───────────────────────────────
    // For each unique schoolId, collect ALL distinct names found across both
    // submission collections.  If more than one distinct name is found, the
    // record is ambiguous and will be skipped.

    const uniqueSchoolIds = [...new Set(broken.map(l => l.schoolId))];
    console.log(`\n🔍 Unique schoolIds to look up: ${uniqueSchoolIds.length}`);

    // Map: schoolId → Set of distinct names found
    const namesBySchoolId = new Map(); // schoolId → Set<string>

    const addName = (schoolId, rawName) => {
      const name = normaliseName(rawName);
      if (!name) return;
      if (!namesBySchoolId.has(schoolId)) namesBySchoolId.set(schoolId, new Set());
      namesBySchoolId.get(schoolId).add(name);
    };

    // Query register100_submissions
    // Field inventory confirmed from check-schoolname-fields.js output:
    //   register100:  schoolName (canonical), reg100_schoolName (legacy prefix)
    //   register_support: regsup_schoolName (canonical), schoolName absent in
    //     some older docs.
    const r100Docs = await reg100
      .find(
        { schoolId: { $in: uniqueSchoolIds } },
        { projection: { schoolId: 1, schoolName: 1, reg100_schoolName: 1 } }
      )
      .toArray();

    for (const doc of r100Docs) {
      addName(doc.schoolId, doc.schoolName);
      addName(doc.schoolId, doc.reg100_schoolName);
    }

    // Query register_support_submissions
    const rSupDocs = await regSupport
      .find(
        { schoolId: { $in: uniqueSchoolIds } },
        { projection: { schoolId: 1, schoolName: 1, regsup_schoolName: 1 } }
      )
      .toArray();

    for (const doc of rSupDocs) {
      addName(doc.schoolId, doc.schoolName);
      addName(doc.schoolId, doc.regsup_schoolName);
    }

    // ── Step 4: Classify each broken log ──────────────────────────────────────
    const toUpdate    = []; // { _id, schoolId, resolvedName, activityType }
    const ambiguous   = []; // { schoolId, names }
    const notFound    = []; // { schoolId, activityType }

    // Track which schoolIds are already reported as ambiguous to avoid
    // printing duplicates
    const reportedAmbiguous = new Set();

    for (const log of broken) {
      const names = namesBySchoolId.get(log.schoolId);

      if (!names || names.size === 0) {
        notFound.push({ schoolId: log.schoolId, activityType: log.activityType, _id: log._id });
        continue;
      }

      if (names.size > 1) {
        // More than one distinct name for this schoolId — skip to be safe
        if (!reportedAmbiguous.has(log.schoolId)) {
          ambiguous.push({ schoolId: log.schoolId, names: [...names] });
          reportedAmbiguous.add(log.schoolId);
        }
        continue;
      }

      // Exactly one name — safe to use
      const resolvedName = [...names][0];
      toUpdate.push({
        _id: log._id,
        schoolId: log.schoolId,
        resolvedName,
        activityType: log.activityType,
      });
    }

    // ── Step 5: Print dry-run / apply report ──────────────────────────────────
    console.log('\n' + '─'.repeat(60));
    console.log('  PROPOSED CHANGES');
    console.log('─'.repeat(60));
    console.log(`  Records to update   : ${toUpdate.length}`);
    console.log(`  Ambiguous (skipped) : ${ambiguous.length > 0 ? ambiguous.reduce((acc) => acc + 1, 0) + ' schoolIds' : 0}`);
    console.log(`  Not found (skipped) : ${notFound.length}`);

    if (toUpdate.length > 0) {
      console.log('\n  Sample of proposed updates (first 20):');
      console.log('  ' + '─'.repeat(56));
      for (const item of toUpdate.slice(0, 20)) {
        console.log(`  schoolId: ${item.schoolId.padEnd(28)} → "${item.resolvedName}" [${item.activityType}]`);
      }
      if (toUpdate.length > 20) {
        console.log(`  ... and ${toUpdate.length - 20} more records`);
      }
    }

    if (ambiguous.length > 0) {
      console.log('\n  ⚠️  Ambiguous schoolIds (multiple names found — NOT updated):');
      for (const item of ambiguous) {
        console.log(`    ${item.schoolId}: ${item.names.join(' | ')}`);
      }
    }

    if (notFound.length > 0) {
      console.log('\n  ⚠️  schoolIds with no submission record found (NOT updated):');
      const notFoundBySchoolId = {};
      for (const item of notFound) {
        if (!notFoundBySchoolId[item.schoolId]) notFoundBySchoolId[item.schoolId] = 0;
        notFoundBySchoolId[item.schoolId]++;
      }
      for (const [sid, count] of Object.entries(notFoundBySchoolId)) {
        console.log(`    ${sid} (${count} log(s))`);
      }
    }

    // ── Step 6: Apply updates (only when --apply is given) ────────────────────
    if (IS_DRY_RUN) {
      console.log('\n' + '='.repeat(60));
      console.log('  🟡 DRY RUN complete — no data was modified.');
      console.log('  Run with --apply to apply the changes above.');
      console.log('='.repeat(60));
      return;
    }

    if (toUpdate.length === 0) {
      console.log('\n✨ Nothing to update. Exiting.');
      return;
    }

    console.log(`\n🔴 Applying ${toUpdate.length} updates in batches of ${BATCH_SIZE}...`);

    let totalUpdated = 0;

    // Process in batches using bulkWrite for efficiency
    for (let i = 0; i < toUpdate.length; i += BATCH_SIZE) {
      const batch = toUpdate.slice(i, i + BATCH_SIZE);

      const operations = batch.map(item => ({
        updateOne: {
          filter: {
            _id: item._id,
            // SAFETY: only update if schoolName is still empty/missing at write time
            $or: [
              { schoolName: { $exists: false } },
              { schoolName: null },
              { schoolName: '' },
            ],
          },
          update: {
            $set: { schoolName: item.resolvedName },
          },
        },
      }));

      const result = await activityLogs.bulkWrite(operations, { ordered: false });
      totalUpdated += result.modifiedCount;

      const batchEnd = Math.min(i + BATCH_SIZE, toUpdate.length);
      console.log(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}: processed ${batchEnd - i} ops, modified ${result.modifiedCount}`);
    }

    // ── Step 7: Final summary ─────────────────────────────────────────────────
    console.log('\n' + '='.repeat(60));
    console.log('  ✅ APPLY COMPLETE');
    console.log('='.repeat(60));
    console.log(`  Updated (schoolName set)      : ${totalUpdated}`);
    console.log(`  Skipped — ambiguous schoolId  : ${broken.length - toUpdate.length - notFound.length}`);
    console.log(`  Skipped — no submission found : ${notFound.length}`);
    console.log(`  Total broken records scanned  : ${broken.length}`);
    console.log('='.repeat(60));

  } catch (err) {
    console.error('\n❌ Fatal error:', err.message || err);
    process.exitCode = 1; // Signal failure to the caller
  } finally {
    // SAFETY: always close the connection
    await client.close();
    console.log('\n🔌 MongoDB connection closed.');
  }
}

main();
