import { ObjectId } from 'mongodb';
import { dbManager } from '../config/database';
import { 
  User, 
  CreateUserInput, 
  UpdateUserInput, 
  UserFilters, 
  UserStats 
} from '../models/User';
import bcrypt from 'bcrypt';

export class UserService {
  private collection = dbManager.getCollection<User>('users');

  // Create a new user
  async createUser(input: CreateUserInput): Promise<User> {
    try {
      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(input.password, saltRounds);

      const user: Omit<User, '_id'> = {
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        userType: input.userType,
        status: 'pending_verification',
        emailVerified: false,
        phoneVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        profileImageUrl: undefined,
        timezone: 'UTC',
        language: 'en',
        profile: {
          specialties: [],
          serviceAreas: {
            type: 'Polygon',
            coordinates: []
          },
          availabilitySchedule: {},
          emergencyAvailable: false,
          ...input.profile
        },
        addresses: input.addresses || []
      };

      const result = await this.collection.insertOne(user as User);
      return { ...user, _id: result.insertedId };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Get user by ID
  async getUserById(id: ObjectId): Promise<User | null> {
    try {
      return await this.collection.findOne({ _id: id });
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.collection.findOne({ email });
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  // Update user
  async updateUser(id: ObjectId, input: UpdateUserInput): Promise<User | null> {
    try {
      const updateData = {
        ...input,
        updatedAt: new Date()
      };

      const result = await this.collection.findOneAndUpdate(
        { _id: id },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      return result;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete user (soft delete)
  async deleteUser(id: ObjectId): Promise<boolean> {
    try {
      const result = await this.collection.updateOne(
        { _id: id },
        { $set: { status: 'inactive', updatedAt: new Date() } }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Search users with filters
  async searchUsers(filters: UserFilters): Promise<User[]> {
    try {
      const query: any = {};

      // Apply filters
      if (filters.userType) query.userType = filters.userType;
      if (filters.status) query.status = filters.status;
      if (filters.emailVerified !== undefined) query.emailVerified = filters.emailVerified;
      if (filters.phoneVerified !== undefined) query.phoneVerified = filters.phoneVerified;

      // Location filter
      if (filters.location) {
        query['profile.serviceAreas'] = {
          $geoIntersects: {
            $geometry: {
              type: 'Point',
              coordinates: filters.location.coordinates
            }
          }
        };
      }

      // Specialties filter
      if (filters.specialties && filters.specialties.length > 0) {
        query['profile.specialties'] = { $in: filters.specialties };
      }

      // Text search
      if (filters.search) {
        query.$or = [
          { firstName: { $regex: filters.search, $options: 'i' } },
          { lastName: { $regex: filters.search, $options: 'i' } },
          { email: { $regex: filters.search, $options: 'i' } },
          { 'profile.companyName': { $regex: filters.search, $options: 'i' } }
        ];
      }

      const options: any = {
        limit: filters.limit || 20,
        skip: filters.offset || 0
      };

      return await this.collection.find(query, options).toArray();
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  // Get nearby service providers
  async getNearbyProviders(
    coordinates: [number, number], 
    maxDistance: number = 10000, // 10km default
    specialties?: string[]
  ): Promise<User[]> {
    try {
      const query: any = {
        userType: 'service_provider',
        status: 'active',
        'profile.serviceAreas': {
          $geoIntersects: {
            $geometry: {
              type: 'Point',
              coordinates
            }
          }
        }
      };

      if (specialties && specialties.length > 0) {
        query['profile.specialties'] = { $in: specialties };
      }

      return await this.collection.find(query).toArray();
    } catch (error) {
      console.error('Error getting nearby providers:', error);
      throw error;
    }
  }

  // Verify user credentials
  async verifyCredentials(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.getUserByEmail(email);
      if (!user) return null;

      const isValid = await bcrypt.compare(password, user.passwordHash);
      return isValid ? user : null;
    } catch (error) {
      console.error('Error verifying credentials:', error);
      throw error;
    }
  }

  // Update last login
  async updateLastLogin(id: ObjectId): Promise<void> {
    try {
      await this.collection.updateOne(
        { _id: id },
        { $set: { lastLoginAt: new Date() } }
      );
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  }

  // Get user statistics
  async getUserStats(): Promise<UserStats> {
    try {
      const pipeline = [
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            activeUsers: {
              $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
            },
            homeowners: {
              $sum: { $cond: [{ $eq: ['$userType', 'homeowner'] }, 1, 0] }
            },
            serviceProviders: {
              $sum: { $cond: [{ $eq: ['$userType', 'service_provider'] }, 1, 0] }
            },
            verifiedUsers: {
              $sum: { $cond: [{ $eq: ['$emailVerified', true] }, 1, 0] }
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalUsers: 1,
            activeUsers: 1,
            homeowners: 1,
            serviceProviders: 1,
            verifiedUsers: 1,
            newUsersThisMonth: 0 // Will be calculated separately
          }
        }
      ];

      const result = await this.collection.aggregate(pipeline).toArray();
      const stats = result[0] || {
        totalUsers: 0,
        activeUsers: 0,
        homeowners: 0,
        serviceProviders: 0,
        verifiedUsers: 0
      };

      // Calculate new users this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const newUsersThisMonth = await this.collection.countDocuments({
        createdAt: { $gte: startOfMonth }
      });

      return {
        ...stats,
        newUsersThisMonth
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  // Verify email
  async verifyEmail(id: ObjectId): Promise<boolean> {
    try {
      const result = await this.collection.updateOne(
        { _id: id },
        { $set: { emailVerified: true, updatedAt: new Date() } }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  }

  // Verify phone
  async verifyPhone(id: ObjectId): Promise<boolean> {
    try {
      const result = await this.collection.updateOne(
        { _id: id },
        { $set: { phoneVerified: true, updatedAt: new Date() } }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error verifying phone:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
