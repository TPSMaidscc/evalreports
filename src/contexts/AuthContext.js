import React, { createContext, useContext, useState, useEffect } from 'react';
import { APPROVED_EMAILS } from '../utils/constants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('maids_dashboard_user');
        const storedToken = localStorage.getItem('maids_dashboard_token');
        const storedExpiry = localStorage.getItem('maids_dashboard_expiry');
        
        if (storedUser && storedToken && storedExpiry) {
          const userData = JSON.parse(storedUser);
          const expiryTime = parseInt(storedExpiry);
          const currentTime = Date.now();
          
          // Check if session has expired (24 hours)
          if (currentTime > expiryTime) {
            console.log('Session expired, clearing storage');
            clearSession();
            return;
          }
          
          // Validate that the user has an approved email
          if (userData.email && (userData.email.endsWith('@maids.cc') || APPROVED_EMAILS.includes(userData.email))) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Clear invalid session
            clearSession();
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const signIn = (userInfo) => {
    try {
      // Calculate expiry time (24 hours from now)
      const expiryTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours in milliseconds
      
      // Store user info, token, and expiry time
      localStorage.setItem('maids_dashboard_user', JSON.stringify({
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      }));
      localStorage.setItem('maids_dashboard_token', userInfo.token);
      localStorage.setItem('maids_dashboard_expiry', expiryTime.toString());
      
      setUser({
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error storing user session:', error);
      throw new Error('Failed to save session');
    }
  };

  const signOut = () => {
    clearSession();
    
    // Sign out from Google
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  const clearSession = () => {
    localStorage.removeItem('maids_dashboard_user');
    localStorage.removeItem('maids_dashboard_token');
    localStorage.removeItem('maids_dashboard_expiry');
    setUser(null);
    setIsAuthenticated(false);
  };

  const getToken = () => {
    return localStorage.getItem('maids_dashboard_token');
  };

  const isValidApprovedEmail = (email) => {
    return email && (email.endsWith('@maids.cc') || APPROVED_EMAILS.includes(email));
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
    getToken,
    isValidApprovedEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 