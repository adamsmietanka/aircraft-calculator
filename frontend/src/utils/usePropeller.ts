import create from 'zustand'

interface PropellerState {
  maxAirSpeed: number
  cruiseAltitude: number
  setMaxAirSpeed: (value: number) => void
  setCruiseAltitude: (value: number) => void
}

export const usePropellerStore = create<PropellerState>()((set) => ({
  maxAirSpeed: 120,
  cruiseAltitude: 3,
  setMaxAirSpeed: (value) => set((state) => ({ maxAirSpeed: value })),
  setCruiseAltitude: (value) => set((state) => ({ cruiseAltitude: value })),
}))