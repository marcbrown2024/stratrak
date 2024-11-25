"use client";

// react/nextjs components
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

// custom components
import Loader from "@/components/Loader";

const MarginWidthWrapper = ({ children }: { children: ReactNode }) => {
  const currentPathname = usePathname();

  return currentPathname === "/login" ||
    currentPathname === "/login/forgetPassword" ? (
    <>{children}</>
  ) : (
    <div className="flex flex-col ml-48 xl:ml-72">
      {children} <Loader />
    </div>
  );
};

export default MarginWidthWrapper;
