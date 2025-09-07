# BlueCollab.ai - AI Service Request Platform

A comprehensive platform connecting homeowners with service providers for home maintenance and repair services, powered by AI-enhanced features.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd bluecollab-ai
npm install
```

2. **Start the database:**
```bash
npm run db:start
```

3. **Start all services:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend API
cd backend && npm start

# Terminal 3 - User Service
cd microservices/user-service && npm run dev
```

## 🏗️ Architecture

### Services
- **Frontend** (Port 3001): React + TypeScript + Vite
- **Backend API** (Port 3002): Express.js with MongoDB
- **User Service** (Port 3004): TypeScript microservice
- **MongoDB** (Port 27019): Database
- **Mongo Express** (Port 8082): Database UI

### Key Features
- User registration and authentication
- Job posting and bidding system
- AI-enhanced chat interface
- Payment processing with Stripe
- Work progress tracking
- Real-time notifications

## 📊 Current Status

### ✅ Working Components
- **Frontend**: React app running on http://localhost:3001
- **Backend API**: Express server on http://localhost:3002
- **User Service**: TypeScript microservice on http://localhost:3004
- **Database**: MongoDB running on port 27019
- **Database UI**: Mongo Express on http://localhost:8082

### 🔧 Recent Fixes Applied
1. **Database Authentication**: Removed authentication requirements for development
2. **Port Conflicts**: Resolved conflicts by using alternative ports
3. **Environment Variables**: Set up proper .env configuration
4. **Dependencies**: Installed missing test dependencies
5. **Connection Strings**: Updated all services to use correct MongoDB URI

## 🛠️ Development

### Available Scripts
```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Database
npm run db:start     # Start MongoDB
npm run db:stop      # Stop MongoDB
npm run db:logs      # View database logs
npm run db:reset     # Reset database

# Backend
cd backend
npm start           # Start backend server
npm run dev         # Start with auto-reload

# User Service
cd microservices/user-service
npm run dev         # Start with auto-reload
npm run build       # Build TypeScript
```

### Testing
```bash
# Run API tests
node test-api-endpoints.js
node test-successful-api.js

# Test specific services
curl http://localhost:3002/health
curl http://localhost:3004/api/v1/health
```

## 🗄️ Database

### Collections
- `users`: User accounts and profiles
- `jobs`: Job postings
- `bids`: Service provider bids
- `payments`: Payment records
- `work_progress`: Job progress updates
- `conversations`: Chat messages

### Connection
- **URI**: `mongodb://localhost:27019/bluecollab-ai`
- **UI**: http://localhost:8082 (admin/admin)

## 🔐 Environment Variables

Create `.env` file in project root:
```env
MONGODB_URI=mongodb://localhost:27019/bluecollab-ai
JWT_SECRET=your-super-secret-jwt-key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 📱 API Endpoints

### Backend API (Port 3002)
- `GET /health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users` - Get all users
- `POST /api/jobs` - Create job posting
- `GET /api/jobs` - Get all jobs
- `POST /api/bids` - Submit bid

### User Service (Port 3004)
- `GET /api/v1/health` - Health check
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/users` - Get users

## 🐛 Troubleshooting

### Common Issues
1. **Port conflicts**: Check if ports 3001, 3002, 3004, 27019, 8082 are available
2. **Database connection**: Ensure MongoDB container is running
3. **Authentication errors**: Check MongoDB connection string
4. **Missing dependencies**: Run `npm install` in each service directory

### Reset Everything
```bash
# Stop all services
docker-compose -f docker-compose.simple.yml down
pkill -f "node.*backend"
pkill -f "tsx.*user-service"
pkill -f "vite"

# Restart
npm run db:start
# Then start each service
```

## 📝 License

MIT License - see LICENSE file for details

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Status**: ✅ All core services running and functional
**Last Updated**: September 2024