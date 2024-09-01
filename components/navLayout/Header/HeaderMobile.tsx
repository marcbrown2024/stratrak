"use client";

// react/nextjs components
import React, { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

// constants
import { SIDENAV_ITEMS } from "@/constants";

// framer-motion components
import { motion, useCycle } from "framer-motion";

// custom hooks
import UseDimensions from "@/hooks/UseDimensions";

// custom components
import MenuItemWithSubMenu from "./MenuItemWithSubMenu";
import MenuItem from "./MenuItem";
import MenuToggle from "./MenuToggle";

// Sidebar animation variants for open and closed states
const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 100% 0)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(0px at 100% 0)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

// Variants for transitioning child elements in staggered animation
const variants = {
  open: {
    opacity: 1,
    transition: { staggerChildren: 0.02, delayChildren: 0.15 },
  },
  closed: {
    opacity: 0,
    transition: { staggerChildren: 0.01, staggerDirection: -1 },
  },
};

const HeaderMobile = () => {
  const pathname = usePathname();
  const containerRef = useRef(null);
  const { height } = UseDimensions(containerRef);
  const [isOpen, toggleOpen] = useCycle(false, true);
  const userPhotoUrl =
    "https://cdn-icons-png.flaticon.com/512/3237/3237472.png";

  if (pathname === "/login") {
    return null;
  }

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={height}
      className={`fixed inset-0 z-50 w-full md:hidden ${
        isOpen ? "" : "pointer-events-none"
      }`}
      ref={containerRef}
    >
      <motion.div
        className="absolute inset-0 right-0 w-full bg-white"
        variants={sidebar}
      />
      <motion.ul
        variants={variants}
        className={`absolute grid w-full gap-3 px-10 py-16 max-h-screen overflow-y-auto ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="h-auto w-full flex items-center justify-center gap-8 my-4">
          <Image
            src={userPhotoUrl}
            alt=""
            width={50}
            height={50}
            className="h-32 w-32 rounded-full"
          />
          <div className="flex flex-col items-start justify-start gap-1">
            <p className="text-2xl text-blue-500 font-semibold">First Last</p>
            <p className="text-lg text-blue-500 font-medium">Department</p>
            <p className="text-lg text-blue-500 font-medium">Company Name</p>
          </div>
        </div>
        {SIDENAV_ITEMS.map((item, idx) => {
          const isLastItem = idx === SIDENAV_ITEMS.length - 1;

          return (
            <div key={idx}>
              {item.subMenu ? (
                <MenuItemWithSubMenu item={item} toggleOpen={toggleOpen} />
              ) : (
                <MenuItem>
                  <Link
                    href={item.path}
                    onClick={() => toggleOpen()}
                    className={`flex w-full text-3xl text-blue-500 ${
                      item.path === pathname ? "font-bold" : ""
                    }`}
                  >
                    {item.title}
                  </Link>
                </MenuItem>
              )}

              {!isLastItem && (
                <MenuItem className="my-3 h-px w-full bg-gray-300" />
              )}
            </div>
          );
        })}
      </motion.ul>
      <MenuToggle toggle={toggleOpen} />
    </motion.nav>
  );
};

export default HeaderMobile;
