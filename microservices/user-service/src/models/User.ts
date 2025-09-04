import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: 'homeowner' | 'service_provider' | 'admin';
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  profileImageUrl?: string;
  timezone: string;
  language: string;
  profile: {
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
  };
  addresses: Array<{
    addressType: 'home' | 'business' | 'billing';
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    location: {
      type: 'Point';
      coordinates: [number, number];
    };
    isPrimary: boolean;
  }>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  userType: {
    type: String,
    enum: ['homeowner', 'service_provider', 'admin'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending_verification'],
    default: 'pending_verification'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date
  },
  profileImageUrl: {
    type: String
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  language: {
    type: String,
    default: 'en'
  },
  profile: {
    bio: String,
    companyName: String,
    website: String,
    yearsExperience: Number,
    specialties: [String],
    serviceAreas: {
      type: {
        type: String,
        enum: ['Polygon'],
        default: 'Polygon'
      },
      coordinates: [[[Number]]]
    },
    availabilitySchedule: {
      type: Map,
      of: {
        start: String,
        end: String
      }
    },
    emergencyAvailable: {
      type: Boolean,
      default: false
    },
    insuranceInfo: {
      provider: String,
      policyNumber: String,
      expirationDate: String
    },
    licenseInfo: {
      licenses: [{
        type: String,
        number: String,
        state: String,
        expirationDate: String
      }]
    }
  },
  addresses: [{
    addressType: {
      type: String,
      enum: ['home', 'business', 'billing'],
      required: true
    },
    streetAddress: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true,
  collection: 'users'
});

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ userType: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ createdAt: 1 });
UserSchema.index({ 'profile.serviceAreas': '2dsphere' });
UserSchema.index({ 'profile.specialties': 1 });

// Update the updatedAt field before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const User = mongoose.model<IUser>('User', UserSchema);
