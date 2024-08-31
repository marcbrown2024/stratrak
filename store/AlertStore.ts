// store for keeping track of of pop up is open or closed
import { create } from "zustand";

enum AlertType {
  "success",
  "error",
}

type AlertState = {
  showAlert: boolean
  body: string
  alertType: AlertType | null 
  closeAlert: () => void;
  setAlert: (body: string, alertType: AlertType) => void
}

export const useAlertStore = create<AlertState>()((set) => ({
  showAlert: true,
  body: "This is an alert",
  alertType: null,
  closeAlert: () => set(state => ({ showAlert: false })),
  setAlert: (body, alertType) => set({ body: body, alertType: alertType})
}));
