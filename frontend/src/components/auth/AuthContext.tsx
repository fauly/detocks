import React, { createContext, useState, useEffect } from 'react';

interface AuthContextProps {
  isLoggedIn: boolean;
  userID: any;
  logIn: (user: any) => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  userID: null,
  logIn: () => {},
  logOut: () => {},
});

interface AuthProviderProps {
  children?: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('token'));
  const [userID, setUserID] = useState<any>(null);

  // ...

  // On load check if there is user data from local storage here
  useEffect(() => {
    const savedUser = localStorage.getItem('UID');
    if (savedUser) {
      setIsLoggedIn(true);
      setUserID(JSON.parse(savedUser));
    }
  }, []);

  const logIn = ({UID, token}: {UID: string; token: string; }) => {
    setIsLoggedIn(true);
    localStorage.setItem('UID', JSON.stringify(UID)); // Store user data in local storage
    localStorage.setItem('token', token);
  };

  const logOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token'); // Remove the token from local storage
    localStorage.removeItem('UID'); // Remove the user data from local storage
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, userID, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
