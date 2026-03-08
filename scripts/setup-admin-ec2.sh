#!/bin/bash

# Setup Super Admin on EC2
# This script should be run on the EC2 server where the application is deployed

set -e  # Exit on any error

echo "🚀 Setting up Super Admin on EC2..."
echo "📅 $(date)"
echo "🖥️  Server: $(hostname)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root or with sudo
if [[ $EUID -eq 0 ]]; then
    print_warning "Running as root"
else
    print_status "Running as user: $(whoami)"
fi

# Check if Docker is running
if ! docker ps >/dev/null 2>&1; then
    print_error "Docker is not running or not accessible"
    exit 1
fi

print_success "Docker is running"

# Check if the application container exists
CONTAINER_NAME="thai-music-web"
if ! docker ps -a --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    print_error "Container '${CONTAINER_NAME}' not found"
    print_status "Available containers:"
    docker ps -a --format "table {{.Names}}\t{{.Status}}"
    exit 1
fi

print_success "Found container: ${CONTAINER_NAME}"

# Check container status
CONTAINER_STATUS=$(docker ps --format "table {{.Names}}\t{{.Status}}" | grep "${CONTAINER_NAME}" | awk '{print $2}' || echo "Stopped")
print_status "Container status: ${CONTAINER_STATUS}"

# Create admin user using the container
print_status "Creating super admin user..."

# Method 1: Run the script inside the container
docker exec -it ${CONTAINER_NAME} node scripts/create-super-admin.js

if [ $? -eq 0 ]; then
    print_success "Super admin created successfully!"
    
    echo ""
    echo "🔐 Login Information:"
    echo "  📧 Email: root@thaimusic.com"
    echo "  🔑 Password: admin123"
    echo "  🌐 Admin URL: http://$(curl -s ifconfig.me):3000/dcp-admin"
    echo "  🏠 Local URL: http://localhost:3000/dcp-admin"
    echo ""
    echo "⚠️  IMPORTANT: Change the default password after first login!"
    
else
    print_error "Failed to create super admin"
    
    print_status "Trying alternative method..."
    
    # Method 2: Direct MongoDB connection
    MONGO_CONTAINER="thai-music-mongo"
    if docker ps --format "table {{.Names}}" | grep -q "^${MONGO_CONTAINER}$"; then
        print_status "Using direct MongoDB connection..."
        
        # Create admin directly in MongoDB
        docker exec -i ${MONGO_CONTAINER} mongosh thai_music_school --eval "
        const bcrypt = require('bcryptjs');
        const hashedPassword = bcrypt.hashSync('admin123', 12);
        
        db.users.updateOne(
          { email: 'root@thaimusic.com' },
          {
            \$set: {
              email: 'root@thaimusic.com',
              password: hashedPassword,
              firstName: 'Super',
              lastName: 'Admin',
              role: 'admin',
              phone: '0800000000',
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          { upsert: true }
        );
        
        print('Super admin created/updated successfully');
        "
        
        if [ $? -eq 0 ]; then
            print_success "Super admin created via direct MongoDB connection!"
        else
            print_error "Both methods failed. Please check the logs."
            exit 1
        fi
    else
        print_error "MongoDB container not found"
        exit 1
    fi
fi

# Show final status
print_status "Checking application status..."
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(thai-music|NAMES)"

echo ""
print_success "Setup completed! 🎉"
print_warning "Remember to change the default password after first login!"