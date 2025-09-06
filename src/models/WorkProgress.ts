export interface WorkProgressUpdate {
  _id?: string;
  jobId: string;
  bidId: string;
  updatedBy: string; // User ID who made the update
  updatedByName: string; // User's name for display
  status: 'in_progress' | 'on_hold' | 'completed' | 'cancelled' | 'needs_attention';
  progress: number; // 0-100 percentage
  title: string; // Brief title of the update
  description: string; // Detailed description
  attachments?: string[]; // URLs to uploaded files/images
  timestamp: Date;
  isInternal?: boolean; // If true, only visible to service provider
}

export interface WorkProgressConversation {
  _id?: string;
  jobId: string;
  bidId: string;
  messages: WorkProgressMessage[];
  lastMessageAt: Date;
  participants: {
    homeowner: string; // User ID
    serviceProvider: string; // User ID
  };
}

export interface WorkProgressMessage {
  _id?: string;
  senderId: string;
  senderName: string;
  senderType: 'homeowner' | 'service_provider';
  content: string;
  timestamp: Date;
  attachments?: string[];
  isRead: boolean;
}

export interface CreateProgressUpdateRequest {
  jobId: string;
  bidId: string;
  status: WorkProgressUpdate['status'];
  progress: number;
  title: string;
  description: string;
  attachments?: string[];
  isInternal?: boolean;
}

export interface CreateMessageRequest {
  jobId: string;
  bidId: string;
  content: string;
  attachments?: string[];
}
