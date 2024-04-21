import { create } from "zustand";
import { DRAG_VECTOR_SCALE } from "../../common/three/config";
import { produce } from "immer";

export interface HoverProfileState {
  splitVectors: boolean;
  keepAngle: boolean;
  dragMultiplier: number;
  vectorSize: number;
  vector3rdNewton: boolean;
  centerVectors: boolean;
  airParticles: boolean;
  airVectors: boolean;
  airVectorsWithFlow: boolean;
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
  hover: Record<string, boolean>;
  mass: number;
  speed: number;
  fallVelocity: number;
  setMass: (value: number) => void;
  hoverOn: (value: string) => void;
  hoverOff: (value: string) => void;
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
  airParticles: false,
  airVectors: false,
  airVectorsWithFlow: false,
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
  hover: {
    Y: false,
    X: false,
    T: false,
    L: false,
    P: false,
    S: false,
  },
  mass: 0.5,
  speed: 1,
  fallVelocity: 0,
  setMass: (value) => set({ mass: value }),
  hoverOn: (value) =>
    set(
      produce((state) => {
        state.hover[value] = true;
      })
    ),
  hoverOff: (value) =>
    set(
      produce((state) => {
        state.hover[value] = false;
      })
    ),
  setSpeed: (value) => set({ speed: value }),
  set: (value) => set(value),
}));
