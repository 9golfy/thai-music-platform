#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

function runScript(scriptName, description) {
  console.log(`\n🚀 ${description}...`);
  console.log(`📄 Running: ${scriptName}\n`);
  
  try {
    const scriptPath = path.join(__dirname, scriptName);
    execSync(`node "${scriptPath}"`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`❌ Error running ${scriptName}:`, error.message);
  }
}

function showMenu() {
  console.log('\n🔧 System Admin Management Menu');
  console.log('================================');
  console.log('1. Create/Update System Admin');
  console.log('2. Check System Admin Status');
  console.log('3. Test System Admin Protection');
  console.log('4. Test System Admin Login');
  console.log('5. Clear Test Data (Protect System Admin)');
  console.log('6. Verify Clean State');
  console.log('7. Run All Tests');
  console.log('0. Exit');
  console.log('================================');
}

function handleChoice(choice) {
  switch (choice) {
    case '1':
      runScript('create-system-admin.js', 'Creating/Updating System Admin');
      break;
    case '2':
      runScript('check-system-admin.js', 'Checking System Admin Status');
      break;
    case '3':
      runScript('test-system-admin-protection.js', 'Testing System Admin Protection');
      break;
    case '4':
      runScript('test-system-admin-login.js', 'Testing System Admin Login');
      break;
    case '5':
      runScript('clear-test-data.js', 'Clearing Test Data (System Admin Protected)');
      break;
    case '6':
      runScript('verify-clean-state.js', 'Verifying Clean State');
      break;
    case '7':
      console.log('\n🧪 Running All Tests...');
      runScript('create-system-admin.js', 'Creating/Updating System Admin');
      runScript('check-system-admin.js', 'Checking System Admin Status');
      runScript('test-system-admin-protection.js', 'Testing System Admin Protection');
      runScript('test-system-admin-login.js', 'Testing System Admin Login');
      console.log('\n🎉 All tests completed!');
      break;
    case '0':
      console.log('\n👋 Goodbye!');
      process.exit(0);
      break;
    default:
      console.log('\n❌ Invalid choice. Please try again.');
  }
}

// Main execution
console.log('🔐 System Admin Management Tool');
console.log('===============================');
console.log('System Admin Credentials:');
console.log('Email: root@thaimusic.com');
console.log('Password: P@sswordAdmin123');

// Check if running with arguments
const args = process.argv.slice(2);

if (args.length > 0) {
  const command = args[0];
  
  switch (command) {
    case 'create':
      runScript('create-system-admin.js', 'Creating/Updating System Admin');
      break;
    case 'check':
      runScript('check-system-admin.js', 'Checking System Admin Status');
      break;
    case 'protect':
      runScript('test-system-admin-protection.js', 'Testing System Admin Protection');
      break;
    case 'login':
      runScript('test-system-admin-login.js', 'Testing System Admin Login');
      break;
    case 'clear':
      runScript('clear-test-data.js', 'Clearing Test Data (System Admin Protected)');
      break;
    case 'verify':
      runScript('verify-clean-state.js', 'Verifying Clean State');
      break;
    case 'test':
      console.log('\n🧪 Running All Tests...');
      runScript('create-system-admin.js', 'Creating/Updating System Admin');
      runScript('check-system-admin.js', 'Checking System Admin Status');
      runScript('test-system-admin-protection.js', 'Testing System Admin Protection');
      runScript('test-system-admin-login.js', 'Testing System Admin Login');
      console.log('\n🎉 All tests completed!');
      break;
    default:
      console.log(`\n❌ Unknown command: ${command}`);
      console.log('\nAvailable commands:');
      console.log('  create  - Create/Update System Admin');
      console.log('  check   - Check System Admin Status');
      console.log('  protect - Test System Admin Protection');
      console.log('  login   - Test System Admin Login');
      console.log('  clear   - Clear Test Data (Protected)');
      console.log('  verify  - Verify Clean State');
      console.log('  test    - Run All Tests');
      console.log('\nExample: node scripts/manage-system-admin.js create');
  }
} else {
  // Interactive mode
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function askForChoice() {
    showMenu();
    rl.question('\nEnter your choice (0-7): ', (choice) => {
      handleChoice(choice.trim());
      
      if (choice.trim() !== '0') {
        setTimeout(askForChoice, 1000); // Wait 1 second before showing menu again
      } else {
        rl.close();
      }
    });
  }

  askForChoice();
}