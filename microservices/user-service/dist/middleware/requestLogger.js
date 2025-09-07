"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
const logger_js_1 = require("../utils/logger.js");
function requestLogger(req, res, next) {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger_js_1.logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });
    next();
}
//# sourceMappingURL=requestLogger.js.map