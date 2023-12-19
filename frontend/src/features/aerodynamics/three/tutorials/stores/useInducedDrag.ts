import { create } from "zustand";

export interface InducedDragState {
  tunnel: boolean;
  wing: boolean;
  span: number;
  potential: boolean;
  speedUp: boolean;
  set: (value: Partial<InducedDragState>) => void;
}

export const useInducedDragStore = create<InducedDragState>()((set) => ({
  tunnel: false,
  wing: false,
  span: 10,
  potential: true,
  speedUp: false,
  set: (value) => set(value),
}));
