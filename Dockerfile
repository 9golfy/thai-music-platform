FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application files
COPY . .

# Create uploads directory with proper permissions
RUN mkdir -p public/uploads && chmod 777 public/uploads

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]
