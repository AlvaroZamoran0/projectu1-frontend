import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    // Comprobar el estado de autenticación al cargar el componente
    const permiso = JSON.parse(localStorage.getItem('Permiso'));
    setIsLogin(!!permiso);
  }, []);

  const login_context = (permiso) => {
    localStorage.setItem('Permiso', JSON.stringify(permiso));
    setIsLogin(true);
  };

  const logout = () => {
    localStorage.clear();
    setIsLogin(false);
  };

  return (
    <AuthContext.Provider value={{ isLogin, login_context, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
