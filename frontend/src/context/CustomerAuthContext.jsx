import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getProfile } from '../api/customerProfile';

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('customerToken'));
  const [profile, setProfile] = useState(null);
  const isLoggedIn = !!token;

  const refreshProfile = useCallback(async () => {
    if (!isLoggedIn) {
      setProfile(null);
      return;
    }
    try {
      const data = await getProfile();
      setProfile(data);
    } catch {
      setProfile(null);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const login = (newToken) => {
    localStorage.setItem('customerToken', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('customerToken');
    setToken(null);
    setProfile(null);
  };

  return (
    <CustomerAuthContext.Provider value={{ token, isLoggedIn, profile, login, logout, refreshProfile }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  return useContext(CustomerAuthContext);
}
