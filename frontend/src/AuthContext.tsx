import React, { createContext, useState, useEffect } from 'react';

interface AuthContextProps {
  isLoggedIn: boolean;
  user: any;
  logIn: (user: any) => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  user: null,
  logIn: () => {},
  logOut: () => {},
});

interface AuthProviderProps {
  children?: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('token'));
  const [user, setUser] = useState<any>(null);

  // ...

  useEffect(() => {
    // load user data from local storage (or your preferred storage) here
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const logIn = (user: { id: string, usernameOrEmail: string }) => {
    setIsLoggedIn(true);
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user)); // Store user data in local storage
};


  
  const logOut = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
