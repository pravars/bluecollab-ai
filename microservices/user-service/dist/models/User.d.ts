import mongoose, { Document } from 'mongoose';
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
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map