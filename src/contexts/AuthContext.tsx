
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the role type
export type UserRole = 'student' | 'admin' | null;

// Define the user interface
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

// Define the auth context interface
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  loginWithGoogle: (role: UserRole) => Promise<void>;
  loginWithMicrosoft: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock student and admin users for demo
const MOCK_USERS = {
  'student@example.com': {
    id: 's1',
    name: 'John Student',
    email: 'student@example.com',
    role: 'student' as UserRole,
    profileImage: 'https://ui-avatars.com/api/?name=John+Student&background=0E7490&color=fff',
  },
  'admin@example.com': {
    id: 'a1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin' as UserRole,
    profileImage: 'https://ui-avatars.com/api/?name=Admin+User&background=10B981&color=fff',
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock login function
  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = MOCK_USERS[email as keyof typeof MOCK_USERS];
      if (mockUser && mockUser.role === role) {
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock login with Google
  const loginWithGoogle = async (role: UserRole) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, we'll log in the user based on the role they selected
      const mockUser = role === 'student' 
        ? MOCK_USERS['student@example.com'] 
        : MOCK_USERS['admin@example.com'];
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock login with Microsoft
  const loginWithMicrosoft = async (role: UserRole) => {
    // Similar implementation to loginWithGoogle
    await loginWithGoogle(role); // Reuse the same function for demo
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      localStorage.removeItem('user');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    login,
    loginWithGoogle,
    loginWithMicrosoft,
    logout,
    isLoading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
