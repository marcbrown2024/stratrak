"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";

// firebase components
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, getUserFromDb } from "@/firebase";

// global states
import LoadingStore from "@/store/LoadingStore";

const useUser = () => {
  const [authUser] = useAuthState(auth);
  const [user, setUser] = useState<User | null>(null);
  const { loading, setLoading } = LoadingStore();
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchUser = async () => {
      if (authUser) {
        try {
          const response = await getUserFromDb(authUser?.uid);
          const fetchedUser = response?.data ?? null;
          setUser(fetchedUser);
        } catch (err) {
          setError("Failed to fetch user data");
        }
      }
    };

    fetchUser();
  }, [authUser]);

  return { user, error };
};

export default useUser;
