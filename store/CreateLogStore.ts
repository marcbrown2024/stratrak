// store for creating log states
import { create } from "zustand";
import { defaultLog } from "@/lib/defaults";

type logsState = {
  logs: {
    [key: number]: LogDetails
  }
  clearLogs: () => void
  removeLog: (rowId: number) => void 
  updateLogs: (rowId: number, log: LogDetails) => void
  updateLog: (rowId: number, logKey: keyof LogDetails, logData: any) => void
}

export const useLogStore = create<logsState>()((set) => ({
  logs: {
    0: defaultLog
  },
  clearLogs: () => set({logs: {0: defaultLog}}),
  removeLog: (rowId) => set(state => {
    const logs = {...state.logs}
    delete logs[rowId]
    return {...state, logs: logs}
  }),
  updateLogs: (rowId, logDetails) => set(state => {
    return {...state, logs: {...state.logs, [rowId]: logDetails}}}
  ),
  updateLog: (rowId, logKey, logData) => set(state => {
    let log = state.logs[rowId]
    log = {...log, [logKey]: logData}
    const updatedState = {...state}
    updatedState.logs[rowId] = log
    return updatedState
  })
}))