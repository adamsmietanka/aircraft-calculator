import { BoxGeometry, BufferGeometry } from "three";
import { create } from "zustand";

interface GeometryState {
  vertical: BufferGeometry;
  horizontal: BufferGeometry;
  set: (value: Partial<GeometryState>) => void;
}

export const usePlaneGeometryStore = create<GeometryState>()((set) => ({
  vertical: new BoxGeometry(),
  horizontal: new BoxGeometry(),
  set: (value) => set(value),
}));
