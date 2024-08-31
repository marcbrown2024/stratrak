"use client";

// react/nextjs components
import React from "react";
import Link from "next/link";

import { SIDENAV_ITEMS } from "@/constants";

// custom components
import MenuItem from "./MenuItem";

const Sidebar = () => {
  return (
    <div className="fixed md:w-72 hidden md:flex flex-1 bg-white h-full border-r border-zinc-200 z-50">
      <div className="w-full flex flex-col space-y-6">
        <Link
          href="/"
          className="h-14 w-full flex flex-row items-center justify-center md:justify-start space-x-3 md:px-6 border-b border-zinc-200"
        >
          <span className="h-8 w-8 bg-blue-500 rounded-lg" />
          <span className="md:flex hidden text-xl text-blue-500 font-bold">Logo</span>
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
