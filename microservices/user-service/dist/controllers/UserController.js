"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_js_1 = require("../models/User.js");
const logger_js_1 = require("../utils/logger.js");
class UserController {
    // Create a new user
    async createUser(req, res) {
        try {
            const { email, password, firstName, lastName, phone, userType, profile, addresses } = req.body;
            // Check if user already exists
            const existingUser = await User_js_1.User.findOne({ email });
            if (existingUser) {
                res.status(400).json({
                    success: false,
                    message: 'User with this email already exists'
                });
                return;
            }
            // Hash password
            const saltRounds = 12;
            const passwordHash = await bcryptjs_1.default.hash(password, saltRounds);
            // Create user
            const user = new User_js_1.User({
                email,
                passwordHash,
                firstName,
                lastName,
                phone,
                userType,
                profile: {
                    specialties: [],
                    serviceAreas: {
                        type: 'Polygon',
                        coordinates: []
                    },
                    availabilitySchedule: {},
                    emergencyAvailable: false,
                    ...profile
                },
                addresses: addresses || []
            });
            await user.save();
            // Generate JWT token
            const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email, userType: user.userType }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
            logger_js_1.logger.info(`✅ User created: ${user.email}`);
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        userType: user.userType,
                        status: user.status,
                        emailVerified: user.emailVerified,
                        phoneVerified: user.phoneVerified,
                        createdAt: user.createdAt
                    },
                    token
                }
            });
        }
        catch (error) {
            logger_js_1.logger.error('❌ Error creating user:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    // Login user
    async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            // Find user by email
            const user = await User_js_1.User.findOne({ email });
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
                return;
            }
            // Check password
            const isValidPassword = await bcryptjs_1.default.compare(password, user.passwordHash);
            if (!isValidPassword) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
                return;
            }
            // Check if user is active
            if (user.status !== 'active') {
                res.status(401).json({
                    success: false,
                    message: 'Account is not active'
                });
                return;
            }
            // Update last login
            user.lastLoginAt = new Date();
            await user.save();
            // Generate JWT token
            const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email, userType: user.userType }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
            logger_js_1.logger.info(`✅ User logged in: ${user.email}`);
            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        userType: user.userType,
                        status: user.status,
                        emailVerified: user.emailVerified,
                        phoneVerified: user.phoneVerified,
                        lastLoginAt: user.lastLoginAt
                    },
                    token
                }
            });
        }
        catch (error) {
            logger_js_1.logger.error('❌ Error logging in user:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    // Get user profile
    async getUserProfile(req, res) {
        try {
            const userId = req.user.userId;
            const user = await User_js_1.User.findById(userId).select('-passwordHash');
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }
            res.json({
                success: true,
                data: { user }
            });
        }
        catch (error) {
            logger_js_1.logger.error('❌ Error getting user profile:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    // Update user profile
    async updateUserProfile(req, res) {
        try {
            const userId = req.user.userId;
            const updateData = req.body;
            const user = await User_js_1.User.findByIdAndUpdate(userId, { ...updateData, updatedAt: new Date() }, { new: true, runValidators: true }).select('-passwordHash');
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }
            logger_js_1.logger.info(`✅ User profile updated: ${user.email}`);
            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: { user }
            });
        }
        catch (error) {
            logger_js_1.logger.error('❌ Error updating user profile:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    // Get user by ID
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await User_js_1.User.findById(id).select('-passwordHash');
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }
            res.json({
                success: true,
                data: { user }
            });
        }
        catch (error) {
            logger_js_1.logger.error('❌ Error getting user by ID:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    // Update user
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const user = await User_js_1.User.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true, runValidators: true }).select('-passwordHash');
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }
            logger_js_1.logger.info(`✅ User updated: ${user.email}`);
            res.json({
                success: true,
                message: 'User updated successfully',
                data: { user }
            });
        }
        catch (error) {
            logger_js_1.logger.error('❌ Error updating user:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    // Delete user (soft delete)
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const user = await User_js_1.User.findByIdAndUpdate(id, { status: 'inactive', updatedAt: new Date() }, { new: true });
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }
            logger_js_1.logger.info(`✅ User deleted: ${user.email}`);
            res.json({
                success: true,
                message: 'User deleted successfully'
            });
        }
        catch (error) {
            logger_js_1.logger.error('❌ Error deleting user:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    // Get users with filters
    async getUsers(req, res) {
        try {
            const { userType, status, limit = 20, offset = 0 } = req.query;
            const query = {};
            if (userType)
                query.userType = userType;
            if (status)
                query.status = status;
            const users = await User_js_1.User.find(query)
                .select('-passwordHash')
                .limit(Number(limit))
                .skip(Number(offset))
                .sort({ createdAt: -1 });
            const total = await User_js_1.User.countDocuments(query);
            res.json({
                success: true,
                data: {
                    users,
                    pagination: {
                        total,
                        limit: Number(limit),
                        offset: Number(offset),
                        pages: Math.ceil(total / Number(limit))
                    }
                }
            });
        }
        catch (error) {
            logger_js_1.logger.error('❌ Error getting users:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    // Verify email
    async verifyEmail(req, res) {
        try {
            const { token } = req.body;
            // Implementation for email verification
            res.json({
                success: true,
                message: 'Email verification not implemented yet'
            });
        }
        catch (error) {
            logger_js_1.logger.error('❌ Error verifying email:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    // Verify phone
    async verifyPhone(req, res) {
        try {
            const { code } = req.body;
            // Implementation for phone verification
            res.json({
                success: true,
                message: 'Phone verification not implemented yet'
            });
        }
        catch (error) {
            logger_js_1.logger.error('❌ Error verifying phone:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    // Change password
    async changePassword(req, res) {
        try {
            const userId = req.user.userId;
            const { currentPassword, newPassword } = req.body;
            const user = await User_js_1.User.findById(userId);
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }
            // Verify current password
            const isValidPassword = await bcryptjs_1.default.compare(currentPassword, user.passwordHash);
            if (!isValidPassword) {
                res.status(400).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
                return;
            }
            // Hash new password
            const saltRounds = 12;
            const passwordHash = await bcryptjs_1.default.hash(newPassword, saltRounds);
            // Update password
            user.passwordHash = passwordHash;
            user.updatedAt = new Date();
            await user.save();
            logger_js_1.logger.info(`✅ Password changed for user: ${user.email}`);
            res.json({
                success: true,
                message: 'Password changed successfully'
            });
        }
        catch (error) {
            logger_js_1.logger.error('❌ Error changing password:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    // Forgot password
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            // Implementation for forgot password
            res.json({
                success: true,
                message: 'Forgot password not implemented yet'
            });
        }
        catch (error) {
            logger_js_1.logger.error('❌ Error processing forgot password:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    // Reset password
    async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;
            // Implementation for reset password
            res.json({
                success: true,
                message: 'Reset password not implemented yet'
            });
        }
        catch (error) {
            logger_js_1.logger.error('❌ Error resetting password:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map