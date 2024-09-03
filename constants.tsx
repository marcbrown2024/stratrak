import { FaHome, FaCog } from "react-icons/fa";

import {
  MdDashboardCustomize,
  MdFolderShared,
  MdAdminPanelSettings,
} from "react-icons/md";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Home",
    path: "/",
    icon: <FaHome size={24} />,
  },
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <MdDashboardCustomize size={24} />,
  },
  {
    title: "Trials",
    path: "/trials",
    icon: <MdFolderShared size={24} />,
    subMenu: true,
    subMenuItems: [
      { title: "Active Trials", path: "/trials/active" },
      { title: "Inactive Trials", path: "/trials/inactive" },
      { title: "Completed Trials", path: "/trials/completed" },
    ],
  },
  {
    title: "User Management",
    path: "/userManagement",
    icon: <MdAdminPanelSettings size={24} />,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: <FaCog size={24} />,
  },
  {
    title: "Profile",
    path: "/profile",
    usage: "smallScreen",
  },
  {
    title: "Help",
    path: "/help",
    usage: "smallScreen",
  },
  {
    title: "Reset Password",
    path: "/resetPassword",
    usage: "smallScreen",
  },
  {
    title: "Sign Out",
    path: "/login",
    usage: "smallScreen",
  },
];
