"use client";

// react/nextjs components
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import SiteNavBtns from "./SiteNavBtns";

const PageWrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return pathname === "/login" ? (
    <>{children}</>
  ) : (
    <div className="relative md:min-h-[calc(100vh-58px)] h-fit flex flex-col bg-zinc-50 flex-grow py-20">
      <SiteNavBtns />
      {children}
    </div>
  );
};

export default PageWrapper;
