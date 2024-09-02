"use client";

// react/nextjs components
import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";

// constants
import { SIDENAV_ITEMS } from "@/constants";

// custom hooks
import UseScroll from "@/hooks/UseScroll";

// zustand stores
import { useModalStore } from "@/store/DropDownModalStore";

const Header = () => {
  const scrolled = UseScroll(5);
  const pathname = usePathname();
  const selectedLayout = useSelectedLayoutSegment();
  const { toggleModal, closeModal } = useModalStore();
  
  // Find the current item's title based on the current path
  const currentItem = SIDENAV_ITEMS.find((item) => item.path === pathname) as
    | SideNavItem
    | undefined;
  const title = currentItem?.title || "";

  useEffect(() => {
    const closePopupsOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".Popup")) {
        closeModal();
      }
    };
    document.addEventListener("click", closePopupsOnOutsideClick);
    return () => {
      document.removeEventListener("click", closePopupsOnOutsideClick);
    };
  }, [closeModal]);

  if (pathname === "/login") {
    return null;
  }

  return (
    <div
      className={`sticky inset-x-0 top-0 w-full transition-all border-b border-zinc-100/90 ${
        scrolled ? "border-b border-zinc-200 bg-white/75 backdrop-blur-lg" : ""
      } ${selectedLayout ? "border-b border-zinc-200 bg-white" : ""} z-30`}
    >
      <div className="h-14 flex items-center justify-between px-4">
        <span className="text-xl text-blue-800 font-bold">{title}</span>
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex flex-row space-x-3 items-center justify-center md:hidden"
          >
            <span className="h-8 w-8 bg-blue-500 rounded-lg" />
            <span className="font-bold text-xl text-blue-500 flex ">Logo</span>
          </Link>
        </div>
        <button
          onClick={toggleModal}
          className="Popup h-10 w-10 md:flex hidden items-center justify-center text-center bg-[#1286ff] rounded-full"
        >
          <span className="text-sm text-white font-extrabold">HQ</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
