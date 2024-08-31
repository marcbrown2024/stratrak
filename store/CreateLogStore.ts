// store for creating log states
import { create } from "zustand";
import { defaultLog } from "@/lib/defaults";

type logsState = {
  logs: {
    [key: number]: LogDetails;
  };
  updateLogs: (rowId: number, log: LogDetails) => void;
  updateLog: (rowId: number, logKey: keyof LogDetails, logData: any) => void;
};

export const useLogStore = create<logsState>()((set) => ({
  logs: {
    0: defaultLog,
  },
  updateLogs: (rowId, logDetails) =>
    set((state) => {
      return { ...state, logs: { ...state.logs, [rowId]: logDetails } };
    }),
  updateLog: (rowId, logKey, logData) =>
    set((state) => {
      // const updatedState = {...state.logs, [rowId]: {...state.logs.rowId, [logKey]: logData}}
      let log = state.logs[rowId];
      log = { ...log, [logKey]: logData };
      // const updatedState = {...state, logs: {...state.logs, [rowId]: {...state.logs[rowId], [logKey]: {...state.logs[rowId], [logKey]: logData}}}}
      const updatedState = { ...state };
      updatedState.logs[rowId] = log;
      return updatedState;
    }),
}));
