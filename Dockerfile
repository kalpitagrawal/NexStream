FROM node:20-alpine

WORKDIR /app

# Copy package files first for better Docker caching
COPY package*.json ./

RUN npm ci --only=production

# Copy source code
COPY . .

# Create temp directory for file uploads
RUN mkdir -p public/temp

EXPOSE 8000

CMD ["node", "src/index.js"]
