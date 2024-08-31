// store for keeping track of of pop up is open or closed
import { AlertType } from "@/enums";
import { create } from "zustand";


type AlertState = {
  showAlert: boolean
  body: AlertBody
  alertType: AlertType 
  closeAlert: () => void;
  setAlert: (body: AlertBody, alertType: AlertType) => void
}

export const useAlertStore = create<AlertState>()((set) => ({
  showAlert: false,
  body: {
    title: "Success!",
    content: "This is an alert",
  },
  alertType: AlertType.Success,
  closeAlert: () => set(({ showAlert: false })),
  setAlert: (body, alertType) => set({showAlert: true, body: body, alertType: alertType})
}));
