'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthUser { 
  id: string; 
  email: string; 
  username: string; 
}

interface AuthSession { 
  messages: any[]; 
  profile: any; 
  recommendations: any[];
  profilingComplete: boolean;
  answeredQuestions: number;
}

interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('obsidian_token');
      
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setSession(data.session);
          setToken(storedToken);
          setIsAuthenticated(true);
        } else {
          // Token is invalid or expired
          localStorage.removeItem('obsidian_token');
          localStorage.removeItem('obsidian_user');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('obsidian_token');
        localStorage.removeItem('obsidian_user');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('obsidian_token');
    localStorage.removeItem('obsidian_user');
    setUser(null);
    setSession(null);
    setToken(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    session,
    token,
    isLoading,
    isAuthenticated,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
