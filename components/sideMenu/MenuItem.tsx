'use client'

// react/nextjs components
import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

// icons
import { FaChevronDown } from "react-icons/fa";
import { useAuth } from "../AuthProvider";

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const {user, isAuthenticated} = useAuth()

  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (item.requireAdmin && !user?.isAdmin) ? null : (
    
    <div>
      {item.subMenu ? (
        <>
          <div className="w-full flex items-center justify-between text-white p-2 rounded-lg hover:bg-white/10 cursor-pointer">
            <Link href={item.path} className="w-full">
              <div className="flex flex-row space-x-4 items-center">
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
            <div className="my-2 ml-12 flex flex-col space-y-4">
              {item.subMenuItems?.map((subItem, idx) => (
                <Link
                  key={idx}
                  href={subItem.path}
                  className={`text-white text-sm ${
                    subItem.path === pathname ? "font-bold" : ""
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
            className="flex flex-row items-center text-white space-x-4 p-2 rounded-lg hover:bg-white/10"
          >
            {item.icon}
            <span className="font-semibold">{item.title}</span>
          </Link>
        )
      )}
    </div>
  );
};

export default MenuItem;
