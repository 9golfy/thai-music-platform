#!/bin/bash

# Export data from local MongoDB
echo "🔄 Exporting data from local MongoDB..."

# Create backup directory
mkdir -p backups/$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"

# Export all collections
mongodump --host localhost:27017 --db thai_music_school --out $BACKUP_DIR

echo "✅ Data exported to: $BACKUP_DIR"
echo "📁 Files created:"
ls -la $BACKUP_DIR/thai_music_school/

# Optional: Create compressed archive
tar -czf $BACKUP_DIR.tar.gz $BACKUP_DIR
echo "📦 Compressed archive: $BACKUP_DIR.tar.gz"