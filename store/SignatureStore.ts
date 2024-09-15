import { create } from "zustand";

type SignatureState = {
  visible: boolean;
  selectedRow: Record<string, any> | null;
  setSelectedRow: (row: Record<string, any> | null, visible: boolean) => void;
};

const useSignatureStore = create<SignatureState>((set) => ({
  visible: false,
  selectedRow: null,
  setSelectedRow: (row, visible) => set({ selectedRow: row, visible }),
}));

export default useSignatureStore;
