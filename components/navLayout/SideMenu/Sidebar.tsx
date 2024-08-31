"use client";

// react/nextjs components
import React from "react";
import Link from "next/link";

import { SIDENAV_ITEMS } from "@/constants";

// custom components
import MenuItem from "./MenuItem";

const Sidebar = () => {
  return (
    <div className="md:w-60 bg-white h-full flex-1 fixed border-r border-zinc-200 hidden md:flex">
      <div className="flex flex-col space-y-6 w-full">
        <Link
          href="/"
          className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-zinc-200 h-14 w-full"
        >
          <span className="h-7 w-7 bg-blue-500 rounded-lg" />
          <span className="font-bold text-xl text-blue-500 hidden md:flex">Logo</span>
        </Link>

        <div className="flex flex-col space-y-2 md:px-6 ">
          {SIDENAV_ITEMS.map((item, idx) => {
            return <MenuItem key={idx} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
