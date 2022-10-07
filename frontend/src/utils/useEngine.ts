import create from 'zustand'

interface EngineState {
  seaLevelPower: number
  engineSpeed: number
  reductionRatio: number
  maxAltitude: number
  kCoefficient: number
  setSeaLevelPower: (value: number) => void
  setEngineSpeed: (value: number) => void
  setReductionRatio: (value: number) => void
}

export const useEngineStore = create<EngineState>()((set) => ({
  seaLevelPower: 1000,
  engineSpeed: 3000,
  reductionRatio: 0.4,
  maxAltitude: 5000,
  kCoefficient: 0.1,
  setSeaLevelPower: (value) => set((state) => ({ seaLevelPower: value })),
  setEngineSpeed: (value) => set((state) => ({ engineSpeed: value })),
  setReductionRatio: (value) => set((state) => ({ reductionRatio: value })),
}))