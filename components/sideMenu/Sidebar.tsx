"use client";

// react/nextjs components
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SIDENAV_ITEMS } from "@/constants";

// custom components
import MenuItem from "./MenuItem";

const Sidebar = () => {
  const pathname = usePathname();

  if (pathname === "/login") {
    return null;
  }
  return (
    <div className="fixed h-full md:w-72 hidden md:flex flex-1 bg-[#1286ff] z-50">
      <div className="w-full flex flex-col space-y-6">
        <Link
          href="/"
          className="h-14 w-full flex flex-row items-center justify-center md:justify-start space-x-3 md:px-6 border-b border-zinc-100/20"
        >
          <span className="h-8 w-8 bg-white rounded-lg" />
          <span className="md:flex hidden text-xl text-white font-bold">
            Logo
          </span>
        </Link>

        <div className="flex flex-col space-y-2 md:px-6">
          {SIDENAV_ITEMS.map((item, idx) => {
            return <MenuItem key={idx} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;