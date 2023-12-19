import { create } from "zustand";
import { DRAG_VECTOR_SCALE } from "../../common/three/config";

export interface HoverProfileState {
  splitVectors: boolean;
  keepAngle: boolean;
  dragMultiplier: number;
  vectorSize: number;
  centerVectors: boolean;
  pressuresShow: boolean;
  pressuresEqual: boolean;
  vectorsNet: boolean;
  moment: boolean;
  showNewton: boolean;
  showNewtonVelocity: boolean;
  showNewtonAccel: boolean;
  showNewtonForce: boolean;
  showVectors: boolean;
  flattenOutline: boolean;
  misconception: boolean;
  misconceptionSwap: boolean;
  misconceptionConst: boolean;
  misconceptionBigger: boolean;
  misconceptionError: boolean;
  showWeight: boolean;
  hoverPlane: boolean;
  showChord: boolean;
  showCamber: boolean;
  hoverA: boolean;
  hoverB: boolean;
  hoverC: boolean;
  mass: number;
  speed: number;
  fallVelocity: number;
  setMass: (value: number) => void;
  setSpeed: (value: number) => void;
  set: (value: Partial<HoverProfileState>) => void;
}

export const useHoverProfileStore = create<HoverProfileState>()((set) => ({
  splitVectors: true,
  keepAngle: false,
  dragMultiplier: DRAG_VECTOR_SCALE,
  vectorSize: 1,
  centerVectors: false,
  pressuresShow: false,
  pressuresEqual: true,
  vectorsNet: false,
  moment: false,
  showNewton: false,
  showNewtonVelocity: false,
  showNewtonAccel: false,
  showNewtonForce: false,
  showVectors: true,
  flattenOutline: false,
  misconception: false,
  misconceptionSwap: false,
  misconceptionConst: false,
  misconceptionBigger: false,
  misconceptionError: false,
  showWeight: false,
  showChord: true,
  showCamber: true,
  hoverPlane: false,
  hoverA: false,
  hoverB: false,
  hoverC: false,
  mass: 0.5,
  speed: 1,
  fallVelocity: 0,
  setMass: (value) => set({ mass: value }),
  setSpeed: (value) => set({ speed: value }),
  set: (value) => set(value),
}));
