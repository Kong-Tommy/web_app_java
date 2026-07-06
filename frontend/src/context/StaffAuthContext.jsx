import { createContext, useContext, useState } from 'react';

const StaffAuthContext = createContext(null);

export function StaffAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('staffToken'));
  const [role, setRole] = useState(() => localStorage.getItem('staffRole'));

  const login = (newToken, newRole) => {
    localStorage.setItem('staffToken', newToken);
    localStorage.setItem('staffRole', newRole);
    setToken(newToken);
    setRole(newRole);
  };

  const logout = () => {
    localStorage.removeItem('staffToken');
    localStorage.removeItem('staffRole');
    setToken(null);
    setRole(null);
  };

  return (
    <StaffAuthContext.Provider value={{ token, role, isLoggedIn: !!token, login, logout }}>
      {children}
    </StaffAuthContext.Provider>
  );
}

export function useStaffAuth() {
  return useContext(StaffAuthContext);
}
