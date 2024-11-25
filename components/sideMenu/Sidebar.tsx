"use client";

// react/nextjs components
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SIDENAV_ITEMS } from "@/constants";
import logo from '@/public/images/logo-blue-bg-removed.png'

// custom components
import MenuItem from "./MenuItem";
import Image from "next/image";

const Sidebar = () => {
  const currentPathname = usePathname();

  if (currentPathname === "/login" ||
    currentPathname === "/login/forgetPassword") {
    return null;
  }
  return (
    <div className="fixed h-full w-48 xl:w-72 flex flex-1 bg-[#1286ff] z-50">
      <div className="w-full flex flex-col space-y-6">
        <Link
          href="/"
          className="h-14 w-full flex flex-row items-center justify-center md:justify-start space-x-3 md:px-6 border-b border-zinc-100/20"
        >
          <div className="h-14 w-full">
            <Image
              src={logo}
              width={200}
              height={75}
              alt={'site logo'}
              priority
              className="object-cover w-full h-full -ml-10 transform scale-75"
            />
          </div>
        </Link>

        <div className="flex flex-col space-y-2 md:px-2">
          {SIDENAV_ITEMS.map((item, idx) => {
            return <MenuItem key={idx} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
