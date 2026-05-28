import { create } from "zustand";

type PrescriptionState = {
  photoUri: string | null;
  notes: string;
  setPhotoUri: (photoUri: string | null) => void;
  setNotes: (notes: string) => void;
  clear: () => void;
};

export const usePrescriptionStore = create<PrescriptionState>((set) => ({
  photoUri: null,
  notes: "",
  setPhotoUri: (photoUri) => set({ photoUri }),
  setNotes: (notes) => set({ notes }),
  clear: () => set({ photoUri: null, notes: "" }),
}));
