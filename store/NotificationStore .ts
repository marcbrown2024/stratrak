import { create } from "zustand";

interface Notification {
  title: string;
  message: string;
}

interface NotificationStore {
  notifications: {
    All: Notification[];
    Unread: Notification[];
    Read: Notification[];
  };
  activeTab: "All" | "Unread" | "Read";
  isPopupOpen: boolean;
  setActiveTab: (tab: "All" | "Unread" | "Read") => void;
  togglePopup: () => void;
  closePopUp: () => void;
  setNotifications: (notifications: {
    All: Notification[];
    Unread: Notification[];
    Read: Notification[];
  }) => void;
}

const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: {
    All: [],
    Unread: [],
    Read: [],
  },
  activeTab: "All",
  isPopupOpen: false,
  setActiveTab: (tab) => set({ activeTab: tab }),
  togglePopup: () => set((state) => ({ isPopupOpen: !state.isPopupOpen })),
  closePopUp: () => set({ isPopupOpen: false }),
  setNotifications: (notifications) =>
    set({ notifications }),
}));

export default useNotificationStore;
