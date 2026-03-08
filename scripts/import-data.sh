#!/bin/bash

# Import data to production MongoDB
# Usage: ./import-data.sh <backup_directory> <production_mongo_uri>

if [ $# -ne 2 ]; then
    echo "Usage: $0 <backup_directory> <production_mongo_uri>"
    echo "Example: $0 backups/20241204_143000 mongodb://user:pass@prod-server:27017/thai_music_school"
    exit 1
fi

BACKUP_DIR=$1
MONGO_URI=$2

echo "🔄 Importing data to production MongoDB..."
echo "📂 Source: $BACKUP_DIR"
echo "🎯 Target: $MONGO_URI"

# Import all collections
mongorestore --uri="$MONGO_URI" --drop $BACKUP_DIR

echo "✅ Data import completed!"