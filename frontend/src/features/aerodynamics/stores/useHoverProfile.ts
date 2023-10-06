import { create } from "zustand";
import { DRAG_VECTOR_SCALE } from "../../common/three/config";

export interface HoverProfileState {
  splitVectors: boolean;
  dragMultiplier: number;
  vectorSize: number;
  hoverPlane: boolean;
  showChord: boolean;
  showCamber: boolean;
  hoverA: boolean;
  hoverB: boolean;
  hoverC: boolean;
  setHoverPlane: (value: boolean) => void;
  setHoverA: (value: boolean) => void;
  setHoverB: (value: boolean) => void;
  setHoverC: (value: boolean) => void;
  set: (value: Partial<HoverProfileState>) => void;
}

export const useHoverProfileStore = create<HoverProfileState>()((set) => ({
  splitVectors: true,
  dragMultiplier: DRAG_VECTOR_SCALE,
  vectorSize: 1,
  showChord: true,
  showCamber: true,
  hoverPlane: false,
  hoverA: false,
  hoverB: false,
  hoverC: false,
  setHoverPlane: (value) => set({ hoverPlane: value }),
  setHoverA: (value) => set({ hoverA: value }),
  setHoverB: (value) => set({ hoverB: value }),
  setHoverC: (value) => set({ hoverC: value }),
  set: (value) => set(value),
}));
