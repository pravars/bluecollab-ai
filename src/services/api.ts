// API service for communicating with the backend
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.dwello.com' 
  : 'http://localhost:3002';

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'homeowner' | 'service_provider' | 'admin';
  status: string;
  profile: {
    bio?: string;
    companyName?: string;
    specialties?: string[];
    yearsExperience?: number;
  };
  addresses: Array<{
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
  }>;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      // Check if response has content before trying to parse JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('Failed to parse JSON response:', jsonError);
          return {
            success: false,
            error: 'Invalid JSON response from server',
            message: 'Server returned invalid data'
          };
        }
      } else {
        // Handle non-JSON responses
        const text = await response.text();
        return {
          success: false,
          error: `Server returned ${response.status}: ${text}`,
          message: 'Unexpected response format'
        };
      }
      
      if (!response.ok) {
        // Return the error response from the backend instead of throwing
        return {
          success: false,
          error: data.error || `HTTP error! status: ${response.status}`,
          message: data.message
        };
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request('/health');
  }

  // ==================== JOB METHODS ====================

  // Create a new job posting
  async createJob(jobData: any): Promise<ApiResponse<any>> {
    return this.request('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData)
    });
  }

  // Get all jobs
  async getJobs(filters?: { status?: string; serviceType?: string; limit?: number; skip?: number }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.serviceType) queryParams.append('serviceType', filters.serviceType);
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    if (filters?.skip) queryParams.append('skip', filters.skip.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/jobs?${queryString}` : '/api/jobs';
    return this.request(endpoint);
  }

  // Get jobs posted by a specific user
  async getUserJobs(userId: string): Promise<ApiResponse<any[]>> {
    return this.request(`/api/jobs/user/${userId}`);
  }

  // Get a specific job by ID
  async getJob(jobId: string): Promise<ApiResponse<any>> {
    return this.request(`/api/jobs/${jobId}`);
  }

  // Update job status
  async updateJobStatus(jobId: string, status: string, acceptedBid?: string): Promise<ApiResponse<any>> {
    return this.request(`/api/jobs/${jobId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, acceptedBid })
    });
  }

  // ==================== BID METHODS ====================

  // Create a new bid
  async createBid(bidData: any): Promise<ApiResponse<any>> {
    return this.request('/api/bids', {
      method: 'POST',
      body: JSON.stringify(bidData)
    });
  }

  // Get bids for a specific job
  async getJobBids(jobId: string): Promise<ApiResponse<any[]>> {
    return this.request(`/api/jobs/${jobId}/bids`);
  }

  // Get bids by a specific bidder
  async getBidderBids(bidderId: string): Promise<ApiResponse<any[]>> {
    return this.request(`/api/bids/bidder/${bidderId}`);
  }

  // Accept a bid
  async acceptBid(bidId: string): Promise<ApiResponse<any>> {
    return this.request(`/api/bids/${bidId}/accept`, {
      method: 'PUT'
    });
  }

  // User operations
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request('/api/users');
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.request(`/api/users/${id}`);
  }

  async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request(`/api/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Search operations
  async searchUsers(query: string): Promise<ApiResponse<User[]>> {
    return this.request(`/api/users/search?q=${encodeURIComponent(query)}`);
  }

  async getUsersByType(userType: string): Promise<ApiResponse<User[]>> {
    return this.request(`/api/users/type/${userType}`);
  }

  // Database operations
  async getDatabaseStats(): Promise<ApiResponse<{
    totalUsers: number;
    usersByType: Record<string, number>;
    lastUpdated: string;
  }>> {
    return this.request('/api/database/stats');
  }

  // Authentication
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    userType?: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.healthCheck();
      return response.success;
    } catch {
      return false;
    }
  }
}

export default new ApiService();
