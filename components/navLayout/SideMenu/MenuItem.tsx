// react/nextjs components
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

// icons
import { FaChevronDown } from "react-icons/fa";

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (
    <div>
      {item.subMenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`w-full flex flex-row items-center justify-between text-blue-500 p-2 rounded-lg hover:bg-blue-100 ${
              pathname.includes(item.path) ? "bg-blue-100" : ""
            }`}
          >
            <div className="flex flex-row space-x-4 items-center">
              {item.icon}
              <span className="font-semibold text-blue-500">{item.title}</span>
            </div>

            <div
              className={`flex ${
                subMenuOpen ? "rotate-180" : ""
              } text-blue-500`}
            >
              <FaChevronDown size={16} />
            </div>
          </button>

          {subMenuOpen && (
            <div className="my-2 ml-12 flex flex-col space-y-4">
              {item.subMenuItems?.map((subItem, idx) => (
                <Link
                  key={idx}
                  href={subItem.path}
                  className={`text-blue-500 text-sm ${
                    subItem.path === pathname ? "font-bold" : ""
                  } py-1 rounded hover:bg-blue-100`}
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
            className={`flex flex-row items-center text-blue-500 space-x-4 p-2 rounded-lg hover:bg-blue-100 ${
              item.path === pathname ? "bg-blue-100" : ""
            }`}
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
