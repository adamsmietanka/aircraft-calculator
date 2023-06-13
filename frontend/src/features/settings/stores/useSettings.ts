import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  wireframe: boolean;
  autoRotate: boolean;
  setWireframe: (value: boolean) => void;
  setAutoRotate: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      wireframe: false,
      autoRotate: true,
      setWireframe: (value) => set((state) => ({ wireframe: value })),
      setAutoRotate: (value) => set((state) => ({ autoRotate: value })),
    }),
    { name: "settings" }
  )
);
