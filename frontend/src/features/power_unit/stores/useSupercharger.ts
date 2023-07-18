import { create } from "zustand";
import produce from "immer";
import { persist } from "zustand/middleware";

export interface GearState {
  enabled: boolean;
  startAltitude: number;
  endAltitude: number;
  startPower: number;
  endPower: number;
}

interface SuperchargerState {
  enabled: boolean;
  lowGear: GearState;
  highGear: GearState;
  setEnabled: (value: boolean) => void;
  setLGendAltitude: (value: number) => void;
  setLGstartPower: (value: number) => void;
  setLGendPower: (value: number) => void;
  setHGEnabled: (value: boolean) => void;
  setHGstartAltitude: (value: number) => void;
  setHGstartPower: (value: number) => void;
  setHGendAltitude: (value: number) => void;
  setHGendPower: (value: number) => void;
}

export const useSuperchargerStore = create<SuperchargerState>()(
  persist(
    (set) => ({
      enabled: true,
      lowGear: {
        enabled: true,
        startAltitude: 0,
        endAltitude: 3,
        startPower: 800,
        endPower: 1000,
      },
      highGear: {
        enabled: false,
        startAltitude: 5,
        endAltitude: 8,
        startPower: 960,
        endPower: 1000,
      },
      setEnabled: (value) => set((state) => ({ enabled: value })),
      setLGendAltitude: (value) =>
        set(
          produce((state) => {
            state.lowGear.endAltitude = value;
          })
        ),
      setLGendPower: (value) =>
        set(
          produce((state) => {
            state.lowGear.endPower = value;
          })
        ),
      setLGstartPower: (value) =>
        set(
          produce((state) => {
            state.lowGear.startPower = value;
          })
        ),
      setHGEnabled: (value) =>
        set(
          produce((state) => {
            state.highGear.enabled = value;
          })
        ),
      setHGstartAltitude: (value) =>
        set(
          produce((state) => {
            state.highGear.startAltitude = value;
          })
        ),
      setHGstartPower: (value) =>
        set(
          produce((state) => {
            state.highGear.startPower = value;
          })
        ),
      setHGendAltitude: (value) =>
        set(
          produce((state) => {
            state.highGear.endAltitude = value;
          })
        ),
      setHGendPower: (value) =>
        set(
          produce((state) => {
            state.highGear.endPower = value;
          })
        ),
    }),
    { name: "Supercharger" }
  )
);
