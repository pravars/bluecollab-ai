"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createUserSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).required(),
    firstName: joi_1.default.string().min(2).max(50).required(),
    lastName: joi_1.default.string().min(2).max(50).required(),
    phone: joi_1.default.string().optional(),
    userType: joi_1.default.string().valid('homeowner', 'service_provider', 'admin').required(),
    profile: joi_1.default.object({
        bio: joi_1.default.string().optional(),
        companyName: joi_1.default.string().optional(),
        website: joi_1.default.string().uri().optional(),
        yearsExperience: joi_1.default.number().min(0).optional(),
        specialties: joi_1.default.array().items(joi_1.default.string()).optional(),
        emergencyAvailable: joi_1.default.boolean().optional()
    }).optional(),
    addresses: joi_1.default.array().items(joi_1.default.object({
        addressType: joi_1.default.string().valid('home', 'business', 'billing').required(),
        streetAddress: joi_1.default.string().required(),
        city: joi_1.default.string().required(),
        state: joi_1.default.string().required(),
        postalCode: joi_1.default.string().required(),
        country: joi_1.default.string().required(),
        isPrimary: joi_1.default.boolean().optional()
    })).optional()
});
exports.updateUserSchema = joi_1.default.object({
    firstName: joi_1.default.string().min(2).max(50).optional(),
    lastName: joi_1.default.string().min(2).max(50).optional(),
    phone: joi_1.default.string().optional(),
    profile: joi_1.default.object({
        bio: joi_1.default.string().optional(),
        companyName: joi_1.default.string().optional(),
        website: joi_1.default.string().uri().optional(),
        yearsExperience: joi_1.default.number().min(0).optional(),
        specialties: joi_1.default.array().items(joi_1.default.string()).optional(),
        emergencyAvailable: joi_1.default.boolean().optional()
    }).optional(),
    addresses: joi_1.default.array().items(joi_1.default.object({
        addressType: joi_1.default.string().valid('home', 'business', 'billing').required(),
        streetAddress: joi_1.default.string().required(),
        city: joi_1.default.string().required(),
        state: joi_1.default.string().required(),
        postalCode: joi_1.default.string().required(),
        country: joi_1.default.string().required(),
        isPrimary: joi_1.default.boolean().optional()
    })).optional()
});
exports.getUserSchema = joi_1.default.object({
    id: joi_1.default.string().required()
});
//# sourceMappingURL=userSchemas.js.map