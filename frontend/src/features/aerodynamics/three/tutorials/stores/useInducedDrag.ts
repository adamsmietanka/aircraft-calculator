import { create } from "zustand";

export interface InducedDragState {
  tunnel: boolean;
  wing: boolean;
  wingspan: number;
  span: boolean;
  signs: boolean;
  moveSigns: boolean;
  airstreamOpacity: number;
  vortex: boolean;
  isWing: boolean;
  lift: boolean;
  direction: boolean;
  velocities: boolean;
  drag: boolean;
  effLift: boolean;
  set: (value: Partial<InducedDragState>) => void;
}

export const useInducedDragStore = create<InducedDragState>()((set) => ({
  tunnel: false,
  wing: false,
  wingspan: 10,
  span: false,
  signs: false,
  moveSigns: false,
  airstreamOpacity: 0,
  vortex: false,
  isWing: false,
  lift: false,
  direction: false,
  velocities: false,
  drag: false,
  effLift: false,
  set: (value) => set(value),
}));
