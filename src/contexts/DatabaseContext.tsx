import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import apiService from '../services/api';

interface User {
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
  createdAt: Date;
}

interface DatabaseContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  connected: boolean;
  refreshUsers: () => Promise<void>;
  createUser: (userData: any) => Promise<void>;
  updateUser: (email: string, updateData: any) => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const connectToDatabase = async () => {
    try {
      setLoading(true);
      setError(null);
      const isConnected = await apiService.testConnection();
      if (isConnected) {
        setConnected(true);
        console.log('✅ API connection successful');
      } else {
        setConnected(false);
        setError('Unable to connect to backend API');
        console.warn('⚠️ API connection failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to API');
      setConnected(false);
      console.warn('⚠️ API connection failed, continuing without database:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUsers = async () => {
    if (!connected) return;
    
    try {
      setLoading(true);
      const response = await apiService.getUsers();
      if (response.success && response.data) {
        setUsers(response.data);
        console.log(`✅ Loaded ${response.data.length} users from API`);
      } else {
        setError(response.error || 'Failed to load users');
        console.error('❌ Failed to load users:', response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
      console.error('❌ Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: any) => {
    if (!connected) return;
    
    try {
      const response = await apiService.createUser(userData);
      if (response.success && response.data) {
        setUsers(prev => [...prev, response.data!]);
        console.log('✅ User created successfully');
      } else {
        setError(response.error || 'Failed to create user');
        console.error('❌ Failed to create user:', response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      console.error('❌ Failed to create user:', err);
    }
  };

  const updateUser = async (email: string, updateData: any) => {
    if (!connected) return;
    
    try {
      // Find user by email first
      const user = users.find(u => u.email === email);
      if (!user) {
        setError('User not found');
        return;
      }
      
      const response = await apiService.updateUser(user._id, updateData);
      if (response.success && response.data) {
        setUsers(prev => prev.map(u => u._id === user._id ? response.data! : u));
        console.log('✅ User updated successfully');
      } else {
        setError(response.error || 'Failed to update user');
        console.error('❌ Failed to update user:', response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      console.error('❌ Failed to update user:', err);
    }
  };

  useEffect(() => {
    connectToDatabase();
  }, []);

  useEffect(() => {
    if (connected) {
      refreshUsers();
    }
  }, [connected]);

  const value: DatabaseContextType = {
    users,
    loading,
    error,
    connected,
    refreshUsers,
    createUser,
    updateUser,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};
