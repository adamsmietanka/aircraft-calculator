import { create } from "zustand";

export interface InducedDragState {
  tunnel: boolean;
  potential: boolean;
  speedUp: boolean;
  set: (value: Partial<InducedDragState>) => void;
}

export const useInducedDragStore = create<InducedDragState>()((set) => ({
  tunnel: false,
  potential: true,
  speedUp: false,
  set: (value) => set(value),
}));
