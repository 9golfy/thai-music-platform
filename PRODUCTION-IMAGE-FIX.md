# Production Image Fix Guide

## Problem
Images are not displaying on the production server (http://18.138.63.84:3000). The issue occurs because Next.js standalone builds don't properly serve static files from the `public` directory in Docker containers.

## Root Cause
1. **Next.js Standalone Build**: The `output: 'standalone'` configuration creates a self-contained build that doesn't include the public folder by default
2. **Docker Configuration**: The original Dockerfile wasn't properly copying the standalone build structure
3. **Static File Serving**: Uploaded images in `public/uploads/` weren't being served correctly

## Solution Applied

### 1. Fixed Dockerfile.prod
Updated the Dockerfile to properly handle Next.js standalone builds:

```dockerfile
# Copy build artifacts (FIXED)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Create uploads directory with proper permissions
RUN mkdir -p public/uploads && chown -R nextjs:nodejs public

# Use the standalone server (FIXED)
CMD ["node","server.js"]
```

### 2. Updated docker-compose.prod.yml
Added persistent volume for uploaded images:

```yaml
volumes:
  - uploads_data:/app/public/uploads
```

This ensures uploaded images persist across container restarts.

## Deployment Steps

### Step 1: Apply the Fix
Run the automated fix script:
```bash
node scripts/fix-production-images.js
```

### Step 2: Manual Deployment (Alternative)
If you prefer manual steps:

```bash
# Stop existing containers
docker-compose -f docker-compose.prod.yml down

# Remove old images to force rebuild
docker image rm thai-music-web-prod_web 2>/dev/null || true

# Build and start new containers
docker-compose -f docker-compose.prod.yml up -d --build

# Copy existing uploads to the new volume (if any)
docker cp public/uploads/. thai-music-web-prod:/app/public/uploads/
```

### Step 3: Verify the Fix
Test image serving:
```bash
node scripts/test-production-images.js
```

Or manually test by visiting:
- http://18.138.63.84:3000/uploads/[any-image-filename]

## Verification Checklist

- [ ] Docker containers are running: `docker-compose -f docker-compose.prod.yml ps`
- [ ] Web container is healthy: `docker-compose -f docker-compose.prod.yml logs web`
- [ ] Uploads directory exists: `docker exec thai-music-web-prod ls -la public/uploads`
- [ ] Images are accessible via URL: `curl -I http://18.138.63.84:3000/uploads/[filename]`
- [ ] Application displays images correctly in browser

## Troubleshooting

### If images still don't load:

1. **Check container logs:**
   ```bash
   docker-compose -f docker-compose.prod.yml logs web
   ```

2. **Verify file permissions:**
   ```bash
   docker exec thai-music-web-prod ls -la public/uploads
   ```

3. **Test direct file access:**
   ```bash
   curl -I http://18.138.63.84:3000/uploads/[filename]
   ```

4. **Check if files exist in container:**
   ```bash
   docker exec thai-music-web-prod find public/uploads -name "*.jpg" | head -5
   ```

### Common Issues:

- **404 errors**: Files not copied to container properly
- **403 errors**: Permission issues with the uploads directory
- **Empty uploads**: Volume mount not working correctly

## Prevention

To prevent this issue in the future:
1. Always test image uploads in production environment
2. Use persistent volumes for user-uploaded content
3. Monitor container logs for file serving errors
4. Include image serving tests in deployment verification

## Technical Details

The fix addresses these specific issues:
- **Standalone Build Structure**: Properly copies the standalone server and static files
- **File Permissions**: Ensures the nextjs user can read uploaded files
- **Volume Persistence**: Prevents data loss during container updates
- **Static File Serving**: Enables Next.js to serve files from the public directory

Images are now served directly by Next.js at `/uploads/[filename]` paths, matching the database references.