'use client'

// react/nextjs components
import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

// icons
import { FaChevronDown } from "react-icons/fa";
import useUser from "@/hooks/UseUser";

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const {user} = useUser()
  const currentPathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (item.requireAdmin && !user?.isAdmin) ? null : (
    
    <>
      {item.subMenu ? (
        <>
          <div className="w-full flex items-center justify-between text-white p-2 rounded-lg hover:bg-white/10 cursor-pointer">
            <Link href={item.path} className="w-full">
              <div className="flex flex-row space-x-2 items-center">
                {item.icon}
                <span className="font-semibold text-white">{item.title}</span>
              </div>
            </Link>
            <button
              className={`flex ${subMenuOpen ? "rotate-180" : ""} text-white`}
            >
              <FaChevronDown onClick={toggleSubMenu} size={16} />
            </button>
          </div>
          {subMenuOpen && (
            <div className="my-2 ml-8 flex flex-col space-y-4">
              {item.subMenuItems?.map((subItem, idx) => (
                <Link
                  key={idx}
                  href={subItem.path}
                  className={`text-white text-sm ${
                    subItem.path === currentPathname ? "font-bold" : ""
                  } py-1 rounded hover:bg-white/10`}
                >
                  <span className="pl-2">{subItem.title}</span>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        item.usage !== "smallScreen" && (
          <Link
            href={item.path}
            className={`w-full flex items-center justify-start gap-3 text-white px-2 py-3 ${item.path === currentPathname ? "bg-white/20" : ""} rounded-lg hover:bg-white/20 `}
          >
            {item.icon}
            <span className="font-semibold">{item.title}</span>
          </Link>
        )
      )}
    </>
  );
};

export default MenuItem;
