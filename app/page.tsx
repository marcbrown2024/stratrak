"use client"
// react/nextjs components
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import {auth} from "@/firebase"
import { useAuth } from "@/components/AuthProvider";

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  useEffect(() => {
    console.log(user)
  }, [user, isAuthenticated])

  return (
    <div className="h-full w-full flex items-center justify-center">
      <p>Home</p>
    </div>
  );
};

export default Home;