import { Document, ObjectId } from 'mongodb';

// Job Types
export type JobStatus = 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
export type JobUrgency = 'low' | 'medium' | 'high' | 'urgent';

// Service Category
export interface ServiceCategory {
  id: ObjectId;
  name: string;
  subcategory?: string;
}

// Job Location
export interface JobLocation {
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
  radius: number; // in miles
}

// Job Timeline
export interface JobTimeline {
  preferredStartDate: Date;
  preferredEndDate: Date;
  estimatedDurationHours: number;
}

// Job Requirements
export interface JobRequirements {
  materialsProvided: boolean;
  materialsDescription?: string;
  specialRequirements?: string;
  mandatoryRequirements: string[];
}

// Job Document
export interface Job extends Document {
  _id: ObjectId;
  homeownerId: ObjectId;
  title: string;
  description: string;
  category: ServiceCategory;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  urgency: JobUrgency;
  status: JobStatus;
  location: JobLocation;
  timeline: JobTimeline;
  requirements: JobRequirements;
  photos: string[];
  isEmergency: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  completedAt?: Date;
}

// Job Creation Input
export interface CreateJobInput {
  homeownerId: ObjectId;
  title: string;
  description: string;
  categoryId: ObjectId;
  subcategory?: string;
  budgetMin: number;
  budgetMax: number;
  urgency: JobUrgency;
  location: JobLocation;
  timeline: JobTimeline;
  requirements: JobRequirements;
  photos?: string[];
  isEmergency?: boolean;
}

// Job Update Input
export interface UpdateJobInput {
  title?: string;
  description?: string;
  budgetMin?: number;
  budgetMax?: number;
  urgency?: JobUrgency;
  status?: JobStatus;
  timeline?: Partial<JobTimeline>;
  requirements?: Partial<JobRequirements>;
  photos?: string[];
  isEmergency?: boolean;
}

// Job Query Filters
export interface JobFilters {
  homeownerId?: ObjectId;
  categoryId?: ObjectId;
  status?: JobStatus;
  urgency?: JobUrgency;
  location?: {
    coordinates: [number, number];
    maxDistance: number; // in meters
  };
  budgetMin?: number;
  budgetMax?: number;
  isEmergency?: boolean;
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  limit?: number;
  offset?: number;
}

// Job Statistics
export interface JobStats {
  totalJobs: number;
  openJobs: number;
  inProgressJobs: number;
  completedJobs: number;
  averageJobValue: number;
  jobsByCategory: Array<{
    category: string;
    count: number;
  }>;
  jobsByUrgency: Array<{
    urgency: string;
    count: number;
  }>;
}
