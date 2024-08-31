// type for log details 
type LogDetails = {
  id: string;
  monitorName: string;
  signature: string;
  typeOfVisit: "Remote" | "Onsite" | "Waiver Call";
  purposeOfVisit: "SIV" | "IMV" | "COV" | "Audit";
  dateOfVisit: string | Date;
};

// type for trial details
type TrialDetails = {
  id: string;
  investigatorName: string;
  protocol: string;
  siteVisit: string;
};

// types for nav-menu are defined here
type SideNavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  subMenu?: boolean;
  subMenuItems?: SideNavItem[];
};

type MenuItemWithSubMenuProps = {
  item: SideNavItem;
  toggleOpen: () => void;
}