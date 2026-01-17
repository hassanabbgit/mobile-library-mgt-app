import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axios';
import { useRouter } from 'expo-router';

type User = {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, isAdmin?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string, isAdmin = false) => {
    try {
      const url = isAdmin ? '/auth/admin/login' : '/auth/login';
      const res = await api.post(url, { email, password });
      await AsyncStorage.setItem('token', res.data.token);
      setUser(res.data.user);

      if (res.data.user.role === 'admin') {
        router.replace('/(admin)/(tabs)');
      } else {
        router.replace('/(user)/(tabs)');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
    router.replace('/(auth)/login');
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    try {
      const res = await api.post('/auth/register-user', data);
      // Registration successful, return success
      return res.data;
    } catch (err: any) {
      // Return the error so the page can display it
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  };

  /*const loadUser = async () => {
    try {
      const res = await api.get('/users/me');
      setUser(res.data);
    } catch {
      router.replace('/(auth)/login');
    } finally {
      setLoading(false);
    }
  };*/

  /*
  const loadUser = async () => {
    try {
      console.log('Checking existing session...');
      const res = await api.get('/users/me');
      setUser(res.data);

      if (res.data.role === 'admin') {
        router.replace('/(admin)/(tabs)');
      } else {
        router.replace('/(user)/(tabs)');
      }
    } catch {
      // ❌ do NOTHING
      // stay on homepage if not logged in
    } finally {
      setLoading(false);
    }
  };
  */

  const loadUser = async () => {
    try {
      console.log('Checking existing session...');
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await api.get('/users/me');
      setUser(res.data);
    } catch (err) {
      await AsyncStorage.removeItem('token');
      setUser(null);
      router.replace('/(auth)/login');
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
