import create from 'zustand'

interface LongitudalMomentState {
  cm0p: number
  cx: Array<number>
  cz: Array<number>
  setCm0p: (value: number) => void
  setCx: (value: Array<number>) => void
  setCz: (value: Array<number>) => void
}

export const useLongitudalMomentStore = create<LongitudalMomentState>()((set) => ({
  cm0p: 1000,
  cx: [3000],
  cz: [0.4],
  setCm0p: (value) => set((state) => ({ cm0p: value })),
  setCx: (value) => set((state) => ({ cx: value })),
  setCz: (value) => set((state) => ({ cz: value }))
}))