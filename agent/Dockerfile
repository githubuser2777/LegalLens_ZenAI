FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies including devDependencies (tsx, typescript)
RUN npm install

# Copy source code
COPY . .

# Expose port 8000 (default for Cloud Run is 8080, but we can set PORT env var or just use 8000)
# Cloud Run injects PORT environment variable automatically.
ENV PORT=8000
EXPOSE 8000

# Start the agent using tsx
CMD ["npm", "start"]
