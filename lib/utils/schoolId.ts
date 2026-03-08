/**
 * Generate School ID in format: SCH-YYYYMMDD-XXXX
 * Example: SCH-20260228-0001
 * 
 * IMPORTANT: School IDs are GLOBALLY UNIQUE across all collections
 * The sequence number is continuous and never resets, even if records are deleted
 */
export function generateSchoolId(sequenceNumber: number): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const sequence = String(sequenceNumber).padStart(4, '0');
  
  return `SCH-${year}${month}${day}-${sequence}`;
}

/**
 * Get the next GLOBAL sequence number across ALL collections
 * This ensures school IDs are unique system-wide and never reused
 */
export async function getNextSchoolIdSequence(database: any): Promise<number> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const datePrefix = `SCH-${year}${month}${day}`;
  
  // Check BOTH collections to find the highest sequence number globally
  const register100Collection = database.collection('register100_submissions');
  const registerSupportCollection = database.collection('register_support_submissions');
  
  const [lastRegister100, lastRegisterSupport] = await Promise.all([
    register100Collection
      .find({ schoolId: { $regex: `^${datePrefix}` } })
      .sort({ schoolId: -1 })
      .limit(1)
      .toArray(),
    registerSupportCollection
      .find({ schoolId: { $regex: `^${datePrefix}` } })
      .sort({ schoolId: -1 })
      .limit(1)
      .toArray()
  ]);
  
  let maxSequence = 0;
  
  // Check register100
  if (lastRegister100.length > 0) {
    const lastId = lastRegister100[0].schoolId;
    const sequence = parseInt(lastId.split('-')[2]);
    if (sequence > maxSequence) maxSequence = sequence;
  }
  
  // Check register-support
  if (lastRegisterSupport.length > 0) {
    const lastId = lastRegisterSupport[0].schoolId;
    const sequence = parseInt(lastId.split('-')[2]);
    if (sequence > maxSequence) maxSequence = sequence;
  }
  
  // Also check across ALL dates to ensure we never reuse a sequence number
  const [allRegister100, allRegisterSupport] = await Promise.all([
    register100Collection
      .find({ schoolId: { $regex: `^SCH-` } })
      .sort({ schoolId: -1 })
      .limit(1)
      .toArray(),
    registerSupportCollection
      .find({ schoolId: { $regex: `^SCH-` } })
      .sort({ schoolId: -1 })
      .limit(1)
      .toArray()
  ]);
  
  // Check all register100
  if (allRegister100.length > 0) {
    const lastId = allRegister100[0].schoolId;
    const sequence = parseInt(lastId.split('-')[2]);
    if (sequence > maxSequence) maxSequence = sequence;
  }
  
  // Check all register-support
  if (allRegisterSupport.length > 0) {
    const lastId = allRegisterSupport[0].schoolId;
    const sequence = parseInt(lastId.split('-')[2]);
    if (sequence > maxSequence) maxSequence = sequence;
  }
  
  return maxSequence + 1;
}
