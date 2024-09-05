import { FaHome, FaCog } from "react-icons/fa";

import {
  MdDashboardCustomize,
  MdFolderShared,
  MdAdminPanelSettings,
} from "react-icons/md";

export const SIDENAV_ITEMS: SideNavItem[] = [
  // {
  //   title: "Home",
  //   path: "/",
  //   icon: <FaHome size={24} />,
  // },
  // {
  //   title: "Dashboard",
  //   path: "/dashboard",
  //   icon: <MdDashboardCustomize size={24} />,
  // },
  {
    title: "Trials",
    path: "/trials",
    icon: <MdFolderShared size={24} />,
    subMenu: true,
    subMenuItems: [
    { title: "Active Trials", path: "/trials/active", requireAdmin: false },
      { title: "Inactive Trials", path: "/trials/inactive", requireAdmin: false },
      { title: "Completed Trials", path: "/trials/completed", requireAdmin: false },
    ],
    requireAdmin: false,
  },
  {
    title: "Admin",
    path: "/admin",
    icon: <MdAdminPanelSettings size={24} />,
    requireAdmin: true,
  },
  // {
  //   title: "Settings",
  //   path: "/settings",
  //   icon: <FaCog size={24} />,
  // },
  {
    title: "Profile",
    path: "/profile",
    usage: "smallScreen",
    requireAdmin: false,
  },
  {
    title: "Help",
    path: "/help",
    usage: "smallScreen",
    requireAdmin: false,
  },
  {
    title: "Reset Password",
    path: "/resetPassword",
    usage: "smallScreen",
    requireAdmin: false,
  },
  {
    title: "Sign Out",
    path: "/login",
    usage: "smallScreen",
    requireAdmin: false,
  },
];
