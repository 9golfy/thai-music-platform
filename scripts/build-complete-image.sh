#!/bin/bash

# Build Complete Thai Music Platform Image
# This script creates a self-contained Docker image with app + database + data

set -e

echo "🚀 Building Complete Thai Music Platform Image..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if backup data exists
if [ ! -d "backups/local/thai_music_school" ]; then
    print_warning "No backup data found. Creating sample data..."
    mkdir -p backups/local/thai_music_school
    
    # Create sample admin user
    cat > backups/local/thai_music_school/users.json << 'EOF'
[
  {
    "_id": {"$oid": "69a23d2830fdcf8850c8a7dd"},
    "email": "root@thaimusic.com",
    "password": "$2b$12$9etD.qC1vZ1sK3K.LRiUTuYbT6rZIl/XK74quATTCLdPaD95B7YIa",
    "firstName": "Super",
    "lastName": "Admin",
    "role": "admin",
    "phone": "0800000000",
    "isActive": true,
    "createdAt": {"$date": "2024-03-05T00:00:00.000Z"},
    "updatedAt": {"$date": "2024-03-05T00:00:00.000Z"}
  }
]
EOF
    
    print_success "Sample admin user created (root@thaimusic.com / admin123)"
fi

# Build the complete image
print_status "Building Docker image..."
docker-compose -f docker-compose.complete.yml build --no-cache

# Create a single deployable image
print_status "Creating deployable image..."
docker tag thai-music-platform-complete:latest thai-music-platform:complete

print_success "Complete image built successfully!"

echo ""
echo "🎉 Thai Music Platform Complete Image Ready!"
echo ""
echo "📋 To deploy:"
echo "  docker-compose -f docker-compose.complete.yml up -d"
echo ""
echo "🔐 Default Admin Login:"
echo "  URL: http://localhost:3000/dcp-admin"
echo "  Email: root@thaimusic.com"
echo "  Password: admin123"
echo ""
echo "🗄️ Database Admin:"
echo "  URL: http://localhost:8081"
echo ""
echo "📦 To export image:"
echo "  docker save thai-music-platform:complete | gzip > thai-music-complete.tar.gz"
echo ""
echo "📥 To import on another server:"
echo "  gunzip -c thai-music-complete.tar.gz | docker load"
echo "  docker-compose -f docker-compose.complete.yml up -d"