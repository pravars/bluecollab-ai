import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import { logger } from '../utils/logger.js';
import { ApiResponse } from '../types/ApiResponse.js';

export class UserController {
  // Create a new user
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName, phone, userType, profile, addresses } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        } as ApiResponse);
        return;
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = new User({
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
      const token = jwt.sign(
        { userId: user._id, email: user.email, userType: user.userType },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      logger.info(`✅ User created: ${user.email}`);

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
      } as ApiResponse);
    } catch (error) {
      logger.error('❌ Error creating user:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse);
    }
  }

  // Login user
  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        } as ApiResponse);
        return;
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        } as ApiResponse);
        return;
      }

      // Check if user is active
      if (user.status !== 'active') {
        res.status(401).json({
          success: false,
          message: 'Account is not active'
        } as ApiResponse);
        return;
      }

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email, userType: user.userType },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      logger.info(`✅ User logged in: ${user.email}`);

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
      } as ApiResponse);
    } catch (error) {
      logger.error('❌ Error logging in user:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse);
    }
  }

  // Get user profile
  async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const user = await User.findById(userId).select('-passwordHash');

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: { user }
      } as ApiResponse);
    } catch (error) {
      logger.error('❌ Error getting user profile:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse);
    }
  }

  // Update user profile
  async updateUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const updateData = req.body;

      const user = await User.findByIdAndUpdate(
        userId,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).select('-passwordHash');

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        } as ApiResponse);
        return;
      }

      logger.info(`✅ User profile updated: ${user.email}`);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user }
      } as ApiResponse);
    } catch (error) {
      logger.error('❌ Error updating user profile:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse);
    }
  }

  // Get user by ID
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findById(id).select('-passwordHash');

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: { user }
      } as ApiResponse);
    } catch (error) {
      logger.error('❌ Error getting user by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse);
    }
  }

  // Update user
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const user = await User.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).select('-passwordHash');

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        } as ApiResponse);
        return;
      }

      logger.info(`✅ User updated: ${user.email}`);

      res.json({
        success: true,
        message: 'User updated successfully',
        data: { user }
      } as ApiResponse);
    } catch (error) {
      logger.error('❌ Error updating user:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse);
    }
  }

  // Delete user (soft delete)
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await User.findByIdAndUpdate(
        id,
        { status: 'inactive', updatedAt: new Date() },
        { new: true }
      );

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        } as ApiResponse);
        return;
      }

      logger.info(`✅ User deleted: ${user.email}`);

      res.json({
        success: true,
        message: 'User deleted successfully'
      } as ApiResponse);
    } catch (error) {
      logger.error('❌ Error deleting user:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse);
    }
  }

  // Get users with filters
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const { userType, status, limit = 20, offset = 0 } = req.query;

      const query: any = {};
      if (userType) query.userType = userType;
      if (status) query.status = status;

      const users = await User.find(query)
        .select('-passwordHash')
        .limit(Number(limit))
        .skip(Number(offset))
        .sort({ createdAt: -1 });

      const total = await User.countDocuments(query);

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
      } as ApiResponse);
    } catch (error) {
      logger.error('❌ Error getting users:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse);
    }
  }

  // Verify email
  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;
      // Implementation for email verification
      res.json({
        success: true,
        message: 'Email verification not implemented yet'
      } as ApiResponse);
    } catch (error) {
      logger.error('❌ Error verifying email:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse);
    }
  }

  // Verify phone
  async verifyPhone(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.body;
      // Implementation for phone verification
      res.json({
        success: true,
        message: 'Phone verification not implemented yet'
      } as ApiResponse);
    } catch (error) {
      logger.error('❌ Error verifying phone:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse);
    }
  }

  // Change password
  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        } as ApiResponse);
        return;
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValidPassword) {
        res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        } as ApiResponse);
        return;
      }

      // Hash new password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      user.passwordHash = passwordHash;
      user.updatedAt = new Date();
      await user.save();

      logger.info(`✅ Password changed for user: ${user.email}`);

      res.json({
        success: true,
        message: 'Password changed successfully'
      } as ApiResponse);
    } catch (error) {
      logger.error('❌ Error changing password:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse);
    }
  }

  // Forgot password
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      // Implementation for forgot password
      res.json({
        success: true,
        message: 'Forgot password not implemented yet'
      } as ApiResponse);
    } catch (error) {
      logger.error('❌ Error processing forgot password:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse);
    }
  }

  // Reset password
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;
      // Implementation for reset password
      res.json({
        success: true,
        message: 'Reset password not implemented yet'
      } as ApiResponse);
    } catch (error) {
      logger.error('❌ Error resetting password:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse);
    }
  }
}
