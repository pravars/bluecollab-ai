# API Documentation

## Base URL
- **Development**: `http://localhost:3002`
- **Production**: `https://api.dwello.com`

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": true|false,
  "data": <response-data>,
  "error": "<error-message>",
  "message": "<success-message>"
}
```

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "userType": "homeowner" | "service_provider"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "userType": "homeowner"
    },
    "token": "jwt-token-here"
  },
  "message": "User registered successfully"
}
```

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "userType": "homeowner"
    },
    "token": "jwt-token-here"
  },
  "message": "Login successful"
}
```

## Job Management

### Create Job
```http
POST /api/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Fix Leaky Faucet",
  "description": "Kitchen faucet has been leaking for a week",
  "serviceType": "plumbing",
  "scope": "Kitchen faucet repair",
  "timeline": "ASAP",
  "budget": 150,
  "location": "123 Main St, City, State",
  "urgency": "high" | "medium" | "low",
  "specialRequirements": ["Must be licensed plumber"],
  "estimatedDuration": "2-3 hours",
  "skillsRequired": ["plumbing", "faucet repair"]
}
```

### Get All Jobs
```http
GET /api/jobs
```

**Query Parameters:**
- `serviceType`: Filter by service type
- `location`: Filter by location
- `urgency`: Filter by urgency level
- `minBudget`: Minimum budget filter
- `maxBudget`: Maximum budget filter

### Get User's Jobs
```http
GET /api/jobs/user/:userId
Authorization: Bearer <token>
```

### Update Job Status
```http
PUT /api/jobs/:jobId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "open" | "in_progress" | "completed" | "cancelled"
}
```

## Bidding System

### Submit Bid
```http
POST /api/bids
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobId": "job123",
  "bidderId": "user456",
  "amount": 120,
  "timeline": "2-3 days",
  "description": "I can fix this leaky faucet quickly and efficiently"
}
```

### Get Job Bids
```http
GET /api/jobs/:jobId/bids
```

### Accept Bid
```http
PUT /api/bids/:bidId/accept
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobId": "job123"
}
```

## Work Progress

### Create Progress Update
```http
POST /api/work-progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobId": "job123",
  "bidId": "bid456",
  "status": "in_progress" | "on_hold" | "completed" | "needs_attention" | "cancelled",
  "progress": 75,
  "title": "Progress Update Title",
  "description": "Detailed description of work completed",
  "attachments": ["image1.jpg", "document.pdf"],
  "isInternal": false
}
```

### Get Job Progress
```http
GET /api/work-progress/job/:jobId
Authorization: Bearer <token>
```

### Get Bid Progress
```http
GET /api/work-progress/bid/:bidId
Authorization: Bearer <token>
```

## Communication

### Get or Create Conversation
```http
GET /api/conversations/job/:jobId/bid/:bidId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "conv123",
    "jobId": "job123",
    "bidId": "bid456",
    "messages": [
      {
        "_id": "msg123",
        "senderId": "user123",
        "senderName": "John Doe",
        "senderType": "homeowner",
        "content": "Hello, when can you start?",
        "timestamp": "2024-01-15T10:30:00Z",
        "attachments": [],
        "isRead": false
      }
    ],
    "lastMessageAt": "2024-01-15T10:30:00Z",
    "participants": {
      "homeowner": "user123",
      "serviceProvider": "user456"
    }
  }
}
```

### Send Message
```http
POST /api/conversations/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobId": "job123",
  "bidId": "bid456",
  "content": "I can start tomorrow morning",
  "attachments": ["schedule.pdf"]
}
```

## Payment Processing

### Create Payment Intent
```http
POST /api/payments/create-payment-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 12000,
  "currency": "usd",
  "jobId": "job123",
  "bidId": "bid456",
  "customerId": "cus123"
}
```

### Create Escrow Account
```http
POST /api/payments/create-escrow-account
Authorization: Bearer <token>
Content-Type: application/json

{
  "serviceProviderId": "user456",
  "jobId": "job123",
  "amount": 12000
}
```

### Release Escrow
```http
POST /api/payments/release-escrow
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentId": "pay123",
  "jobId": "job123",
  "reason": "job_completed"
}
```

### Get Payment Status
```http
GET /api/payments/status/:paymentId
Authorization: Bearer <token>
```

## AI Assistant

### Start Conversation
```http
POST /api/ai/start-conversation
Authorization: Bearer <token>
Content-Type: application/json

{
  "serviceType": "plumbing",
  "userId": "user123"
}
```

### Send AI Message
```http
POST /api/ai/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "conversationId": "conv123",
  "message": "My kitchen faucet is leaking",
  "userId": "user123"
}
```

### Generate Job Description
```http
POST /api/ai/generate-job
Authorization: Bearer <token>
Content-Type: application/json

{
  "conversationId": "conv123",
  "userId": "user123"
}
```

## Error Codes

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error
- `503` - Service Unavailable

### Application Error Codes
- `INVALID_CREDENTIALS` - Invalid email or password
- `USER_EXISTS` - User already registered
- `JOB_NOT_FOUND` - Job does not exist
- `BID_NOT_FOUND` - Bid does not exist
- `UNAUTHORIZED_ACCESS` - Insufficient permissions
- `PAYMENT_FAILED` - Payment processing failed
- `ESCROW_ERROR` - Escrow operation failed

## Rate Limiting

### Limits
- **Authentication**: 5 requests per minute per IP
- **Job Creation**: 10 requests per hour per user
- **Bid Submission**: 20 requests per hour per user
- **Messages**: 100 requests per hour per user
- **Payments**: 5 requests per hour per user

### Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Webhooks

### Payment Webhooks
```http
POST /api/webhooks/stripe
Content-Type: application/json
Stripe-Signature: <signature>

{
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_123",
      "amount": 12000,
      "status": "succeeded"
    }
  }
}
```

### Supported Events
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `customer.created`
- `customer.updated`

## SDK Examples

### JavaScript/Node.js
```javascript
const apiClient = {
  baseURL: 'http://localhost:3002',
  token: null,
  
  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.token ? `Bearer ${this.token}` : '',
        ...options.headers
      }
    });
    
    return response.json();
  },
  
  async login(email, password) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (response.success) {
      this.token = response.data.token;
    }
    
    return response;
  },
  
  async createJob(jobData) {
    return this.request('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData)
    });
  }
};
```

### Python
```python
import requests

class DwelloAPI:
    def __init__(self, base_url="http://localhost:3002"):
        self.base_url = base_url
        self.token = None
    
    def request(self, endpoint, method="GET", data=None):
        headers = {
            "Content-Type": "application/json"
        }
        
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        
        response = requests.request(
            method=method,
            url=f"{self.base_url}{endpoint}",
            headers=headers,
            json=data
        )
        
        return response.json()
    
    def login(self, email, password):
        response = self.request("/api/auth/login", "POST", {
            "email": email,
            "password": password
        })
        
        if response["success"]:
            self.token = response["data"]["token"]
        
        return response
```

## Testing

### Test Data
```json
{
  "testUsers": {
    "homeowner": {
      "email": "b@gmail.com",
      "password": "password123"
    },
    "serviceProvider": {
      "email": "a@gmail.com", 
      "password": "password123"
    }
  },
  "testJob": {
    "title": "Test Job",
    "description": "Test job description",
    "serviceType": "plumbing",
    "budget": 150,
    "location": "Test Location",
    "urgency": "medium"
  }
}
```

### Postman Collection
Import the API collection from `/docs/postman/Dwello-API.postman_collection.json` for easy testing.
