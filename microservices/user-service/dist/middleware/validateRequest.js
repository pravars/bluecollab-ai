"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
function validateRequest(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                error: error.details[0].message
            });
            return;
        }
        next();
    };
}
//# sourceMappingURL=validateRequest.js.map