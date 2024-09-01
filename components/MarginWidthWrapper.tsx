"use client";

// react/nextjs components
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

const MarginWidthWrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return pathname === "/login" ? (
    <>{children}</>
  ) : (
    <div className="flex flex-col md:ml-60 sm:border-r sm:border-zinc-700">
      {children}
    </div>
  );
};

export default MarginWidthWrapper;
