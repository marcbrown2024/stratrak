import {
  FaHome,
  FaCog,
} from "react-icons/fa";

import { MdDashboardCustomize, MdFolderShared  } from "react-icons/md";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Home",
    path: "/",
    icon: <FaHome size={30} />,
  },
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <MdDashboardCustomize size={30} />,
  },
  {
    title: "Trials",
    path: "/trials",
    icon: <MdFolderShared  size={30} />,
    subMenu: true,
    subMenuItems: [
      { title: "All Trials", path: "/trials" },
      { title: "Active Trials", path: "/trials/active" },
      { title: "Completed Trials", path: "/trials/completed" },
    ],
  },
  {
    title: "Settings",
    path: "/settings",
    icon: <FaCog size={30} />,
  },
];
