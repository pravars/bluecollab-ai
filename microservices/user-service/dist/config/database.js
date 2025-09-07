"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
exports.disconnectDatabase = disconnectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_js_1 = require("../utils/logger.js");
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27019/bluecollab-ai';
async function connectDatabase() {
    try {
        const options = {
            maxPoolSize: 10,
            minPoolSize: 5,
            maxIdleTimeMS: 30000,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };
        await mongoose_1.default.connect(MONGODB_URI, options);
        logger_js_1.logger.info('✅ Connected to MongoDB');
        logger_js_1.logger.info(`📊 Database: ${mongoose_1.default.connection.db?.databaseName}`);
        logger_js_1.logger.info(`🔗 URI: ${MONGODB_URI}`);
        // Connection event handlers
        mongoose_1.default.connection.on('error', (error) => {
            logger_js_1.logger.error('❌ MongoDB connection error:', error);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            logger_js_1.logger.warn('⚠️ MongoDB disconnected');
        });
        mongoose_1.default.connection.on('reconnected', () => {
            logger_js_1.logger.info('🔄 MongoDB reconnected');
        });
    }
    catch (error) {
        logger_js_1.logger.error('❌ MongoDB connection failed:', error);
        throw error;
    }
}
async function disconnectDatabase() {
    try {
        await mongoose_1.default.disconnect();
        logger_js_1.logger.info('🔌 Disconnected from MongoDB');
    }
    catch (error) {
        logger_js_1.logger.error('❌ Error disconnecting from MongoDB:', error);
        throw error;
    }
}
//# sourceMappingURL=database.js.map