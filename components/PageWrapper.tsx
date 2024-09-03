"use client";

// react/nextjs components
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import SiteNavBtns from "./SiteNavBtns";

const PageWrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="relative h-fit md:min-h-[calc(100vh-58px)] flex flex-col bg-white flex-grow pt-28">
      <SiteNavBtns />
      {children}
    </div>
  );
};

export default PageWrapper;
