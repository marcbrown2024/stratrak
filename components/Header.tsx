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

// zustand stores
import { useModalStore } from "@/store/DropDownModalStore";
import useUser from "@/hooks/UseUser";

// icons
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
const Header = () => {
  const { user } = useUser();
  const scrolled = UseScroll(5);
  const currentPathname = usePathname();
  const { toggleModal, closeModal } = useModalStore();

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
    <div className="h-20 w-full flex items-center justify-between gap-6 px-8">
      <span className="flex text-xl font-bold tracking-wide">
        {displayTitle}
      </span>
      <div className="w-[16.5rem] flex items-center justify-between">
        <div className="h-[50px] w-[50px] flex items-center justify-center bg-blue-50 rounded-full">
          <IoMdNotificationsOutline size={28} />
        </div>
        <div className="flex items-center gap-3">
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
          <button onClick={() => toggleModal()} className="Popup flex items-center gap-3">
            <span className="text-gray-500 font-bold">
              {user?.fName} {user?.lName}
            </span>
            <FaChevronDown color="#6b7280" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
