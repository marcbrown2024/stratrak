// react/nextjs components
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

// custom components
import MenuItem from "@/components/navLayout/Header/MenuItem";

// icons
import { FaChevronDown } from "react-icons/fa";

const MenuItemWithSubMenu = ({
  item,
  toggleOpen,
}: MenuItemWithSubMenuProps) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  return (
    <>
      <MenuItem>
        <button
          className="flex w-full text-3xl"
          onClick={() => setSubMenuOpen(!subMenuOpen)}
        >
          <div className="flex flex-row justify-between w-full items-center">
            <span
              className={`text-blue-500 ${pathname.includes(item.path) ? "font-bold" : ""}`}
            >
              {item.title}
            </span>
            <div className={`text-blue-500 ${subMenuOpen ? "rotate-180" : ""}`}>
              <FaChevronDown size={24} />
            </div>
          </div>
        </button>
      </MenuItem>
      <div className="mt-2 ml-2 flex flex-col space-y-2">
        {subMenuOpen && (
          <>
            {item.subMenuItems?.map((subItem: SideNavItem, subIdx: number) => (
              <MenuItem key={subIdx}>
                <Link
                  href={subItem.path}
                  onClick={() => toggleOpen()}
                  className={`text-xl text-blue-500 ${subItem.path === pathname ? "font-bold" : ""} pl-2`}
                >
                  {subItem.title}
                </Link>
              </MenuItem>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default MenuItemWithSubMenu;
