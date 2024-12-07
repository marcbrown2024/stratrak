import { create } from "zustand";

interface NotificationStore {
  notifications: {
    All: UserNotification[];
    Unread: UserNotification[];
    Read: UserNotification[];
    
  };
  activeTab: "All" | "Unread" | "Read";
  isPopupOpen: boolean;
  setActiveTab: (tab: "All" | "Unread" | "Read") => void;
  togglePopup: () => void;
  closePopUp: () => void;
  setNotifications: (notifications: {
    All: UserNotification[];
    Unread: UserNotification[];
    Read: UserNotification[];
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
