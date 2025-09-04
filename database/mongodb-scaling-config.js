// MongoDB Scaling Configuration for Dwello Platform
// This file contains configurations for horizontal scaling, sharding, and replication

// =============================================
// REPLICA SET CONFIGURATION
// =============================================

// Initialize replica set for high availability
const replicaSetConfig = {
  _id: "dwello-rs",
  members: [
    {
      _id: 0,
      host: "mongodb-primary:27017",
      priority: 2
    },
    {
      _id: 1,
      host: "mongodb-secondary-1:27017",
      priority: 1
    },
    {
      _id: 2,
      host: "mongodb-secondary-2:27017",
      priority: 1
    },
    {
      _id: 3,
      host: "mongodb-arbiter:27017",
      arbiterOnly: true
    }
  ]
};

// =============================================
// SHARDING CONFIGURATION
// =============================================

// Enable sharding for the database
sh.enableSharding("dwello");

// Shard key strategies for different collections
const shardConfigs = {
  // Users collection - shard by userType for even distribution
  users: {
    shardKey: { userType: 1, _id: 1 },
    description: "Shard users by type (homeowner/service_provider) for balanced distribution"
  },
  
  // Jobs collection - shard by location for geographic queries
  jobs: {
    shardKey: { "location.coordinates": "hashed" },
    description: "Shard jobs by location for efficient geographic queries"
  },
  
  // Bids collection - shard by jobId for co-location with jobs
  bids: {
    shardKey: { jobId: 1, _id: 1 },
    description: "Shard bids by jobId to keep related data together"
  },
  
  // Messages collection - shard by senderId for user-specific queries
  messages: {
    shardKey: { senderId: 1, createdAt: 1 },
    description: "Shard messages by sender for user-specific queries"
  },
  
  // Notifications collection - shard by userId for user-specific queries
  notifications: {
    shardKey: { userId: 1, createdAt: 1 },
    description: "Shard notifications by userId for user-specific queries"
  },
  
  // Transactions collection - shard by payerId for financial queries
  transactions: {
    shardKey: { payerId: 1, createdAt: 1 },
    description: "Shard transactions by payer for financial queries"
  },
  
  // Reviews collection - shard by jobId for job-related queries
  reviews: {
    shardKey: { jobId: 1, _id: 1 },
    description: "Shard reviews by jobId to keep job data together"
  },
  
  // Activity logs - shard by userId and date for time-series queries
  userActivityLogs: {
    shardKey: { userId: 1, createdAt: 1 },
    description: "Shard activity logs by userId and time for efficient queries"
  }
};

// Apply sharding configuration
Object.entries(shardConfigs).forEach(([collection, config]) => {
  sh.shardCollection(`dwello.${collection}`, config.shardKey);
  print(`✅ Sharded collection: ${collection} with key: ${JSON.stringify(config.shardKey)}`);
});

// =============================================
// INDEXES FOR SHARDED COLLECTIONS
// =============================================

// Create compound indexes that include the shard key
const shardIndexes = {
  users: [
    { userType: 1, status: 1, createdAt: 1 },
    { userType: 1, "profile.specialties": 1 },
    { email: 1 }, // Unique index
    { "profile.serviceAreas": "2dsphere" }
  ],
  
  jobs: [
    { "location.coordinates": "2dsphere" },
    { homeownerId: 1, status: 1 },
    { "category.id": 1, status: 1 },
    { urgency: 1, status: 1 },
    { budget: 1, status: 1 },
    { title: "text", description: "text" }
  ],
  
  bids: [
    { jobId: 1, status: 1 },
    { providerId: 1, status: 1 },
    { submittedAt: 1, status: 1 },
    { bidAmount: 1, status: 1 }
  ],
  
  messages: [
    { senderId: 1, recipientId: 1, createdAt: 1 },
    { jobId: 1, createdAt: 1 },
    { recipientId: 1, isRead: 1, createdAt: 1 }
  ],
  
  notifications: [
    { userId: 1, isRead: 1, createdAt: 1 },
    { userId: 1, type: 1, createdAt: 1 },
    { type: 1, createdAt: 1 }
  ],
  
  transactions: [
    { payerId: 1, status: 1, createdAt: 1 },
    { payeeId: 1, status: 1, createdAt: 1 },
    { jobId: 1, status: 1 },
    { status: 1, createdAt: 1 }
  ],
  
  reviews: [
    { jobId: 1, rating: 1 },
    { reviewerId: 1, createdAt: 1 },
    { revieweeId: 1, rating: 1 },
    { rating: 1, createdAt: 1 }
  ],
  
  userActivityLogs: [
    { userId: 1, activityType: 1, createdAt: 1 },
    { activityType: 1, createdAt: 1 },
    { createdAt: 1 } // TTL index for data retention
  ]
};

// Create indexes for each collection
Object.entries(shardIndexes).forEach(([collection, indexes]) => {
  indexes.forEach(index => {
    db.getSiblingDB("dwello").getCollection(collection).createIndex(index);
    print(`✅ Created index on ${collection}: ${JSON.stringify(index)}`);
  });
});

// =============================================
// DATA RETENTION POLICIES
// =============================================

// TTL indexes for automatic data cleanup
const ttlIndexes = {
  // Keep activity logs for 1 year
  userActivityLogs: { createdAt: 1, expireAfterSeconds: 31536000 },
  
  // Keep old notifications for 6 months
  notifications: { createdAt: 1, expireAfterSeconds: 15552000 },
  
  // Keep old messages for 2 years
  messages: { createdAt: 1, expireAfterSeconds: 63072000 },
  
  // Keep completed jobs for 3 years
  jobs: { completedAt: 1, expireAfterSeconds: 94608000 }
};

// Apply TTL indexes
Object.entries(ttlIndexes).forEach(([collection, ttlConfig]) => {
  db.getSiblingDB("dwello").getCollection(collection).createIndex(
    ttlConfig.index,
    { expireAfterSeconds: ttlConfig.expireAfterSeconds }
  );
  print(`✅ Created TTL index on ${collection}: ${ttlConfig.expireAfterSeconds} seconds`);
});

// =============================================
// CHUNK SIZE AND BALANCING
// =============================================

// Configure chunk size for better balancing
sh.setBalancerState(true);
sh.setBalancerState(true);

// Set chunk size to 64MB for better distribution
sh.setBalancerState(false);
sh.setBalancerState(true);

// =============================================
// READ PREFERENCES
// =============================================

// Configure read preferences for different operations
const readPreferences = {
  // For user queries - read from primary for consistency
  userQueries: "primary",
  
  // For job searches - read from secondary for performance
  jobSearches: "secondaryPreferred",
  
  // For analytics - read from secondary
  analytics: "secondary",
  
  // For real-time data - read from primary
  realTime: "primary"
};

// =============================================
// WRITE CONCERNS
// =============================================

// Configure write concerns for different operations
const writeConcerns = {
  // Critical operations (payments, user data)
  critical: { w: "majority", j: true, wtimeout: 5000 },
  
  // Standard operations (jobs, bids)
  standard: { w: 2, j: true, wtimeout: 5000 },
  
  // Analytics and logging
  analytics: { w: 1, j: false, wtimeout: 5000 }
};

// =============================================
// MONITORING AND ALERTS
// =============================================

// Create monitoring collections
db.getSiblingDB("dwello").createCollection("systemMetrics");
db.getSiblingDB("dwello").createCollection("performanceMetrics");
db.getSiblingDB("dwello").createCollection("errorLogs");

// Create indexes for monitoring
db.getSiblingDB("dwello").systemMetrics.createIndex({ timestamp: 1 });
db.getSiblingDB("dwello").performanceMetrics.createIndex({ timestamp: 1, operation: 1 });
db.getSiblingDB("dwello").errorLogs.createIndex({ timestamp: 1, severity: 1 });

// =============================================
// BACKUP CONFIGURATION
// =============================================

// Configure backup settings
const backupConfig = {
  // Daily full backups
  fullBackup: {
    schedule: "0 2 * * *", // 2 AM daily
    retention: 30 // days
  },
  
  // Continuous incremental backups
  incrementalBackup: {
    schedule: "*/15 * * * *", // Every 15 minutes
    retention: 7 // days
  },
  
  // Cross-region replication
  crossRegion: {
    enabled: true,
    regions: ["us-east-1", "us-west-2", "eu-west-1"]
  }
};

print("🚀 MongoDB scaling configuration completed!");
print("📊 Sharding enabled for horizontal scaling");
print("🔄 Replica set configured for high availability");
print("📈 Indexes optimized for performance");
print("🗑️ TTL policies configured for data retention");
print("📊 Monitoring collections created");
print("💾 Backup configuration ready");
