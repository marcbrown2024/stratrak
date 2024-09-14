"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, getUserFromDb } from "@/firebase";

// Define the context type
interface AuthContextType {
  user: User;
  loading: boolean;
  isAuthenticated: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const [userFromDb, setUserFromDb] = useState<User>();
  const currentPathname = usePathname();

  // fetch user from db and set that as the user
  useEffect(() => {
    if (user) {
      getUserFromDb(user?.uid).then(response => {
        const user = response?.data ?? null
        setUserFromDb(user)
      })
    }
  }, [user])
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && currentPathname !== '/login/forgetPassword') {
      router.push('/login');
    }
  }, [user, loading, router, currentPathname]);

  const isAuthenticated = !loading && !!user;

  // Provide the context to children
  return (
    <AuthContext.Provider value={{ user: userFromDb!, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
