// MongoDB Initialization Script for BlueCollab.ai Platform
// This script sets up the database, collections, and initial data

print('🚀 Starting BlueCollab.ai MongoDB initialization...');

// =============================================
// DATABASE SETUP
// =============================================

// Switch to bluecollab-ai database
db = db.getSiblingDB('bluecollab-ai');

// Create application user
db.createUser({
  user: 'bluecollab_app',
  pwd: 'bluecollab_app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'bluecollab-ai'
    }
  ]
});

print('✅ Database and user created');

// =============================================
// COLLECTIONS SETUP
// =============================================

// Create collections with validation
const collections = [
  'users',
  'jobs',
  'bids',
  'messages',
  'notifications',
  'transactions',
  'reviews',
  'serviceCategories',
  'aiBiddingAgents',
  'aiAgentActivity',
  'userActivityLogs',
  'platformMetrics',
  'systemSettings',
  'featureFlags'
];

collections.forEach(collectionName => {
  db.createCollection(collectionName);
  print(`✅ Created collection: ${collectionName}`);
});

// =============================================
// INDEXES CREATION
// =============================================

// Users collection indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ userType: 1 });
db.users.createIndex({ status: 1 });
db.users.createIndex({ createdAt: 1 });
db.users.createIndex({ 'profile.serviceAreas': '2dsphere' });
db.users.createIndex({ 'profile.specialties': 1 });

// Jobs collection indexes
db.jobs.createIndex({ homeownerId: 1 });
db.jobs.createIndex({ 'category.id': 1 });
db.jobs.createIndex({ status: 1 });
db.jobs.createIndex({ createdAt: 1 });
db.jobs.createIndex({ 'location.coordinates': '2dsphere' });
db.jobs.createIndex({ budget: 1 });
db.jobs.createIndex({ urgency: 1 });
db.jobs.createIndex({ title: 'text', description: 'text' });

// Bids collection indexes
db.bids.createIndex({ jobId: 1 });
db.bids.createIndex({ providerId: 1 });
db.bids.createIndex({ status: 1 });
db.bids.createIndex({ submittedAt: 1 });
db.bids.createIndex({ bidAmount: 1 });

// Messages collection indexes
db.messages.createIndex({ senderId: 1 });
db.messages.createIndex({ recipientId: 1 });
db.messages.createIndex({ jobId: 1 });
db.messages.createIndex({ createdAt: 1 });

// Notifications collection indexes
db.notifications.createIndex({ userId: 1 });
db.notifications.createIndex({ type: 1 });
db.notifications.createIndex({ isRead: 1 });
db.notifications.createIndex({ createdAt: 1 });

// Transactions collection indexes
db.transactions.createIndex({ jobId: 1 });
db.transactions.createIndex({ payerId: 1 });
db.transactions.createIndex({ payeeId: 1 });
db.transactions.createIndex({ status: 1 });
db.transactions.createIndex({ createdAt: 1 });

// Reviews collection indexes
db.reviews.createIndex({ jobId: 1 });
db.reviews.createIndex({ reviewerId: 1 });
db.reviews.createIndex({ revieweeId: 1 });
db.reviews.createIndex({ rating: 1 });
db.reviews.createIndex({ createdAt: 1 });

// AI Agent Activity indexes
db.aiAgentActivity.createIndex({ agentId: 1 });
db.aiAgentActivity.createIndex({ jobId: 1 });
db.aiAgentActivity.createIndex({ createdAt: 1 });

// User Activity Logs indexes
db.userActivityLogs.createIndex({ userId: 1 });
db.userActivityLogs.createIndex({ activityType: 1 });
db.userActivityLogs.createIndex({ createdAt: 1 });

print('✅ All indexes created');

// =============================================
// INITIAL DATA
// =============================================

// Service Categories
const serviceCategories = [
  {
    _id: ObjectId(),
    name: 'Home Services',
    description: 'General home maintenance and repair services',
    iconUrl: 'https://dwello.com/icons/home.svg',
    isActive: true,
    sortOrder: 1,
    subcategories: [
      { name: 'Painting & Decorating', description: 'Interior and exterior painting services' },
      { name: 'Plumbing', description: 'Plumbing repairs and installations' },
      { name: 'Electrical', description: 'Electrical work and installations' },
      { name: 'Cleaning Services', description: 'House cleaning and maintenance' },
      { name: 'HVAC', description: 'Heating, ventilation, and air conditioning' },
      { name: 'Landscaping', description: 'Garden and outdoor maintenance' },
      { name: 'Flooring', description: 'Floor installation and repair' },
      { name: 'Handyman', description: 'General repair and maintenance' }
    ],
    createdAt: new Date()
  },
  {
    _id: ObjectId(),
    name: 'Home Financing',
    description: 'Mortgages, refinancing, and home loans',
    iconUrl: 'https://dwello.com/icons/finance.svg',
    isActive: true,
    sortOrder: 2,
    subcategories: [
      { name: 'Mortgages', description: 'Home purchase loans' },
      { name: 'Refinancing', description: 'Mortgage refinancing' },
      { name: 'Home Equity', description: 'Home equity loans and lines of credit' },
      { name: 'Construction Loans', description: 'Construction and renovation financing' }
    ],
    createdAt: new Date()
  },
  {
    _id: ObjectId(),
    name: 'Home Insurance',
    description: 'Property and liability insurance',
    iconUrl: 'https://dwello.com/icons/insurance.svg',
    isActive: true,
    sortOrder: 3,
    subcategories: [
      { name: 'Home Insurance', description: 'Property insurance coverage' },
      { name: 'Flood Insurance', description: 'Flood damage protection' },
      { name: 'Umbrella Policy', description: 'Additional liability coverage' },
      { name: 'Claims Support', description: 'Insurance claims assistance' }
    ],
    createdAt: new Date()
  },
  {
    _id: ObjectId(),
    name: 'Real Estate',
    description: 'Buying, selling, and property management',
    iconUrl: 'https://dwello.com/icons/real-estate.svg',
    isActive: true,
    sortOrder: 4,
    subcategories: [
      { name: 'Buying', description: 'Home buying assistance' },
      { name: 'Selling', description: 'Home selling services' },
      { name: 'Investment', description: 'Real estate investment' },
      { name: 'Property Management', description: 'Rental property management' }
    ],
    createdAt: new Date()
  }
];

db.serviceCategories.insertMany(serviceCategories);
print('✅ Service categories inserted');

// System Settings
const systemSettings = [
  {
    _id: ObjectId(),
    settingKey: 'platform_name',
    settingValue: 'Dwello',
    settingType: 'string',
    description: 'Platform name',
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    settingKey: 'platform_fee_percentage',
    settingValue: '5.0',
    settingType: 'number',
    description: 'Platform fee percentage',
    isPublic: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    settingKey: 'max_bid_radius_miles',
    settingValue: '50',
    settingType: 'number',
    description: 'Maximum bid radius in miles',
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    settingKey: 'job_expiry_days',
    settingValue: '30',
    settingType: 'number',
    description: 'Days before job expires',
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    settingKey: 'min_bid_amount',
    settingValue: '50.00',
    settingType: 'number',
    description: 'Minimum bid amount',
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

db.systemSettings.insertMany(systemSettings);
print('✅ System settings inserted');

// Feature Flags
const featureFlags = [
  {
    _id: ObjectId(),
    flagName: 'ai_bidding_enabled',
    isEnabled: true,
    targetUsers: {
      userTypes: ['service_provider'],
      minRating: 4.0
    },
    rolloutPercentage: 50,
    description: 'Enable AI-powered bidding',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    flagName: 'video_calls_enabled',
    isEnabled: false,
    targetUsers: {
      userTypes: ['homeowner', 'service_provider']
    },
    rolloutPercentage: 0,
    description: 'Enable video call feature',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    flagName: 'escrow_payments',
    isEnabled: true,
    targetUsers: {
      regions: ['US', 'CA']
    },
    rolloutPercentage: 100,
    description: 'Enable escrow payment system',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

db.featureFlags.insertMany(featureFlags);
print('✅ Feature flags inserted');

// =============================================
// TTL INDEXES FOR DATA RETENTION
// =============================================

// Keep activity logs for 1 year
db.userActivityLogs.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 31536000 }
);

// Keep old notifications for 6 months
db.notifications.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 15552000 }
);

// Keep old messages for 2 years
db.messages.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 63072000 }
);

print('✅ TTL indexes created for data retention');

// =============================================
// SAMPLE DATA FOR DEVELOPMENT
// =============================================

// Sample Admin User
const adminUser = {
  _id: ObjectId(),
  email: 'admin@dwello.com',
  passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', // password: admin123
  firstName: 'Admin',
  lastName: 'User',
  phone: '+1234567890',
  userType: 'admin',
  status: 'active',
  emailVerified: true,
  phoneVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  profile: {
    bio: 'Platform administrator',
    specialties: ['admin'],
    serviceAreas: {
      type: 'Polygon',
      coordinates: []
    },
    availabilitySchedule: {},
    emergencyAvailable: false
  },
  addresses: []
};

db.users.insertOne(adminUser);
print('✅ Admin user created');

// =============================================
// COMPLETION
// =============================================

print('🎉 Dwello MongoDB initialization completed successfully!');
print('📊 Database: dwello');
print('👤 Admin user: admin@dwello.com');
print('🔑 Admin password: admin123');
print('🌐 MongoDB Express: http://localhost:8081');
print('🔴 Redis Commander: http://localhost:8082');
print('');
print('Next steps:');
print('1. Start your application');
print('2. Connect to MongoDB using the connection string');
print('3. Begin development with the initialized database');
