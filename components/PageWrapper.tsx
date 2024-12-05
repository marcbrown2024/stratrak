"use client";

// react/nextjs components
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

// custom components
import SiteNavBtns from "./SiteNavBtns";
import DropDownModal from "./DropDownModal";

const PageWrapper = ({ children }: { children: ReactNode }) => {
  const currentPathname = usePathname();

  if (
    currentPathname === "/login" ||
    currentPathname === "/login/forgetPassword"
  ) {
    return children;
  }

  return (
    <div
      className={`relative h-fit md:min-h-[calc(100vh-80px)] flex flex-col items-center justify-center flex-grow px-8 py-8`}
    >
      <SiteNavBtns />
      <DropDownModal />
      <div className="h-full w-full p-2 rounded-xl">{children}</div>
    </div>
  );
};

export default PageWrapper;
