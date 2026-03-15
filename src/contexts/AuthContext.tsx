import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  avatar?: string;
  department?: string;
  designation?: string;
  is_active?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  users: User[];
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demonstration - in production, these would come from your database
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Durva Badekar',
    email: 'student@example.com',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    is_active: true
  },
  {
    id: '2',
    name: 'Dr. Kate Morrison',
    email: 'faculty@example.com',
    role: 'faculty',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    department: 'Information Technology',
    designation: 'HOD - IT',
    is_active: true
  },
  {
    id: '3',
    name: 'System Administrator',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    department: 'Administration',
    designation: 'System Admin',
    is_active: true
  },
  {
    id: '4',
    name: 'Dr. Aliah Lane',
    email: 'aliah.lane@example.com',
    role: 'faculty',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    department: 'Computer Science',
    designation: 'Professor',
    is_active: true
  },
  {
    id: '5',
    name: 'Dr. Andi Lane',
    email: 'andi.lane@example.com',
    role: 'faculty',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    department: 'AIDS',
    designation: 'Associate Professor',
    is_active: true
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('lor_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const refreshUsers = async () => {
    try {
      // In production, fetch from database
      // const fetchedUsers = await dbService.getUsers();
      // setUsers(fetchedUsers);
      
      // For now, use mock data
      setUsers([...mockUsers]);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = users.find(u => u.email === email && u.is_active);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('lor_user', JSON.stringify(foundUser));
    } else {
      throw new Error('Invalid credentials or account deactivated');
    }
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lor_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, users, refreshUsers }}>
      {children}
    </AuthContext.Provider>
  );
};