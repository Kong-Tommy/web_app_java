import { createContext, useContext, useState } from 'react';

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('customerToken'));

  const login = (newToken) => {
    localStorage.setItem('customerToken', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('customerToken');
    setToken(null);
  };

  return (
    <CustomerAuthContext.Provider value={{ token, isLoggedIn: !!token, login, logout }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  return useContext(CustomerAuthContext);
}
