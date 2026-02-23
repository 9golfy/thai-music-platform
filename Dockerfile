FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application files
COPY . .

# Create uploads directory
RUN mkdir -p public/uploads

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0", "-p", "3000"]
