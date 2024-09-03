// store for creating log states
import { create } from "zustand";
import { defaultTrial } from "@/lib/defaults";

type trialsState = {
  trials: {
    [key: number]: TrialDetails;
  };
  clearTrials: () => void;
  removeTrial: (rowId: number) => void;
  updateTrials: (rowId: number, trial: TrialDetails) => void;
  updateTrial: (
    rowId: number,
    trialKey: keyof TrialDetails,
    trialData: any
  ) => void;
};

export const useTrialStore = create<trialsState>()((set) => ({
  trials: {
    0: defaultTrial,
  },
  clearTrials: () => set({ trials: { 0: defaultTrial } }),
  removeTrial: (rowId) =>
    set((state) => {
      const trials = { ...state.trials };
      delete trials[rowId];
      return { ...state, trials: trials };
    }),
  updateTrials: (rowId, TrialDetails) =>
    set((state) => {
      return { ...state, trials: { ...state.trials, [rowId]: TrialDetails } };
    }),
  updateTrial: (rowId, trialKey, trialData) =>
    set((state) => {
      let trial = state.trials[rowId];
      trial = { ...trial, [trialKey]: trialData };
      const updatedState = { ...state };
      updatedState.trials[rowId] = trial;
      return updatedState;
    }),
}));
