import { create } from "zustand";

interface SideBarState {
  isSidebarOpen: boolean;
  toggleSideBar: () => void;
}

const useSideBarStore = create<SideBarState>((set) => ({
  isSidebarOpen: false,
  toggleSideBar: () =>
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
    })),
}));

export default useSideBarStore;
