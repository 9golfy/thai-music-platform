#!/usr/bin/env node

/**
 * Create Super Admin Script
 * 
 * This script creates a super admin user in the production database
 * Usage: node scripts/create-super-admin.js
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Configuration
const ADMIN_DATA = {
  email: 'root@thaimusic.com',
  password: 'admin123',
  firstName: 'Super',
  lastName: 'Admin',
  role: 'admin',
  phone: '0800000000'
};

async function createSuperAdmin() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.error('❌ MONGODB_URI environment variable is required');
    process.exit(1);
  }

  console.log('🔄 Connecting to MongoDB...');
  console.log('📧 Email:', ADMIN_DATA.email);
  
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const usersCollection = db.collection('users');

    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({
      email: ADMIN_DATA.email.toLowerCase()
    });

    if (existingAdmin) {
      console.log('⚠️  Super admin already exists');
      console.log('🔄 Updating existing admin...');
      
      // Update existing admin
      const hashedPassword = await bcrypt.hash(ADMIN_DATA.password, 12);
      
      const updateResult = await usersCollection.updateOne(
        { email: ADMIN_DATA.email.toLowerCase() },
        {
          $set: {
            password: hashedPassword,
            firstName: ADMIN_DATA.firstName,
            lastName: ADMIN_DATA.lastName,
            role: ADMIN_DATA.role,
            phone: ADMIN_DATA.phone,
            isActive: true,
            updatedAt: new Date()
          }
        }
      );

      if (updateResult.modifiedCount > 0) {
        console.log('✅ Super admin updated successfully');
      } else {
        console.log('⚠️  No changes made to existing admin');
      }
    } else {
      console.log('🔄 Creating new super admin...');
      
      // Create new admin
      const hashedPassword = await bcrypt.hash(ADMIN_DATA.password, 12);
      
      const newAdmin = {
        email: ADMIN_DATA.email.toLowerCase(),
        password: hashedPassword,
        firstName: ADMIN_DATA.firstName,
        lastName: ADMIN_DATA.lastName,
        role: ADMIN_DATA.role,
        phone: ADMIN_DATA.phone,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const insertResult = await usersCollection.insertOne(newAdmin);
      
      if (insertResult.insertedId) {
        console.log('✅ Super admin created successfully');
        console.log('🆔 User ID:', insertResult.insertedId);
      } else {
        throw new Error('Failed to create admin user');
      }
    }

    // Verify admin creation
    const admin = await usersCollection.findOne({
      email: ADMIN_DATA.email.toLowerCase()
    });

    console.log('\n📋 Admin Account Details:');
    console.log('  📧 Email:', admin.email);
    console.log('  👤 Name:', `${admin.firstName} ${admin.lastName}`);
    console.log('  🔑 Role:', admin.role);
    console.log('  📱 Phone:', admin.phone);
    console.log('  ✅ Active:', admin.isActive);
    console.log('  📅 Created:', admin.createdAt);
    
    console.log('\n🔐 Login Credentials:');
    console.log('  📧 Email:', ADMIN_DATA.email);
    console.log('  🔑 Password:', ADMIN_DATA.password);
    console.log('  🌐 Login URL: /dcp-admin');

  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the script
if (require.main === module) {
  createSuperAdmin()
    .then(() => {
      console.log('\n🎉 Super admin setup completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createSuperAdmin };