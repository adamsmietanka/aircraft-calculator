import create from 'zustand'

interface PropellerState {
  maxAirSpeed: number
  cruiseAltitude: number
  diameterType: string
  setMaxAirSpeed: (value: number) => void
  setCruiseAltitude: (value: number) => void
  setDiameterType: (value: string) => void
}

export const usePropellerStore = create<PropellerState>()((set) => ({
  maxAirSpeed: 120,
  cruiseAltitude: 3,
  diameterType: 'optimized',
  setMaxAirSpeed: (value) => set((state) => ({ maxAirSpeed: value })),
  setCruiseAltitude: (value) => set((state) => ({ cruiseAltitude: value })),
  setDiameterType: (value) => set((state) => ({diameterType: value}))
}))