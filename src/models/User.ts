import { Document, ObjectId } from 'mongodb';

// User Types
export type UserType = 'homeowner' | 'service_provider' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';

// Address Types
export interface Address {
  addressType: 'home' | 'business' | 'billing';
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  isPrimary: boolean;
}

// Profile Types
export interface UserProfile {
  bio?: string;
  companyName?: string;
  website?: string;
  yearsExperience?: number;
  specialties: string[];
  serviceAreas: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  availabilitySchedule: {
    [key: string]: {
      start: string;
      end: string;
    };
  };
  emergencyAvailable: boolean;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    expirationDate: string;
  };
  licenseInfo?: {
    licenses: Array<{
      type: string;
      number: string;
      state: string;
      expirationDate: string;
    }>;
  };
}

// Main User Document
export interface User extends Document {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: UserType;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  profileImageUrl?: string;
  timezone: string;
  language: string;
  profile: UserProfile;
  addresses: Address[];
}

// User Creation Input
export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: UserType;
  profile?: Partial<UserProfile>;
  addresses?: Partial<Address>[];
}

// User Update Input
export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  profile?: Partial<UserProfile>;
  addresses?: Partial<Address>[];
  profileImageUrl?: string;
  timezone?: string;
  language?: string;
}

// User Query Filters
export interface UserFilters {
  userType?: UserType;
  status?: UserStatus;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  location?: {
    coordinates: [number, number];
    maxDistance: number; // in meters
  };
  specialties?: string[];
  search?: string;
  limit?: number;
  offset?: number;
}

// User Statistics
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  homeowners: number;
  serviceProviders: number;
  newUsersThisMonth: number;
  verifiedUsers: number;
}
