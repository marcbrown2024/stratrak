import { create } from "zustand";

type SiteNavBarState = {
  trialsArray: string[];
  foldersArray: string[];
  currentTrial: string;
  currentFolder: string;
  setTrialsArray: (value: string[]) => void;
  setFoldersArray: (value: string[]) => void;
  setCurrentTrial: (value: string) => void;
  setCurrentFolder: (value: string) => void;
};

const SiteNavBarStore = create<SiteNavBarState>((set) => ({
  trialsArray: [],
  foldersArray: [],
  currentTrial: "",
  currentFolder: "",
  setTrialsArray: (value: string[]) => set({ trialsArray: value }),
  setFoldersArray: (value: string[]) => set({ foldersArray: value }),
  setCurrentTrial: (value: string) => set({ currentTrial: value }),
  setCurrentFolder: (value: string) => set({ currentFolder: value }),
}));

export default SiteNavBarStore;
