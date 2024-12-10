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
    <div className={`relative h-[calc(100vh-64px)] ${
      isSidebarOpen ? "w-[calc(100%-272px)] ml-[272px]" : "w-[calc(100%-80px)] ml-[80px]"
    } flex-grow transition-all duration-100 ease-in-out`}>
      <Loader />
      <SiteNavBtns />
      <NotificationsPopUp />
      <DropDownModal />
      <Header />
      <div className="bg-slate-50 pt-10">{children}</div>
    </div>
  );
};

export default PageWrapper;
