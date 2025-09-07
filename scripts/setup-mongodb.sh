#!/bin/bash

# Dwello MongoDB Setup Script
# This script sets up MongoDB for the Dwello platform

set -e

echo "🚀 Setting up MongoDB for Dwello Platform..."

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

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating .env file from .env.example..."
    cp .env.example .env
    print_warning "Please update .env file with your actual configuration values"
fi

# Start MongoDB services
print_status "Starting MongoDB services..."
docker-compose -f docker-compose.mongodb.yml up -d

# Wait for MongoDB to be ready
print_status "Waiting for MongoDB to be ready..."
sleep 30

# Check if MongoDB is running
if ! docker ps | grep -q "bluecollab-ai-mongodb-primary"; then
    print_error "MongoDB primary container is not running"
    exit 1
fi

# Initialize MongoDB
print_status "Initializing MongoDB with schema and data..."
docker exec bluecollab-ai-mongodb-primary mongosh --eval "
rs.initiate({
  _id: 'bluecollab-ai-rs',
  members: [
    { _id: 0, host: 'mongodb-primary:27017', priority: 2 },
    { _id: 1, host: 'mongodb-secondary-1:27017', priority: 1 },
    { _id: 2, host: 'mongodb-secondary-2:27017', priority: 1 },
    { _id: 3, host: 'mongodb-arbiter:27017', arbiterOnly: true }
  ]
})
"

# Wait for replica set to be ready
print_status "Waiting for replica set to be ready..."
sleep 20

# Run initialization script
print_status "Running MongoDB initialization script..."
docker exec bluecollab-ai-mongodb-primary mongosh --eval "
load('/docker-entrypoint-initdb.d/mongodb-init.js')
"

# Verify setup
print_status "Verifying MongoDB setup..."
docker exec bluecollab-ai-mongodb-primary mongosh --eval "
use bluecollab-ai;
db.users.countDocuments();
db.serviceCategories.countDocuments();
db.systemSettings.countDocuments();
"

print_success "MongoDB setup completed successfully!"
echo ""
echo "📊 MongoDB Services:"
echo "  - Primary: localhost:27017"
echo "  - Secondary 1: localhost:27018"
echo "  - Secondary 2: localhost:27019"
echo "  - Arbiter: localhost:27020"
echo "  - Config 1: localhost:27021"
echo "  - Config 2: localhost:27022"
echo "  - Config 3: localhost:27023"
echo "  - Router: localhost:27024"
echo ""
echo "🌐 Web Interfaces:"
echo "  - MongoDB Express: http://localhost:8081"
echo "  - Redis Commander: http://localhost:8082"
echo ""
echo "👤 Default Admin User:"
echo "  - Email: admin@bluecollab-ai.com"
echo "  - Password: admin123"
echo ""
echo "🔗 Connection String:"
echo "  mongodb://admin:bluecollab-ai123@localhost:27017/bluecollab-ai?replicaSet=bluecollab-ai-rs"
echo ""
echo "Next steps:"
echo "1. Update your .env file with the MongoDB connection string"
echo "2. Start your application with: npm run dev"
echo "3. Access MongoDB Express at http://localhost:8081"
