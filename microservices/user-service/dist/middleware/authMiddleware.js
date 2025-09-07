"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_js_1 = require("../utils/logger.js");
function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'Access token required'
            });
            return;
        }
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const secret = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            userType: decoded.userType
        };
        next();
    }
    catch (error) {
        logger_js_1.logger.error('❌ Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
}
//# sourceMappingURL=authMiddleware.js.map