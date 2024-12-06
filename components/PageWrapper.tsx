"use client";

// react/nextjs components
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

// custom components
import SiteNavBtns from "@/components/SiteNavBtns";
import NotificationsPopUp from "@/components/NotificationsPopUp";
import DropDownModal from "@/components/DropDownModal";

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
      className={`relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center flex-grow px-8 py-8`}
    >
      <SiteNavBtns />
      <NotificationsPopUp />
      <DropDownModal />
      <div className="h-full w-full p-2 rounded-xl">{children}</div>
    </div>
  );
};

export default PageWrapper;
