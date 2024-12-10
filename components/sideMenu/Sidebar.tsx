"use client";

// react/nextjs components
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// firestore functions
import { updateUserLastActivity } from "@/firebase";

// custom hooks
import useUser from "@/hooks/UseUser";

// global stores
import useSideBarStore from "@/store/SideBarStore";

// custom components
import MenuItem from "./MenuItem";

// constant data
import { SIDENAV_ITEMS } from "@/constants";

const Sidebar = () => {
  const currentPathname = usePathname();
  const { user } = useUser();
  const { isSidebarOpen, toggleSideBar } = useSideBarStore();

  useEffect(() => {
    if (user && user.userId) {
      updateUserLastActivity(user.userId)
        .then(() => {})
        .catch(() => {});
    }
  }, [user]);

  if (
    currentPathname === "/login" ||
    currentPathname === "/login/forgetPassword"
  ) {
    return null;
  }

  return (
    <div
      onMouseEnter={toggleSideBar}
      onMouseLeave={toggleSideBar}
      className={`fixed top-0 left-0 h-full ${
        isSidebarOpen ? "w-[17rem]" : "w-[5rem]"
      } flex flex-col items-center justify-start gap-4 bg-[#1286ff] shadow-lg transition-all duration-100 ease-in-out z-50`}
    >
      <Link
        href="/"
        className="relative h-24 w-11/12 flex items-center text-xl text-white font-extrabold pl-4"
      >
        <Image
          src="/images/logo-no-name.png"
          width={300}
          height={300}
          alt="site logo"
          className="h-10 w-10 rounded-full"
        />
        {isSidebarOpen && (
          <div className="absolute left-16 h-14 w-40 flex items-center">
            Trialist
          </div>
        )}
      </Link>
      <div className="w-11/12 flex-1 flex flex-col gap-2 px-3">
        {SIDENAV_ITEMS.map((item, idx) => {
          return <MenuItem key={idx} item={item} />;
        })}
      </div>

      <div className="relative h-24 w-11/12 flex items-center text-xl text-white font-extrabold pl-4">
        <Image
          width={200}
          height={200}
          src={
            user?.profilePhoto
              ? user?.profilePhoto
              : "/images/profile_user_avatar.png"
          }
          alt="Profile Photo"
          className="h-10 w-10 rounded-full"
        />
        {isSidebarOpen && (
          <div className="absolute left-16 h-14 w-40 flex items-center text-sm text-white font-semibold">
            {user?.fName} {user?.lName}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
