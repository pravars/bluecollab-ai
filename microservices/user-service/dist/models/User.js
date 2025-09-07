"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
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
UserSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
exports.User = mongoose_1.default.model('User', UserSchema);
//# sourceMappingURL=User.js.map