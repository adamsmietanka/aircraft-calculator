import create from 'zustand'

interface LongitudalMomentState {
  cm0p: number
  alfa: Array<number>
  cx: Array<number>
  cz: Array<number>
  x_sa:number,
  x_sc:number,
  z_sa:number,
  z_sc:number,
  setCm0p: (value: number) => void
  setAlfa: (value: Array<number>) => void
  setCx: (value: Array<number>) => void
  setCz: (value: Array<number>) => void
  setX_sc: (value: number) => void
  setX_sa: (value: number) => void
  setZ_sc: (value: number) => void
  setZ_sa: (value: number) => void
}

export const useLongitudalMomentStore = create<LongitudalMomentState>()((set) => ({
  cm0p: 1000,
  alfa:[0],
  cx: [3000],
  cz: [0.4],
  x_sa:0.25,
  x_sc:0.2,
  z_sa:0.25,
  z_sc:0.2,
  setCm0p: (value) => set((state) => ({ cm0p: value })),
  setAlfa:(value) => set((state) => ({ cx: value })),
  setCx: (value) => set((state) => ({ cx: value })),
  setCz: (value) => set((state) => ({ cz: value })),
  setX_sa:(value) => set((state) => ({ x_sa: value })),
  setX_sc:(value) => set((state) => ({ x_sc: value })),
  setZ_sa:(value) => set((state) => ({ z_sa: value })),
  setZ_sc:(value) => set((state) => ({ z_sc: value })),
}))