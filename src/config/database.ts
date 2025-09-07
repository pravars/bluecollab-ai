import { MongoClient, Db, Collection } from 'mongodb';

// MongoDB configuration
export interface DatabaseConfig {
  uri: string;
  dbName: string;
  options: {
    maxPoolSize: number;
    minPoolSize: number;
    maxIdleTimeMS: number;
    serverSelectionTimeoutMS: number;
    socketTimeoutMS: number;
    bufferMaxEntries: number;
    bufferCommands: boolean;
  };
}

// Default configuration
const defaultConfig: DatabaseConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  dbName: process.env.MONGODB_DB_NAME || 'bluecollab-ai',
  options: {
    maxPoolSize: 10,
    minPoolSize: 5,
    maxIdleTimeMS: 30000,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferMaxEntries: 0,
    bufferCommands: false,
  },
};

// Production configuration for scaling
const productionConfig: DatabaseConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  dbName: process.env.MONGODB_DB_NAME || 'bluecollab-ai',
  options: {
    maxPoolSize: 50,
    minPoolSize: 10,
    maxIdleTimeMS: 30000,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferMaxEntries: 0,
    bufferCommands: false,
  },
};

class DatabaseManager {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private config: DatabaseConfig;

  constructor() {
    this.config = process.env.NODE_ENV === 'production' ? productionConfig : defaultConfig;
  }

  async connect(): Promise<void> {
    try {
      this.client = new MongoClient(this.config.uri, this.config.options);
      await this.client.connect();
      this.db = this.client.db(this.config.dbName);
      
      console.log('✅ Connected to MongoDB');
      console.log(`📊 Database: ${this.config.dbName}`);
      console.log(`🔗 URI: ${this.config.uri}`);
      
      // Create indexes for performance
      await this.createIndexes();
      
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      console.log('🔌 Disconnected from MongoDB');
    }
  }

  getDatabase(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  getCollection<T = any>(name: string): Collection<T> {
    return this.getDatabase().collection<T>(name);
  }

  // Create indexes for optimal performance
  private async createIndexes(): Promise<void> {
    if (!this.db) return;

    try {
      // Users collection indexes
      await this.db.collection('users').createIndex({ email: 1 }, { unique: true });
      await this.db.collection('users').createIndex({ userType: 1 });
      await this.db.collection('users').createIndex({ status: 1 });
      await this.db.collection('users').createIndex({ createdAt: 1 });
      await this.db.collection('users').createIndex({ 'profile.serviceAreas': '2dsphere' });

      // Jobs collection indexes
      await this.db.collection('jobs').createIndex({ homeownerId: 1 });
      await this.db.collection('jobs').createIndex({ 'category.id': 1 });
      await this.db.collection('jobs').createIndex({ status: 1 });
      await this.db.collection('jobs').createIndex({ createdAt: 1 });
      await this.db.collection('jobs').createIndex({ 'location.coordinates': '2dsphere' });
      await this.db.collection('jobs').createIndex({ budget: 1 });
      await this.db.collection('jobs').createIndex({ urgency: 1 });
      await this.db.collection('jobs').createIndex({ 
        title: 'text', 
        description: 'text' 
      });

      // Bids collection indexes
      await this.db.collection('bids').createIndex({ jobId: 1 });
      await this.db.collection('bids').createIndex({ providerId: 1 });
      await this.db.collection('bids').createIndex({ status: 1 });
      await this.db.collection('bids').createIndex({ submittedAt: 1 });
      await this.db.collection('bids').createIndex({ bidAmount: 1 });

      // Messages collection indexes
      await this.db.collection('messages').createIndex({ senderId: 1 });
      await this.db.collection('messages').createIndex({ recipientId: 1 });
      await this.db.collection('messages').createIndex({ jobId: 1 });
      await this.db.collection('messages').createIndex({ createdAt: 1 });

      // Notifications collection indexes
      await this.db.collection('notifications').createIndex({ userId: 1 });
      await this.db.collection('notifications').createIndex({ type: 1 });
      await this.db.collection('notifications').createIndex({ isRead: 1 });
      await this.db.collection('notifications').createIndex({ createdAt: 1 });

      // Transactions collection indexes
      await this.db.collection('transactions').createIndex({ jobId: 1 });
      await this.db.collection('transactions').createIndex({ payerId: 1 });
      await this.db.collection('transactions').createIndex({ payeeId: 1 });
      await this.db.collection('transactions').createIndex({ status: 1 });
      await this.db.collection('transactions').createIndex({ createdAt: 1 });

      // Reviews collection indexes
      await this.db.collection('reviews').createIndex({ jobId: 1 });
      await this.db.collection('reviews').createIndex({ reviewerId: 1 });
      await this.db.collection('reviews').createIndex({ revieweeId: 1 });
      await this.db.collection('reviews').createIndex({ rating: 1 });
      await this.db.collection('reviews').createIndex({ createdAt: 1 });

      // AI Agent Activity indexes
      await this.db.collection('aiAgentActivity').createIndex({ agentId: 1 });
      await this.db.collection('aiAgentActivity').createIndex({ jobId: 1 });
      await this.db.collection('aiAgentActivity').createIndex({ createdAt: 1 });

      // User Activity Logs indexes
      await this.db.collection('userActivityLogs').createIndex({ userId: 1 });
      await this.db.collection('userActivityLogs').createIndex({ activityType: 1 });
      await this.db.collection('userActivityLogs').createIndex({ createdAt: 1 });

      console.log('📊 Database indexes created successfully');
    } catch (error) {
      console.error('❌ Error creating indexes:', error);
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.db) return false;
      await this.db.admin().ping();
      return true;
    } catch (error) {
      console.error('❌ Database health check failed:', error);
      return false;
    }
  }

  // Get database statistics
  async getStats(): Promise<any> {
    if (!this.db) return null;
    
    try {
      const stats = await this.db.stats();
      return {
        collections: stats.collections,
        dataSize: stats.dataSize,
        indexSize: stats.indexSize,
        storageSize: stats.storageSize,
        objects: stats.objects,
      };
    } catch (error) {
      console.error('❌ Error getting database stats:', error);
      return null;
    }
  }
}

// Export singleton instance
export const dbManager = new DatabaseManager();
export default dbManager;
