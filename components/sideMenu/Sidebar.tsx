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

// custom components
import MenuItem from "./MenuItem";

// constant data
import { SIDENAV_ITEMS } from "@/constants";

const Sidebar = () => {
  const { user } = useUser();
  const currentPathname = usePathname();

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
    <div className="fixed h-full w-[17rem] flex flex-col items-center justify-start gap-4 bg-[#1286ff] shadow-lg z-50">
      <div className="h-32 w-4/5 flex items-center px-3">
        <Link href="/" className="flex items-center gap-3 text-xl text-white font-extrabold">
          <Image
            src="/images/logo-no-name.png"
            width={300}
            height={300}
            alt="site logo"
            className="h-10 w-10 rounded-full"
          />
          Trialist
        </Link>
      </div>
      <div className="w-4/5 flex-1 flex flex-col gap-2 pl-3">
        {SIDENAV_ITEMS.map((item, idx) => {
          return <MenuItem key={idx} item={item} />;
        })}
      </div>
    </div>
  );
};

export default Sidebar;
