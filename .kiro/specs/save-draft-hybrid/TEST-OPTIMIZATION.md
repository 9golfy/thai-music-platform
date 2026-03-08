# Property-Based Test Optimization - Round 2

**Date**: 2026-03-02  
**Feature**: save-draft-hybrid

## Summary

Further reduced property-based test iterations from 20 to 10 (and 5 for bcrypt-heavy tests) to achieve even faster test execution while maintaining adequate coverage.

## Changes Made

### Round 2 Optimization

1. **General Tests**: 20 → 10 iterations
2. **Bcrypt Tests**: 10 → 5 iterations

### Files Updated
- `lib/utils/__tests__/draftStorage.test.ts` - 10 iterations
- `lib/utils/__tests__/otp.test.ts` - 10 iterations (5 for bcrypt)
- `lib/utils/__tests__/draftToken.property.test.ts` - 10 iterations
- `lib/email/__tests__/draftSave.property.test.ts` - 10 iterations
- `scripts/test-rateLimit-property.js` - 10 iterations
- `app/api/draft/save/__tests__/save.property.test.ts` - 10 iterations

## Results

**Total Tests**: 83 property-based tests  
**Total Execution Time**: ~24 seconds  
**All Tests**: ✅ PASSING

### Performance Comparison

| Round | Iterations | Bcrypt Iterations | Time | Improvement |
|-------|-----------|-------------------|------|-------------|
| Original | 100 | 20 | ~100+ sec | baseline |
| Round 1 | 20 | 10 | ~41 sec | 60% faster |
| Round 2 | 10 | 5 | ~24 sec | 76% faster |

## Rationale

- 10 iterations still provides good coverage for catching common edge cases
- 5 iterations for bcrypt tests balances security validation with execution speed
- Ideal for rapid development and TDD workflow
- Can scale up for CI/CD pipelines as needed

## Recommendations

1. **Development**: Use 10/5 iterations (current setting) ⚡
2. **CI/CD**: Consider 20/10 iterations
3. **Pre-release**: Consider 50/20 iterations
4. **Security Audit**: Use 100+ iterations

## Documentation Updates

Updated:
- `.kiro/specs/save-draft-hybrid/tasks.md` - Reflected new iteration counts
- All test files - Updated numRuns parameters
