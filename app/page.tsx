"use client"
// react/nextjs components
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <div className="h-full w-full flex items-center justify-center">
      <p>This is Home</p>
    </div>
  );
};

export default Home;
