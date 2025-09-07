# BlueCollab.ai - AI-Powered Home Services Platform

![BlueCollab.ai Logo](https://via.placeholder.com/200x80/4F46E5/FFFFFF?text=BlueCollab.ai)

**BlueCollab.ai** is a comprehensive home services platform that connects homeowners with service providers through an AI-enhanced bidding system. Built with React, Node.js, and MongoDB, it features real-time communication, work progress tracking, and integrated payment processing.

## 🚀 Features

### 🏠 For Homeowners
- **AI Job Creation**: Intelligent job posting with AI assistance
- **Service Provider Discovery**: Browse and compare service providers
- **Bid Management**: Review, accept, or reject bids
- **Work Progress Tracking**: Real-time updates on job progress
- **Payment Processing**: Secure payment with escrow functionality
- **Communication**: Direct messaging with service providers
- **Job History**: Complete job and conversation history

### 🔧 For Service Providers
- **Job Browsing**: Discover relevant home service opportunities
- **Bid Submission**: Submit competitive bids with detailed proposals
- **Work Management**: Update job progress and communicate with clients
- **Payment Tracking**: Monitor payments and escrow status
- **Profile Management**: Build reputation and showcase expertise
- **Real-time Notifications**: Stay updated on bid status and messages

### 🤖 AI-Powered Features
- **Smart Job Creation**: AI assistant helps create detailed job postings
- **Requirement Extraction**: Intelligent questioning to gather job details
- **Service Matching**: AI-enhanced matching between jobs and providers
- **Knowledge Base**: Comprehensive home services knowledge integration

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Stripe Elements** for payment processing

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Stripe** for payment processing

### AI Integration
- **Ollama** for local LLM processing
- **Llama 2.7B** and **Llama 3.1:8b** models
- **Custom AI Assistant** for job creation
- **Home Services Knowledge Base**

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Ollama (for AI features)
- Git

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/pravars/bluecollab-ai.git
cd bluecollab-ai
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../microservices/user-service
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/bluecollab-ai
MONGODB_DB_NAME=bluecollab-ai

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Stripe (for production)
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# CORS
CORS_ORIGIN=http://localhost:3001
```

### 4. Start MongoDB
```bash
# Using Docker
docker-compose -f docker-compose.mongodb.yml up -d

# Or start MongoDB locally
mongod
```

### 5. Start Ollama (for AI features)
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull AI models
ollama pull llama2:7b
ollama pull llama3.1:8b
```

### 6. Start the Application
```bash
# Start backend (Terminal 1)
cd backend
npm start

# Start frontend (Terminal 2)
npm run dev

# Start user service (Terminal 3)
cd microservices/user-service
npm start
```

## 🌐 Application URLs

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3002
- **User Service**: http://localhost:3003
- **Health Check**: http://localhost:3002/health

## 📱 User Guide

### Getting Started

#### For Homeowners
1. **Register**: Create an account as a "Homeowner"
2. **Create Job**: Use the AI assistant to create detailed job postings
3. **Review Bids**: Compare service provider bids and proposals
4. **Accept Bid**: Select the best service provider for your job
5. **Track Progress**: Monitor work progress and communicate with providers
6. **Make Payment**: Pay for completed work through the secure payment system

#### For Service Providers
1. **Register**: Create an account as a "Service Provider"
2. **Browse Jobs**: Find relevant home service opportunities
3. **Submit Bids**: Create competitive proposals with pricing and timeline
4. **Manage Work**: Update job progress and communicate with clients
5. **Track Payments**: Monitor payment status and escrow releases

### AI Job Creation

The AI assistant helps homeowners create comprehensive job postings:

1. **Start Conversation**: Click "AI Job Creator" on the home page
2. **Answer Questions**: The AI asks relevant questions about your needs
3. **Review Details**: AI generates a detailed job description
4. **Post Job**: Submit the job for service providers to bid on

### Work Progress System

#### Service Providers
- **Status Updates**: Mark job progress (In Progress, On Hold, Completed, etc.)
- **Progress Percentage**: Track completion with visual progress bars
- **Internal Notes**: Private notes not visible to homeowners
- **File Attachments**: Share photos and documents
- **Communication**: Direct messaging with homeowners

#### Homeowners
- **Progress Viewing**: See all updates and progress statistics
- **Message History**: Complete conversation timeline
- **Status Notifications**: Real-time updates on job status
- **File Access**: View shared documents and photos

### Payment System

#### Mock Payment Mode (Development)
- **Test Payments**: Use mock payment form for testing
- **No Real Charges**: Safe for development and demonstration
- **Full Workflow**: Complete payment process simulation

#### Production Payment (with Stripe)
- **Secure Processing**: Stripe-powered payment processing
- **Escrow Management**: Hold funds until job completion
- **Refund Support**: Built-in refund and dispute handling
- **Multiple Payment Methods**: Credit cards and saved payment methods

## 🔧 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Job Management
- `POST /api/jobs` - Create new job
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/user/:userId` - Get user's jobs
- `PUT /api/jobs/:id/status` - Update job status

### Bidding System
- `POST /api/bids` - Submit bid
- `GET /api/bids/job/:jobId` - Get job bids
- `PUT /api/bids/:id/accept` - Accept bid

### Work Progress
- `POST /api/work-progress` - Create progress update
- `GET /api/work-progress/job/:jobId` - Get job progress
- `GET /api/work-progress/bid/:bidId` - Get bid progress

### Communication
- `GET /api/conversations/job/:jobId/bid/:bidId` - Get conversation
- `POST /api/conversations/message` - Send message

### Payment Processing
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/create-escrow-account` - Create escrow account
- `POST /api/payments/release-escrow` - Release escrow funds

## 🧪 Testing

### Test Data
The application includes test users for demonstration:
- **Homeowner**: `b@gmail.com` / `password123`
- **Service Provider**: `a@gmail.com` / `password123`

### Test Scenarios
1. **Complete Job Lifecycle**: Post job → Receive bids → Accept bid → Track progress → Complete → Pay
2. **Communication Flow**: Send messages between homeowner and service provider
3. **Payment Processing**: Test mock payment flow
4. **AI Job Creation**: Use AI assistant to create job postings

## 🚀 Deployment

### Production Setup
1. **Environment Variables**: Update `.env` with production values
2. **Database**: Set up production MongoDB instance
3. **Stripe**: Configure production Stripe keys
4. **Domain**: Update CORS and API URLs
5. **SSL**: Enable HTTPS for secure communication

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the API endpoints in `/backend/src/index.js`

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ User authentication and registration
- ✅ Job posting and bidding system
- ✅ AI-powered job creation
- ✅ Work progress tracking
- ✅ Communication system
- ✅ Payment processing (mock mode)

### Phase 2 (Planned)
- [ ] Real Stripe integration
- [ ] Mobile app development
- [ ] Advanced AI features
- [ ] Video calling integration
- [ ] Advanced analytics
- [ ] Multi-language support

### Phase 3 (Future)
- [ ] Machine learning recommendations
- [ ] IoT device integration
- [ ] Blockchain escrow system
- [ ] Advanced scheduling
- [ ] Marketplace features

## 📊 Project Structure

```
dwello/
├── backend/                 # Node.js backend API
├── microservices/          # Microservices architecture
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── services/          # API services
│   ├── models/            # TypeScript models
│   └── contexts/          # React contexts
├── database/              # Database schemas and scripts
├── docs/                 # Documentation
└── public/               # Static assets
```

---

**Built with ❤️ by the BlueCollab.ai Team**

*Connecting homeowners with trusted service providers through AI-powered technology.*