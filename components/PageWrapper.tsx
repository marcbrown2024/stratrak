"use client";

// react/nextjs components
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

const PageWrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return pathname === "/login" ? (
    <>{children}</>
  ) : (
    <div className="md:h-[calc(100vh-58px)] flex flex-col bg-zinc-50 flex-grow py-20">
      {children}
    </div>
  );
};

export default PageWrapper;
