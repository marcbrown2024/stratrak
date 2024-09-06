"use client";

// react/nextjs components
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

const MarginWidthWrapper = ({ children }: { children: ReactNode }) => {
  const currentPathname = usePathname();

  return currentPathname === "/login" ||
    currentPathname === "/login/forgetPassword" ? (
    <>{children}</>
  ) : (
    <div className="flex flex-col md:ml-72">{children}</div>
  );
};

export default MarginWidthWrapper;
