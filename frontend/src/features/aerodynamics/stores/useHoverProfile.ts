import { create } from "zustand";
import { DRAG_VECTOR_SCALE } from "../../common/three/config";

export interface HoverProfileState {
  splitVectors: boolean;
  keepAngle: boolean;
  dragMultiplier: number;
  vectorSize: number;
  vector3rdNewton: boolean;
  centerVectors: boolean;
  airVectors: boolean;
  airVectorsUpper: boolean;
  airVectorsLower: boolean;
  airVectorsCenter: boolean;
  pressuresShow: boolean;
  pressureUpper: boolean;
  pressureLower: boolean;
  pressuresEqual: boolean;
  vectorsNet: boolean;
  axis: boolean;
  axisCenter: boolean;
  moment: boolean;
  showVectors: boolean;
  flattenOutline: boolean;
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
  vector3rdNewton: false,
  centerVectors: false,
  airVectors: false,
  airVectorsUpper: false,
  airVectorsLower: false,
  airVectorsCenter: false,
  pressuresShow: false,
  pressureUpper: false,
  pressureLower: false,
  pressuresEqual: true,
  vectorsNet: false,
  axis: false,
  axisCenter: true,
  moment: false,
  showVectors: true,
  flattenOutline: false,
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
