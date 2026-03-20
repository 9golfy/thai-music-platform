#!/usr/bin/env node

/**
 * Restart AWS Production Server
 * 
 * This script restarts the production Docker containers on AWS EC2
 */

const { execSync } = require('child_process');

console.log('🚀 Restarting AWS Production Server...\n');

const AWS_HOST = '18.138.63.84';
const SSH_KEY = process.env.AWS_SSH_KEY || '~/.ssh/thai-music-aws.pem';
const SSH_USER = process.env.AWS_SSH_USER || 'ubuntu';

const commands = [
  'cd /home/ubuntu/thai-music-platform',
  'docker restart thai-music-web-prod',
  'sleep 5',
  'docker ps | grep thai-music',
  'echo "✅ Production server restarted successfully"'
];

const sshCommand = `ssh -i ${SSH_KEY} ${SSH_USER}@${AWS_HOST} "${commands.join(' && ')}"`;

console.log('📡 Connecting to AWS EC2...');
console.log(`Host: ${AWS_HOST}`);
console.log(`User: ${SSH_USER}\n`);

try {
  const output = execSync(sshCommand, { 
    encoding: 'utf8',
    stdio: 'inherit'
  });
  
  console.log('\n✅ Server restart completed!');
  console.log('\n🔍 Test the server:');
  console.log(`   http://${AWS_HOST}:3000/regist100`);
  
} catch (error) {
  console.error('\n❌ Error restarting server:', error.message);
  console.log('\n💡 Manual restart commands:');
  console.log(`   ssh -i ${SSH_KEY} ${SSH_USER}@${AWS_HOST}`);
  console.log('   cd /home/ubuntu/thai-music-platform');
  console.log('   docker restart thai-music-web-prod');
  console.log('   docker ps');
  process.exit(1);
}
