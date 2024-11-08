"use client";

// react/nextjs components
import { ReactNode, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

// custom components
import SiteNavBtns from "./SiteNavBtns";
import DropDownModal from "./DropDownModal";

const PageWrapper = ({ children }: { children: ReactNode }) => {
  const currentPathname = usePathname();

  if (currentPathname === "/login" || currentPathname === "/login/forgetPassword") {
    return children;
  }

  return (
    <div className="relative h-fit md:min-h-[calc(100vh-58px)] flex flex-col items-center flex-grow pt-28">
      <SiteNavBtns />
      <DropDownModal />
      {children}
    </div>
  );
};

export default PageWrapper;
