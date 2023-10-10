import { create } from "zustand";

export interface CameraState {
  center: number[] | null;
  spherical: number[];
  set: (value: Partial<CameraState>) => void;
}

export const useCameraStore = create<CameraState>()((set) => ({
  center: null,
  spherical: [20, 90, 0],
  set: (value) => set(value),
}));
