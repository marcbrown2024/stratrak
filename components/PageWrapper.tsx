"use client";

// react/nextjs components
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

// global stores
import useSideBarStore from "@/store/SideBarStore";

// custom components
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import SiteNavBtns from "@/components/SiteNavBtns";
import NotificationsPopUp from "@/components/NotificationsPopUp";
import DropDownModal from "@/components/DropDownModal";

const PageWrapper = ({ children }: { children: ReactNode }) => {
  const currentPathname = usePathname();
  const { isSidebarOpen } = useSideBarStore();

  if (
    currentPathname === "/login" ||
    currentPathname === "/login/forgetPassword"
  ) {
    return children;
  }

  return (
    <div
      className={`relative h-[calc(100vh-64px)] mt-[64px] ${
        isSidebarOpen
          ? "w-[calc(100%-272px)] ml-[272px]"
          : "w-[calc(100%-80px)] ml-[80px]"
      } flex-grow transition-all duration-100 ease-in-out`}
    >
      <Loader />
      <NotificationsPopUp />
      <DropDownModal />
      <Header />
      <div className="h-screen bg-slate-50">
        <div className="space-y-12 bg-slate-50 py-10">
          <SiteNavBtns />
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageWrapper;
