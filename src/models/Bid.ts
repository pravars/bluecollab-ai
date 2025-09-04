import { Document, ObjectId } from 'mongodb';

// Bid Types
export type BidStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn' | 'expired';

// Bid Timeline
export interface BidTimeline {
  days: number;
  startDate: Date;
  endDate: Date;
}

// Bid Pricing
export interface BidPricing {
  laborCost: number;
  materialsCost: number;
  materialsIncluded: boolean;
  totalCost: number;
}

// Material Item
export interface MaterialItem {
  storeName: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  storeUrl?: string;
}

// Bid Warranty
export interface BidWarranty {
  months: number;
  description: string;
}

// Bid Document
export interface Bid extends Document {
  _id: ObjectId;
  jobId: ObjectId;
  providerId: ObjectId;
  bidAmount: number;
  timeline: BidTimeline;
  description: string;
  status: BidStatus;
  pricing: BidPricing;
  materials: MaterialItem[];
  warranty: BidWarranty;
  specialTerms?: string;
  submittedAt: Date;
  expiresAt: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Bid Creation Input
export interface CreateBidInput {
  jobId: ObjectId;
  providerId: ObjectId;
  bidAmount: number;
  timeline: BidTimeline;
  description: string;
  pricing: BidPricing;
  materials: MaterialItem[];
  warranty: BidWarranty;
  specialTerms?: string;
}

// Bid Update Input
export interface UpdateBidInput {
  bidAmount?: number;
  timeline?: Partial<BidTimeline>;
  description?: string;
  status?: BidStatus;
  pricing?: Partial<BidPricing>;
  materials?: MaterialItem[];
  warranty?: Partial<BidWarranty>;
  specialTerms?: string;
}

// Bid Query Filters
export interface BidFilters {
  jobId?: ObjectId;
  providerId?: ObjectId;
  status?: BidStatus;
  bidAmountMin?: number;
  bidAmountMax?: number;
  submittedAfter?: Date;
  submittedBefore?: Date;
  limit?: number;
  offset?: number;
}

// Bid Statistics
export interface BidStats {
  totalBids: number;
  pendingBids: number;
  acceptedBids: number;
  rejectedBids: number;
  averageBidAmount: number;
  averageResponseTime: number; // in hours
  winRate: number; // percentage
  bidsByProvider: Array<{
    providerId: ObjectId;
    providerName: string;
    bidCount: number;
    winRate: number;
  }>;
}
