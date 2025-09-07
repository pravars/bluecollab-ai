"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logger_js_1 = require("../utils/logger.js");
function errorHandler(error, req, res, next) {
    logger_js_1.logger.error('❌ Unhandled error:', error);
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
}
//# sourceMappingURL=errorHandler.js.map