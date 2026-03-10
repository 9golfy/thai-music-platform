#!/usr/bin/env node

/**
 * Dockerfile.prod Verification Script
 * 
 * This script verifies that Dockerfile.prod has the correct content
 * and doesn't contain problematic shell redirection syntax.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Dockerfile.prod Verification');
console.log('===============================');

const dockerfilePath = path.join(process.cwd(), 'Dockerfile.prod');

if (!fs.existsSync(dockerfilePath)) {
    console.log('❌ ERROR: Dockerfile.prod not found!');
    process.exit(1);
}

const content = fs.readFileSync(dockerfilePath, 'utf8');
const lines = content.split('\n');

console.log('\n📄 Current Dockerfile.prod content:');
console.log('-----------------------------------');
lines.forEach((line, index) => {
    console.log(`${(index + 1).toString().padStart(2, ' ')}: ${line}`);
});

console.log('\n🔍 Checking for problematic patterns...');

// Check for problematic shell redirection
const problematicPatterns = [
    '2>/dev/null || true',
    '/app/app',
    'COPY --from=builder /app/app'
];

let hasProblems = false;

problematicPatterns.forEach(pattern => {
    if (content.includes(pattern)) {
        console.log(`❌ FOUND PROBLEMATIC PATTERN: "${pattern}"`);
        hasProblems = true;
    } else {
        console.log(`✅ Pattern not found: "${pattern}"`);
    }
});

console.log('\n📊 Summary:');
if (hasProblems) {
    console.log('❌ Dockerfile.prod contains problematic patterns!');
    console.log('   This will cause Docker build failures in production.');
    process.exit(1);
} else {
    console.log('✅ Dockerfile.prod looks clean!');
    console.log('   No problematic shell redirection patterns found.');
}

console.log('\n🎯 Expected behavior:');
console.log('- Docker build should complete without shell redirection errors');
console.log('- Production deployment should succeed');
console.log('- Application should start correctly');

console.log('\n✨ Dockerfile.prod verification completed!');