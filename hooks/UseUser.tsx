"use client";

// react/nextjs components
import React, { useEffect, useState } from 'react';

// firebase components
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, getUserFromDb } from "@/firebase";

// global states
import LoadingStore from "@/store/LoadingStore";

const useUser = () => {
  const [authUser] = useAuthState(auth);
  const [user, setUser] = useState<User | null>(null);
  const { setLoading } = LoadingStore();
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchUser = async () => {
      if (authUser) {
        setLoading(true); // Start loading when the request is initiated
        try {
          const response = await getUserFromDb(authUser?.uid);
          const fetchedUser = response?.data ?? null;
          setUser(fetchedUser);
        } catch (err) {
          setError('Failed to fetch user data');
        } finally {
          setLoading(false); // Stop loading after the request completes
        }
      } else {
        setLoading(false); // Stop loading if no authUser is available
      }
    };

    fetchUser();
  }, [authUser]);

  return { user, error };
};

export default useUser;
