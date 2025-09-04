// API service for communicating with the backend
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.dwello.com' 
  : 'http://localhost:3001';

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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
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
