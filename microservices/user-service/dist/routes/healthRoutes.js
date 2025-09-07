"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const dbStatus = mongoose_1.default.connection.readyState === 1 ? 'connected' : 'disconnected';
        res.json({
            success: true,
            message: 'User Service is healthy',
            data: {
                service: 'user-service',
                status: 'healthy',
                timestamp: new Date().toISOString(),
                database: {
                    status: dbStatus,
                    name: mongoose_1.default.connection.db?.databaseName || 'unknown'
                },
                uptime: process.uptime()
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Health check failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=healthRoutes.js.map