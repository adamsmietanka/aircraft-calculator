import { create } from 'zustand';
import { DRAG_VECTOR_SCALE } from '../../common/three/config';

export interface HoverProfileState {
  splitVectors: boolean;
  dragMultiplier: number;
  vectorSize: number;
  showWeight: boolean;
  hoverPlane: boolean;
  showChord: boolean;
  showCamber: boolean;
  hoverA: boolean;
  hoverB: boolean;
  hoverC: boolean;
  mass: number;
  speed: number;
  setMass: (value: number) => void;
  setSpeed: (value: number) => void;
  set: (value: Partial<HoverProfileState>) => void;
}

export const useHoverProfileStore = create<HoverProfileState>()((set) => ({
  splitVectors: true,
  dragMultiplier: DRAG_VECTOR_SCALE,
  vectorSize: 1,
  showWeight: false,
  showChord: true,
  showCamber: true,
  hoverPlane: false,
  hoverA: false,
  hoverB: false,
  hoverC: false,
  mass: 0.5,
  speed: 1,
  setMass: (value) => set({ mass: value }),
  setSpeed: (value) => set({ speed: value }),
  set: (value) => set(value),
}));
