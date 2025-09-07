// Dwello Platform MongoDB Schema
// Document-based schema for NoSQL implementation

// =============================================
// USER COLLECTIONS
// =============================================

// Users collection
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "userType": 1 });
db.users.createIndex({ "status": 1 });
db.users.createIndex({ "createdAt": 1 });

db.users.insertOne({
  _id: ObjectId(),
  email: "user@example.com",
  passwordHash: "$2b$10$...",
  firstName: "John",
  lastName: "Doe",
  phone: "+1234567890",
  userType: "homeowner", // homeowner, service_provider, admin
  status: "active", // active, inactive, suspended, pending_verification
  emailVerified: true,
  phoneVerified: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLoginAt: new Date(),
  profileImageUrl: "https://...",
  timezone: "UTC",
  language: "en",
  profile: {
    bio: "Homeowner looking for quality services",
    companyName: null,
    website: null,
    yearsExperience: null,
    specialties: [],
    serviceAreas: {
      type: "Polygon",
      coordinates: [[[lng1, lat1], [lng2, lat2], ...]]
    },
    availabilitySchedule: {
      monday: { start: "09:00", end: "17:00" },
      tuesday: { start: "09:00", end: "17:00" },
      // ... other days
    },
    emergencyAvailable: false,
    insuranceInfo: {
      provider: "State Farm",
      policyNumber: "SF123456",
      expirationDate: "2024-12-31"
    },
    licenseInfo: {
      licenses: [
        {
          type: "General Contractor",
          number: "GC123456",
          state: "CA",
          expirationDate: "2024-12-31"
        }
      ]
    }
  },
  addresses: [
    {
      addressType: "home", // home, business, billing
      streetAddress: "123 Main St",
      city: "San Francisco",
      state: "CA",
      postalCode: "94102",
      country: "US",
      location: {
        type: "Point",
        coordinates: [-122.4194, 37.7749]
      },
      isPrimary: true
    }
  ]
});

// =============================================
// JOB COLLECTIONS
// =============================================

// Service categories collection
db.serviceCategories.createIndex({ "name": 1 });
db.serviceCategories.createIndex({ "parentId": 1 });
db.serviceCategories.createIndex({ "isActive": 1 });

db.serviceCategories.insertOne({
  _id: ObjectId(),
  name: "Home Services",
  description: "General home maintenance and repair services",
  parentId: null,
  iconUrl: "https://...",
  isActive: true,
  sortOrder: 0,
  subcategories: [
    {
      name: "Painting",
      description: "Interior and exterior painting services"
    },
    {
      name: "Plumbing",
      description: "Plumbing repairs and installations"
    }
  ],
  createdAt: new Date()
});

// Jobs collection
db.jobs.createIndex({ "homeownerId": 1 });
db.jobs.createIndex({ "categoryId": 1 });
db.jobs.createIndex({ "status": 1 });
db.jobs.createIndex({ "createdAt": 1 });
db.jobs.createIndex({ "location": "2dsphere" });
db.jobs.createIndex({ "budgetMin": 1, "budgetMax": 1 });
db.jobs.createIndex({ "urgency": 1 });

db.jobs.insertOne({
  _id: ObjectId(),
  homeownerId: ObjectId(),
  title: "Kitchen Cabinet Painting",
  description: "Need professional to paint 15 kitchen cabinets...",
  category: {
    id: ObjectId(),
    name: "Painting",
    subcategory: "Interior Painting"
  },
  budget: {
    min: 800,
    max: 1200,
    currency: "USD"
  },
  urgency: "medium", // low, medium, high, urgent
  status: "open", // draft, open, in_progress, completed, cancelled, disputed
  location: {
    address: "123 Main St, San Francisco, CA 94102",
    coordinates: [-122.4194, 37.7749],
    radius: 10 // miles
  },
  timeline: {
    preferredStartDate: new Date("2024-02-01"),
    preferredEndDate: new Date("2024-02-05"),
    estimatedDurationHours: 16
  },
  requirements: {
    materialsProvided: false,
    materialsDescription: "Homeowner will provide paint and supplies",
    specialRequirements: "Must be licensed and insured",
    mandatoryRequirements: [
      "Licensed contractor",
      "General liability insurance",
      "3+ years experience"
    ]
  },
  photos: [
    "https://storage.bluecollab-ai.com/jobs/photo1.jpg",
    "https://storage.bluecollab-ai.com/jobs/photo2.jpg"
  ],
  isEmergency: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  publishedAt: new Date()
});

// =============================================
// BIDDING COLLECTIONS
// =============================================

// Bids collection
db.bids.createIndex({ "jobId": 1 });
db.bids.createIndex({ "providerId": 1 });
db.bids.createIndex({ "status": 1 });
db.bids.createIndex({ "submittedAt": 1 });
db.bids.createIndex({ "bidAmount": 1 });

db.bids.insertOne({
  _id: ObjectId(),
  jobId: ObjectId(),
  providerId: ObjectId(),
  bidAmount: 950,
  timeline: {
    days: 3,
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-02-03")
  },
  description: "I specialize in interior painting with 8+ years experience...",
  status: "pending", // pending, accepted, rejected, withdrawn, expired
  pricing: {
    laborCost: 800,
    materialsCost: 150,
    materialsIncluded: false,
    totalCost: 950
  },
  materials: [
    {
      storeName: "Home Depot",
      itemName: "Benjamin Moore Eggshell Paint (2 gallons)",
      quantity: 2,
      unitPrice: 89.98,
      totalPrice: 179.96,
      storeUrl: "https://homedepot.com/..."
    }
  ],
  warranty: {
    months: 24,
    description: "2-year warranty on all work"
  },
  specialTerms: "Includes color consultation and cleanup",
  submittedAt: new Date(),
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  acceptedAt: null,
  rejectedAt: null
});

// =============================================
// AI & AUTOMATION COLLECTIONS
// =============================================

// AI Bidding Agents collection
db.aiBiddingAgents.createIndex({ "providerId": 1 });
db.aiBiddingAgents.createIndex({ "isActive": 1 });

db.aiBiddingAgents.insertOne({
  _id: ObjectId(),
  providerId: ObjectId(),
  isActive: true,
  configuration: {
    biddingStrategy: "balanced", // aggressive, balanced, premium
    maxBidRadiusMiles: 15,
    maxBidsPerDay: 8,
    minProjectValue: 200,
    maxProjectValue: 2000,
    preferredCategories: [ObjectId(), ObjectId()],
    workingHours: {
      start: "08:00",
      end: "18:00",
      timezone: "PST"
    }
  },
  performance: {
    totalBids: 127,
    wonBids: 34,
    winRate: 26.8,
    avgBidTime: "2.3 minutes",
    revenueGenerated: 23450
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

// AI Agent Activity collection
db.aiAgentActivity.createIndex({ "agentId": 1 });
db.aiAgentActivity.createIndex({ "jobId": 1 });
db.aiAgentActivity.createIndex({ "createdAt": 1 });

db.aiAgentActivity.insertOne({
  _id: ObjectId(),
  agentId: ObjectId(),
  jobId: ObjectId(),
  bidId: ObjectId(),
  actionType: "bid_submitted", // bid_submitted, bid_won, bid_lost, bid_expired
  confidenceScore: 92.5,
  bidAmount: 850,
  metadata: {
    jobCategory: "Painting",
    jobUrgency: "medium",
    competitionLevel: "high",
    timeOfDay: "14:30"
  },
  createdAt: new Date()
});

// =============================================
// COMMUNICATION COLLECTIONS
// =============================================

// Messages collection
db.messages.createIndex({ "senderId": 1 });
db.messages.createIndex({ "recipientId": 1 });
db.messages.createIndex({ "jobId": 1 });
db.messages.createIndex({ "createdAt": 1 });

db.messages.insertOne({
  _id: ObjectId(),
  senderId: ObjectId(),
  recipientId: ObjectId(),
  jobId: ObjectId(),
  subject: "Question about painting timeline",
  content: "Hi, I have a question about the estimated timeline...",
  messageType: "text", // text, image, file, system
  attachments: [
    {
      type: "image",
      url: "https://storage.bluecollab-ai.com/messages/attachment1.jpg",
      filename: "cabinet_photo.jpg",
      size: 1024000
    }
  ],
  isRead: false,
  readAt: null,
  createdAt: new Date()
});

// Notifications collection
db.notifications.createIndex({ "userId": 1 });
db.notifications.createIndex({ "type": 1 });
db.notifications.createIndex({ "isRead": 1 });
db.notifications.createIndex({ "createdAt": 1 });

db.notifications.insertOne({
  _id: ObjectId(),
  userId: ObjectId(),
  type: "bid_received", // bid_received, bid_accepted, bid_rejected, job_completed, payment_received, message_received, system
  title: "New bid received",
  message: "You received a new bid for 'Kitchen Cabinet Painting'",
  data: {
    jobId: ObjectId(),
    bidId: ObjectId(),
    bidAmount: 950,
    providerName: "Mike's Professional Painting"
  },
  isRead: false,
  readAt: null,
  createdAt: new Date()
});

// =============================================
// PAYMENT COLLECTIONS
// =============================================

// Transactions collection
db.transactions.createIndex({ "jobId": 1 });
db.transactions.createIndex({ "payerId": 1 });
db.transactions.createIndex({ "payeeId": 1 });
db.transactions.createIndex({ "status": 1 });
db.transactions.createIndex({ "createdAt": 1 });

db.transactions.insertOne({
  _id: ObjectId(),
  jobId: ObjectId(),
  payerId: ObjectId(),
  payeeId: ObjectId(),
  amount: 950,
  currency: "USD",
  transactionType: "payment", // payment, refund, dispute, fee
  status: "completed", // pending, completed, failed, cancelled, disputed
  paymentMethod: {
    type: "credit_card",
    lastFourDigits: "4242",
    brand: "visa"
  },
  providerTransactionId: "pi_1234567890",
  platformFee: 47.50, // 5% platform fee
  netAmount: 902.50,
  description: "Payment for Kitchen Cabinet Painting",
  metadata: {
    stripePaymentIntentId: "pi_1234567890",
    stripeChargeId: "ch_1234567890"
  },
  createdAt: new Date(),
  completedAt: new Date()
});

// =============================================
// REVIEW COLLECTIONS
// =============================================

// Reviews collection
db.reviews.createIndex({ "jobId": 1 });
db.reviews.createIndex({ "reviewerId": 1 });
db.reviews.createIndex({ "revieweeId": 1 });
db.reviews.createIndex({ "rating": 1 });
db.reviews.createIndex({ "createdAt": 1 });

db.reviews.insertOne({
  _id: ObjectId(),
  jobId: ObjectId(),
  reviewerId: ObjectId(),
  revieweeId: ObjectId(),
  rating: 5,
  title: "Excellent work!",
  comment: "Mike did an amazing job painting our kitchen cabinets. Very professional and clean work.",
  isPublic: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  response: {
    responderId: ObjectId(),
    response: "Thank you so much for the kind words! It was a pleasure working with you.",
    createdAt: new Date()
  }
});

// =============================================
// WORKFLOW COLLECTIONS
// =============================================

// Job Progress collection
db.jobProgress.createIndex({ "jobId": 1 });
db.jobProgress.createIndex({ "providerId": 1 });
db.jobProgress.createIndex({ "createdAt": 1 });

db.jobProgress.insertOne({
  _id: ObjectId(),
  jobId: ObjectId(),
  providerId: ObjectId(),
  progressPercentage: 75,
  statusDescription: "Priming completed, starting first coat of paint",
  photos: [
    "https://storage.bluecollab-ai.com/progress/photo1.jpg",
    "https://storage.bluecollab-ai.com/progress/photo2.jpg"
  ],
  notes: "All cabinets sanded and primed. Ready for paint application.",
  createdAt: new Date()
});

// Job Milestones collection
db.jobMilestones.createIndex({ "jobId": 1 });
db.jobMilestones.createIndex({ "dueDate": 1 });

db.jobMilestones.insertOne({
  _id: ObjectId(),
  jobId: ObjectId(),
  title: "Surface Preparation",
  description: "Sand and prime all cabinet surfaces",
  dueDate: new Date("2024-02-01"),
  completedAt: new Date("2024-02-01"),
  isRequired: true,
  createdAt: new Date()
});

// =============================================
// ANALYTICS COLLECTIONS
// =============================================

// User Activity Logs collection
db.userActivityLogs.createIndex({ "userId": 1 });
db.userActivityLogs.createIndex({ "activityType": 1 });
db.userActivityLogs.createIndex({ "createdAt": 1 });

db.userActivityLogs.insertOne({
  _id: ObjectId(),
  userId: ObjectId(),
  activityType: "job_posted",
  activityData: {
    jobId: ObjectId(),
    jobTitle: "Kitchen Cabinet Painting",
    category: "Painting"
  },
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
  createdAt: new Date()
});

// Platform Metrics collection
db.platformMetrics.createIndex({ "metricName": 1, "metricDate": 1 });
db.platformMetrics.createIndex({ "metricDate": 1 });

db.platformMetrics.insertOne({
  _id: ObjectId(),
  metricName: "daily_active_users",
  metricValue: 1250,
  metricDate: new Date("2024-01-15"),
  dimensions: {
    userType: "homeowner",
    region: "california"
  },
  createdAt: new Date()
});

// =============================================
// CONFIGURATION COLLECTIONS
// =============================================

// System Settings collection
db.systemSettings.createIndex({ "settingKey": 1 }, { unique: true });

db.systemSettings.insertOne({
  _id: ObjectId(),
  settingKey: "platform_fee_percentage",
  settingValue: "5.0",
  settingType: "number",
  description: "Platform fee percentage charged on transactions",
  isPublic: false,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Feature Flags collection
db.featureFlags.createIndex({ "flagName": 1 }, { unique: true });

db.featureFlags.insertOne({
  _id: ObjectId(),
  flagName: "ai_bidding_enabled",
  isEnabled: true,
  targetUsers: {
    userTypes: ["service_provider"],
    regions: ["california", "texas"],
    minRating: 4.0
  },
  rolloutPercentage: 50,
  description: "Enable AI-powered bidding for service providers",
  createdAt: new Date(),
  updatedAt: new Date()
});
