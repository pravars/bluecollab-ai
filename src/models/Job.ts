export interface Job {
  _id?: string;
  title: string;
  description: string;
  serviceType: string;
  scope: string;
  timeline: string;
  budget: string;
  location: string;
  urgency: 'low' | 'medium' | 'high';
  specialRequirements: string[];
  estimatedDuration: string;
  skillsRequired: string[];
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  postedBy: string; // User ID
  acceptedBid?: string; // Bid ID
  createdAt: string;
  updatedAt: string;
  bids?: Bid[];
  posterInfo?: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface Bid {
  _id?: string;
  jobId: string;
  bidderId: string; // Service Provider ID
  amount: number;
  timeline: string;
  description: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
  bidderInfo?: {
    name: string;
    email: string;
    phone?: string;
    rating?: number;
    reviewCount?: number;
  };
}

export interface CreateJobRequest {
  title: string;
  description: string;
  serviceType: string;
  scope: string;
  timeline: string;
  budget: string;
  location: string;
  urgency: 'low' | 'medium' | 'high';
  specialRequirements: string[];
  estimatedDuration: string;
  skillsRequired: string[];
}

export interface CreateBidRequest {
  jobId: string;
  amount: number;
  timeline: string;
  description: string;
}