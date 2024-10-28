import { create } from "zustand";

type AddNewFolderState = {
  visible: boolean;
  setVisibility: (value: boolean) => void;
};

const AddNewFolderStore = create<AddNewFolderState>((set) => ({
  visible: false,
  setVisibility: (value: boolean) => set({ visible: value }),
}));

export default AddNewFolderStore;
