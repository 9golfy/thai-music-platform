#!/bin/bash

echo "🚀 Testing Docker Build Process"

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please copy .env.example to .env and configure it."
    exit 1
fi

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t thai-music-platform:test .

if [ $? -eq 0 ]; then
    echo "✅ Docker build successful!"
    
    # Test with docker-compose
    echo "🧪 Testing with docker-compose..."
    docker-compose -f docker-compose.local.yml up -d
    
    echo "⏳ Waiting for services to start..."
    sleep 10
    
    # Check if services are running
    docker-compose -f docker-compose.local.yml ps
    
    echo "🌐 Application should be available at http://localhost:3000"
    echo "📊 MongoDB should be available at localhost:27017"
    
    echo "To stop services: docker-compose -f docker-compose.local.yml down"
else
    echo "❌ Docker build failed!"
    exit 1
fi