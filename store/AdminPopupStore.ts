import { create } from "zustand";

type PopupState = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const AdminPopupStore = create<PopupState>((set) => ({
    isOpen: false,
  setIsOpen: (value: boolean) => set({ isOpen: value }),
}));

export default AdminPopupStore;
