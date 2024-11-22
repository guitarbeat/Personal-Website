import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const unlock = () => setIsUnlocked(true);

  return (
    <AuthContext.Provider value={{ isUnlocked, unlock }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
