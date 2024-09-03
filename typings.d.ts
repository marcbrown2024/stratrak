// type for log details 
interface LogDetails {
  monitorName: string;
  signature: string;
  typeOfVisit: "Remote" | "Onsite" | "Waiver Call";
  purposeOfVisit: "SIV" | "IMV" | "COV" | "Audit";
  dateOfVisit: string | Date;
};

interface DBLog extends LogDetails {
  id: string,
}

// type for trial details
interface TrialDetails {
  investigatorName: string;
  protocol: string;
  siteVisit: string;
};

// trial fetched from database
interface DBTrial extends TrialDetails {
  id: string
}

// types for nav-menu are defined here
type SideNavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  subMenu?: boolean;
  subMenuItems?: SideNavItem[];
  signOut?: () => void;
  usage?: string;
};

type MenuItemWithSubMenuProps = {
  item: SideNavItem;
  toggleOpen: () => void;
}

type AlertBody = {
  title?: string,
  content: string,
}

type User = {
  isAdmin: Boolean,
  fName: string,
  lName: string,
  orgId: string,
  signature: string,
  status: string,
  userId: string,
}

// Define the type for help form data
type HelpFormData = {
  subject: string;
  message: string;
};

