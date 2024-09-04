"use client";

// react/nextjs components
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

// custom components
import SiteNavBtns from "./SiteNavBtns";
import DropDownModal from "./DropDownModal";

const PageWrapper = ({ children }: { children: ReactNode }) => {
  const currentPathname = usePathname();

  if (currentPathname === "/login") {
    return children;
  }

  return (
    <div className="relative h-fit md:min-h-[calc(100vh-58px)] flex flex-col flex-grow pt-28">
      <SiteNavBtns />
      <DropDownModal />
      {children}
    </div>
  );
};

export default PageWrapper;
