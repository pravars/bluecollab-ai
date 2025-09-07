import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27019/bluecollab-ai';

export async function connectDatabase(): Promise<void> {
  try {
    const options = {
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(MONGODB_URI, options);
    
    logger.info('✅ Connected to MongoDB');
    logger.info(`📊 Database: ${mongoose.connection.db?.databaseName}`);
    logger.info(`🔗 URI: ${MONGODB_URI}`);

    // Connection event handlers
    mongoose.connection.on('error', (error) => {
      logger.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('🔄 MongoDB reconnected');
    });

  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('🔌 Disconnected from MongoDB');
  } catch (error) {
    logger.error('❌ Error disconnecting from MongoDB:', error);
    throw error;
  }
}
