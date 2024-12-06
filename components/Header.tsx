"use client";

// react/nextjs components
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// constants
import { SIDENAV_ITEMS } from "@/constants";

// custom hooks
import UseScroll from "@/hooks/UseScroll";

// global stores
import { useModalStore } from "@/store/DropDownModalStore";
import useNotificationStore from "@/store/NotificationStore ";

// custom hooks
import useUser from "@/hooks/UseUser";

// icons
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";

const Header = () => {
  const { user } = useUser();
  const scrolled = UseScroll(5);
  const currentPathname = usePathname();
  const { toggleModal, closeModal } = useModalStore();
  const { notifications, togglePopup, closePopUp } = useNotificationStore();

  const splitCamelCase = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (char) => char.toUpperCase());
  };

  // Split the pathname into segments and filter out empty strings
  const words = currentPathname.split("/").filter(Boolean);

  // Check if the last segment is 'files'
  const isFilesPage = words[words.length - 1] === "files";

  let currentPath = "";

  // If on the 'files' page, use the previous segment for the title
  if (isFilesPage && words.length > 1) {
    currentPath = `${splitCamelCase(words[words.length - 2])} Files`; // Get the previous segment
  } else {
    // If not on the 'files' page, just take the last segment
    currentPath = splitCamelCase(words.pop() ?? "");
  }

  const pathTitles = [
    { path: "/", title: "Home" },
    { path: "/monitoringLogs", title: "eRegulatory binders" },
    // { path: "/monitoringLogs/active", title: "eRegulatory binders" },
    // { path: "/monitoringLogs/inactive", title: "eRegulatory binders" },
    // { path: "/monitoringLogs/completed", title: "eRegulatory binders" },
  ];

  const displayTitle =
    pathTitles.find((item) => item.path === currentPathname)?.title ??
    (words[words.length - 1] === "regulatoryDocs"
      ? "Regulatory Documents"
      : currentPath);

  useEffect(() => {
    const closePopupsOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".Popup")) {
        closeModal();
        closePopUp();
      }
    };
    document.addEventListener("click", closePopupsOnOutsideClick);
    return () => {
      document.removeEventListener("click", closePopupsOnOutsideClick);
    };
  }, [closeModal]);

  if (
    currentPathname === "/login" ||
    currentPathname === "/login/forgetPassword"
  ) {
    return null;
  }

  return (
    <div
      className={`sticky inset-x-0 top-0 h-[4.5rem] w-full flex items-center justify-between gap-6 px-8 border-b border-zinc-200 ${
        scrolled ? "bg-slate-50/75 backdrop-blur-lg" : ""
      } transition-all z-30`}
    >
      <span className="flex text-xl font-bold tracking-wide">
        {displayTitle}
      </span>
      <div className="Popup w-[16.5rem] flex items-center justify-between">
        <button
          onClick={() => {
            togglePopup();
            closeModal();
          }}
          className="relative h-[50px] w-[50px] flex items-center justify-center bg-blue-100 rounded-full"
        >
          <IoMdNotificationsOutline size={28} />
          {notifications.Unread.length > 0 ? (
            <div className="absolute top-2 right-2 h-4 w-4 flex items-center justify-center text-xs text-white font-semibold bg-blue-600 rounded-full">
              {notifications.Unread.length}
            </div>
          ) : (
            <div className="absolute top-4 right-4 h-2 w-2 bg-blue-600 rounded-full"/>
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            toggleModal();
            closePopUp();
          }}
          className="flex items-center gap-3"
        >
          <Image
            width={200}
            height={200}
            src={
              user?.profilePhoto
                ? user?.profilePhoto
                : "/images/profile_user_avatar.png"
            }
            alt="Profile Photo"
            className="h-12 w-12 rounded-full"
          />
          <div className="flex items-center gap-3">
            <span className="text-gray-700 font-bold">
              {user?.fName} {user?.lName}
            </span>
            <FaChevronDown color="#374151" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Header;
