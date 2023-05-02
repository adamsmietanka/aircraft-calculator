import create from "zustand";

interface SuperchargerState {
  enabled: boolean;
  LGendAltitude: number;
  LGendPower: number;
  HGenabled: boolean;
  HGstartAltitude: number;
  HGendAltitude: number;
  HGendPower: number;
  setEnabled: (value: boolean) => void;
  setLGendAltitude: (value: number) => void;
  setLGendPower: (value: number) => void;
  setHGEnabled: (value: boolean) => void;
  setHGstartAltitude: (value: number) => void;
  setHGendAltitude: (value: number) => void;
  setHGendPower: (value: number) => void;
}

export const useSuperchargerStore = create<SuperchargerState>()((set) => ({
  enabled: false,
  LGendAltitude: 3,
  LGendPower: 1000,
  HGenabled: false,
  HGstartAltitude: 5,
  HGendAltitude: 8,
  HGendPower: 960,
  setEnabled: (value) => set((state) => ({ enabled: value })),
  setLGendAltitude: (value) => set((state) => ({ LGendAltitude: value })),
  setLGendPower: (value) => set((state) => ({ LGendPower: value })),
  setHGEnabled: (value) => set((state) => ({ HGenabled: value })),
  setHGstartAltitude: (value) => set((state) => ({ HGstartAltitude: value })),
  setHGendAltitude: (value) => set((state) => ({ HGendAltitude: value })),
  setHGendPower: (value) => set((state) => ({ HGendPower: value })),
}));
