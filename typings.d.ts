// type for log details
type LogDetails = {
  id?: string;
  trialId?: string;
  adminName?: string;
  adminSig?: string;
  amended?: boolean;
  amendedDate?: string;
  amendedReason?: string;
  monitorName: string;
  signature: string;
  typeOfVisit: "Remote" | "Onsite" | "Waiver Call";
  purposeOfVisit: "SIV" | "IMV" | "COV" | "Audit";
  dateOfVisit: string;
};

interface DBLog extends LogDetails {
  id: string;
}

// trial fetched from database
interface DBTrial extends TrialDetails {
  id: string;
}

// type for trial details
type TrialDetails = {
  id?: string;
  investigatorName: string;
  protocol: string;
  siteVisit: string;
  progress: string;
};

// types for nav-menu are defined here
type SideNavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  subMenu?: boolean;
  subMenuItems?: SideNavItem[];
  signOut?: () => void;
  usage?: string;
  requireAdmin: boolean;
};

type MenuItemWithSubMenuProps = {
  item: SideNavItem;
  toggleOpen: () => void;
};

type AlertBody = {
  title?: string;
  content: string;
};

type UserNotification = {
  id?: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type User = {
  email: string;
  isAdmin: boolean | undefined;
  profilePhoto: string;
  fName: string;
  lName: string;
  orgId: string;
  signature: string;
  lastActivity: string;
  dateAdded?: string;
  userId: string;
  phoneNumber: string;
  country: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  notifications?: Notification[];
};

// Define the type for help form data
type HelpFormData = {
  subject: string;
  message: string;
};

// Type definitions for profile form data
type ProfileFormData = {
  profilePhoto: string;
  fName: string;
  lName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
};
