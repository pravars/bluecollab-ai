"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_js_1 = require("./config/database.js");
const errorHandler_js_1 = require("./middleware/errorHandler.js");
const requestLogger_js_1 = require("./middleware/requestLogger.js");
const userRoutes_js_1 = __importDefault(require("./routes/userRoutes.js"));
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const healthRoutes_js_1 = __importDefault(require("./routes/healthRoutes.js"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3004;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true
}));
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Request logging
app.use(requestLogger_js_1.requestLogger);
// Routes
app.use('/api/v1/health', healthRoutes_js_1.default);
app.use('/api/v1/auth', authRoutes_js_1.default);
app.use('/api/v1/users', userRoutes_js_1.default);
// Error handling
app.use(errorHandler_js_1.errorHandler);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
});
// Start server
async function startServer() {
    try {
        // Connect to database
        await (0, database_js_1.connectDatabase)();
        app.listen(PORT, () => {
            console.log(`🚀 User Service running on port ${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/api/v1/health`);
            console.log(`📚 API docs: http://localhost:${PORT}/api/v1/docs`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully');
    process.exit(0);
});
startServer();
//# sourceMappingURL=index.js.map