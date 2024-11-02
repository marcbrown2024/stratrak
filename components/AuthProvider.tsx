"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, getUserFromDb } from "@/firebase";

// Define the context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Constants
const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000; // 10 days in milliseconds
// const TEN_DAYS_MS = 30 * 60 * 1000; // 30 min in milliseconds

// AuthProvider component
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const [userFromDb, setUserFromDb] = useState<User | null>(null);
  const currentPathname = usePathname();
  const router = useRouter();

  // Set the last login time in localStorage if user logs in
  useEffect(() => {
    if (user) {
      const lastLoginTime = localStorage.getItem("lastLoginTime");
      if (!lastLoginTime) {
        // Set login time if not set already
        localStorage.setItem("lastLoginTime", Date.now().toString());
      }
    }
  }, [user]);

  // Check if 10 days have passed since the last login
  useEffect(() => {
    const lastLoginTime = localStorage.getItem("lastLoginTime");
    if (lastLoginTime) {
      const timeSinceLogin = Date.now() - parseInt(lastLoginTime, 10);
      if (timeSinceLogin > TEN_DAYS_MS) {
        // Clear user and localStorage, then redirect to login
        auth.signOut();
        localStorage.removeItem("lastLoginTime");
        window.location.reload();
        router.push("/login");
      }
    }
  }, [router, user]);

  // Fetch user from db and set it as the userFromDb
  useEffect(() => {
    if (user) {
      getUserFromDb(user?.uid).then((response) => {
        const userData = response?.data ?? null;
        setUserFromDb(userData);
      });
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user && currentPathname !== "/login/forgetPassword") {
      router.push("/login");
    }
  }, [user, loading, router, currentPathname]);

  const isAuthenticated = !loading && !!user;

  // Provide the context to children
  return (
    <AuthContext.Provider
      value={{ user: userFromDb, loading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };